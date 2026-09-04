import { Canvas } from "fabric";
import { useCallback, useState, useRef } from "react";

interface UseHistoryProps {
	canvas: Canvas | null;
}

export const useHistory = ({ canvas }: UseHistoryProps) => {
	const [historyIndex, setHistoryIndex] = useState<number>(0);
	const canvasHistory = useRef<string[]>([]);
	const skipSave = useRef<boolean>(false);

	// Mirrors historyIndex so save() can read the current position without
	// taking it as a dependency. save() is in the useCanvasEvents dep array,
	// so a new identity there tears down and re-registers every canvas handler.
	const historyIndexRef = useRef<number>(0);

	const setIndex = useCallback((index: number) => {
		historyIndexRef.current = index;
		setHistoryIndex(index);
	}, []);

	const canUndo = useCallback(() => {
		return historyIndex > 0;
	}, [historyIndex]);

	const canRedo = useCallback(() => {
		return historyIndex < canvasHistory.current.length - 1;
	}, [historyIndex]);

	const save = useCallback(
		(skip = false) => {
			if (!canvas) return;

			const currentState = canvas.toJSON();
			const json = JSON.stringify(currentState);

			if (!skip && !skipSave.current) {
				// Discard any redo branch we have moved off of before appending,
				// otherwise undo walks back into states the current canvas never
				// came from.
				canvasHistory.current = canvasHistory.current.slice(
					0,
					historyIndexRef.current + 1,
				);

				canvasHistory.current.push(json);
				setIndex(canvasHistory.current.length - 1);
			}

			// TODO: Save callback
		},
		[canvas, setIndex],
	);

	const undo = useCallback(() => {
		if (canUndo()) {
			skipSave.current = true;

			canvas?.clear();
			canvas?.renderAll();

			const previousIndex = historyIndex - 1;
			const previousState = JSON.parse(canvasHistory.current[previousIndex]);

			canvas
				?.loadFromJSON(previousState)
				.then(() => {
					canvas.requestRenderAll();
					setIndex(previousIndex);
					skipSave.current = false;
				})
				.catch((error) => {
					console.error("Failed to load previous state:", error);
					skipSave.current = false;
				});
		}
	}, [canvas, canUndo, historyIndex, setIndex]);

	const redo = useCallback(() => {
		if (canRedo()) {
			skipSave.current = true;

			canvas?.clear();
			canvas?.renderAll();

			const nextIndex = historyIndex + 1;
			const nextState = JSON.parse(canvasHistory.current[nextIndex]);

			canvas
				?.loadFromJSON(nextState)
				.then(() => {
					canvas.requestRenderAll();
					setIndex(nextIndex);
					skipSave.current = false;
				})
				.catch((error) => {
					console.error("Failed to load next state:", error);
					skipSave.current = false;
				});
		}
	}, [canvas, canRedo, historyIndex, setIndex]);

	return {
		save,
		undo,
		redo,
		canUndo,
		canRedo,
		// Exported as setHistoryIndex so callers (useEditor.init) keep the
		// mirrored ref in sync; handing out the raw setState would desync it.
		setHistoryIndex: setIndex,
		canvasHistory,
	};
};
