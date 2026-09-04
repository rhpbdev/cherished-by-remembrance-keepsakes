import { useEffect } from "react";
import { Canvas, FabricObject } from "fabric";

interface UseCanvasEventsProps {
	save: () => void;
	canvas: Canvas | null;
	setSelectedObjects: (objects: FabricObject[]) => void;
	clearSelectionCallback?: () => void;
}

export const useCanvasEvents = ({
	save,
	canvas,
	setSelectedObjects,
	clearSelectionCallback,
}: UseCanvasEventsProps) => {
	useEffect(() => {
		if (!canvas) return;

		const hoveredObject = { current: null as FabricObject | null };

		const disposeObjectAdded = canvas.on("object:added", (e) => {
			console.log("Object added:", e.target);
		});

		const disposeObjectModified = canvas.on("object:modified", (e) => {
			console.log("Object modified:", e.target);
		});

		const disposeObjectRemoved = canvas.on("object:removed", (e) => {
			console.log("Object removed:", e.target);
		});

		// Fabric 7.x returns a cleanup function directly from .on()
		const disposeCreated = canvas.on("selection:created", (e) => {
			// console.log("Selection created:", e.selected[0]);
			setSelectedObjects(e.selected || []);
			save();
		});

		const disposeUpdated = canvas.on("selection:updated", (e) => {
			// console.log("Selection updated:", e.selected);
			setSelectedObjects(e.selected || []);
			save();
		});

		const disposeCleared = canvas.on("selection:cleared", () => {
			// console.log("Selection cleared");
			setSelectedObjects([]);
			clearSelectionCallback?.();
			save();
		});

		const disposeHoverOn = canvas.on("mouse:over", (e) => {
			const target = e.target;
			if (!target || target.name === "clip") return;

			hoveredObject.current = target;
			canvas.requestRenderAll();
		});

		const disposeHoverOff = canvas.on("mouse:out", (e) => {
			const target = e.target;
			if (!target || target.name === "clip") return;

			hoveredObject.current = null;
			canvas.requestRenderAll();
		});

		const disposeAfterRender = canvas.on("after:render", () => {
			const obj = hoveredObject.current;
			if (!obj) return;

			const bound = obj.getBoundingRect();
			const vpt = canvas.viewportTransform;
			if (!vpt) return;

			const left = bound.left * vpt[0] + bound.top * vpt[2] + vpt[4];
			const top = bound.left * vpt[1] + bound.top * vpt[3] + vpt[5];
			const right =
				(bound.left + bound.width) * vpt[0] +
				(bound.top + bound.height) * vpt[2] +
				vpt[4];
			const bottom =
				(bound.left + bound.width) * vpt[1] +
				(bound.top + bound.height) * vpt[3] +
				vpt[5];

			const ctx = canvas.contextContainer;
			if (!ctx) return;
			ctx.save();
			ctx.strokeStyle = "#ad46ff";
			ctx.lineWidth = 3;
			ctx.strokeRect(left - 1, top - 1, right - left + 2, bottom - top + 2);
			ctx.restore();
		});

		// Clean up by executing the disposal functions
		return () => {
			disposeCreated();
			disposeUpdated();
			disposeCleared();
			disposeHoverOn();
			disposeHoverOff();
			disposeAfterRender();
			disposeObjectAdded();
			disposeObjectRemoved();
			disposeObjectModified();
		};
	}, [save, canvas, setSelectedObjects, clearSelectionCallback]);
};
