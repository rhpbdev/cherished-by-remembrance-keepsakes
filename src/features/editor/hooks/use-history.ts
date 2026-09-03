import { Canvas } from "fabric";
import { useCallback, useState, useRef } from "react";

interface UseHistoryProps {
	canvas: Canvas | null;
}

export const useHistory = ({ canvas }: UseHistoryProps) => {
	const [historyIndex, setHistoryIndex] = useState<number>(0);
	const canvasHistory = useRef<string[]>([]);
	const skipSave = useRef<boolean>(false);

	const canUndo = useCallback(() => {
		console.log("Can undo...");
		return historyIndex > 0;
	}, [historyIndex]);

	const canRedo = useCallback(() => {
		console.log("Can redo...");
		return historyIndex < canvasHistory.current.length - 1;
	}, [historyIndex]);

	const save = useCallback(
		(skip = false) => {
			if (!canvas) return;

			const currentState = canvas.toJSON();
			const json = JSON.stringify(currentState);

			if (!skip && !skipSave.current) {
				canvasHistory.current.push(json);
				setHistoryIndex(canvasHistory.current.length - 1);
			}

			// TODO: Save callback

			console.log("Saving...");
		},
		[canvas],
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
					setHistoryIndex(previousIndex);
					skipSave.current = false;
				})
				.catch((error) => {
					console.error("Failed to load previous state:", error);
					skipSave.current = false;
				});
		}
	}, [canvas, canUndo, historyIndex]);

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
					setHistoryIndex(nextIndex);
					skipSave.current = false;
				})
				.catch((error) => {
					console.error("Failed to load next state:", error);
					skipSave.current = false;
				});
		}
	}, [canvas, canRedo, historyIndex]);

	return { save, undo, redo, canUndo, canRedo, setHistoryIndex, canvasHistory };
};
