import { Canvas, TMat2D, util } from "fabric";
import { useCallback, useEffect } from "react";

interface UseAutoResizeProps {
	canvas: Canvas | null;
	container: HTMLDivElement | null;
}

export const UseAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
	const autoZoom = useCallback(() => {
		if (!canvas || !container) return;

		const width = container.offsetWidth;
		const height = container.offsetHeight;

		// If the container has no size, we cannot resize the canvas. This can happen if the container is not yet rendered or is hidden.
		if (width === 0 || height === 0) return;

		// Update canvas dimensions to match the container size. This is necessary for findScaleToFit to work correctly.
		canvas.setDimensions({ width, height });

		// Extract dimensions of the canvas content (not the container) to fit into the container.
		const canvasDimensions = {
			width: canvas.getWidth(),
			height: canvas.getHeight(),
		};

		// Calculate proper fit scale ratio
		const scale = util.findScaleToFit(canvasDimensions, {
			width: width,
			height: height,
		});

		const zoomRatio = 0.85; // Leave 15% padding around the canvas
		const zoom = zoomRatio * scale;

		// Get the center coordinates of the canvas
		const canvasCenter = canvas.getCenterPoint();

		const updatedTransform: TMat2D = [
			zoom,
			0,
			0,
			zoom,
			width / 2 - canvasCenter.x * zoom,
			height / 2 - canvasCenter.y * zoom,
		];

		canvas.setViewportTransform(updatedTransform);

		// Render synchronously, NOT via requestRenderAll(). setDimensions() above rewrote
		// the canvas element's width/height, which clears its bitmap immediately;
		// requestRenderAll() only schedules the repaint for the NEXT animation frame, so
		// the frame painted right now would show an empty canvas — that is the flicker.
		canvas.renderAll();
	}, [canvas, container]);

	useEffect(() => {
		let resizeObserver: ResizeObserver | null = null;

		if (canvas && container) {
			// Call autoZoom straight from the observer callback — no requestAnimationFrame
			// hop. ResizeObserver callbacks are already delivered once per frame, after
			// layout and before paint, so they coalesce bursts on their own; deferring to
			// the next frame only guarantees a frame of stale canvas size.
			resizeObserver = new ResizeObserver(() => {
				autoZoom();
			});

			resizeObserver.observe(container);
		}

		return () => {
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
		};
	}, [canvas, container, autoZoom]);

	return { autoZoom };
};
