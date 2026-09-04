import { Canvas } from "fabric";
import { useCallback, useState, useRef } from "react";

interface UseHistoryProps {
	canvas: Canvas | null;
}

export const useHistory = ({ canvas }: UseHistoryProps) => {
	const [historyIndex, setHistoryIndex] = useState<number>(0);
	// Ends in "Ref" on purpose: the React Compiler, and the react-hooks lint rule
	// built on it, only recognise a value returned from a custom hook as a ref by
	// that suffix. Without it, consumers writing to `.current` are flagged as
	// mutating a hook return value.
	const canvasHistoryRef = useRef<string[]>([]);
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
		return historyIndex < canvasHistoryRef.current.length - 1;
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
				canvasHistoryRef.current = canvasHistoryRef.current.slice(
					0,
					historyIndexRef.current + 1,
				);

				canvasHistoryRef.current.push(json);
				setIndex(canvasHistoryRef.current.length - 1);
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
			const previousState = JSON.parse(canvasHistoryRef.current[previousIndex]);

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
			const nextState = JSON.parse(canvasHistoryRef.current[nextIndex]);

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
		canvasHistoryRef,
	};
};
