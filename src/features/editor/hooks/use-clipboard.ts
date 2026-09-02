import { ActiveSelection, Canvas, FabricObject } from "fabric";
import { useCallback, useRef } from "react";

interface UseClipboardProps {
	canvas: Canvas | null;
}

export const useClipboard = ({ canvas }: UseClipboardProps) => {
	const clipboard = useRef<FabricObject | null>(null);

	// Copy method is asynchronous
	const copy = useCallback(async () => {
		const activeObject = canvas?.getActiveObject();
		if (!activeObject) return;

		try {
			const cloned = await activeObject.clone();
			clipboard.current = cloned;
		} catch (error) {
			console.error("Failed to copy object: ", error);
		}
	}, [canvas]);

	// Paste method is asynchronous
	const paste = useCallback(async () => {
		if (!clipboard.current || !canvas) return;

		try {
			const clonedObj = await clipboard.current.clone();

			canvas.discardActiveObject();

			clonedObj.set({
				left: (clonedObj.left ?? 0) + 10,
				top: (clonedObj.top ?? 0) + 10,
				evented: true,
			});

			// Use instanceof to check if the cloned object is an ActiveSelection (.type is deprecated)
			if (clonedObj instanceof ActiveSelection) {
				clonedObj.canvas = canvas;
				clonedObj.forEachObject((obj: FabricObject) => {
					canvas.add(obj);
				});
				clonedObj.setCoords();
			} else {
				canvas.add(clonedObj);
			}

			// Update clipboard position for next paste
			const clipboardLeft = clipboard.current.left ?? 0;
			const clipboardTop = clipboard.current.top ?? 0;
			clipboard.current.set({
				left: clipboardLeft + 10,
				top: clipboardTop + 10,
			});

			canvas.setActiveObject(clonedObj);
			canvas.requestRenderAll();
		} catch (error) {
			console.error("Failed to paste object:", error);
		}
	}, [canvas]);

	return { copy, paste };
};
