import {
	Canvas,
	Circle,
	FabricObject,
	InteractiveFabricObject,
	Polygon,
	Rect,
	Triangle,
} from "fabric";
import { useCallback, useMemo, useState } from "react";
import {
	BuildEditorProps,
	CIRCLE_OPTIONS,
	DIAMOND_OPTIONS,
	Editor,
	EditorHookProps,
	FILL_COLOR,
	RECTANGLE_OPTIONS,
	STROKE_COLOR,
	STROKE_WIDTH,
	TRIANGLE_OPTIONS,
} from "../types";
import { isTextType } from "../utils";
import { UseAligningGuidelines } from "./use-aligning-guidelines";
import { UseAutoResize } from "./use-auto-resize";
import { UseCanvasEvents } from "./use-canvas-events";

const buildEditor = ({
	canvas,
	autoZoom,
	fillColor,
	strokeColor,
	strokeWidth,
	selectedObjects,
	setFillColor,
	setStrokeColor,
	setStrokeWidth,
}: BuildEditorProps & {
	fillColor: string;
	strokeColor: string;
	strokeWidth: number;
	setFillColor: (value: string) => void;
	setStrokeColor: (value: string) => void;
	setStrokeWidth: (value: number) => void;
}): Editor => {
	const addToCanvas = (object: FabricObject) => {
		if (!canvas) return;

		canvas.centerObject(object);
		canvas.add(object);
		canvas.setActiveObject(object);
		canvas.requestRenderAll();
	};

	return {
		autoZoom: () => {
			autoZoom();
		},
		zoomIn: () => {
			let zoomRatio = canvas.getZoom();
			zoomRatio += 0.05;
			const center = canvas.getCenterPoint();
			canvas.zoomToPoint(center, zoomRatio > 1 ? 1 : zoomRatio);
		},
		zoomOut: () => {
			let zoomRatio = canvas.getZoom();
			zoomRatio -= 0.05;
			const center = canvas.getCenterPoint();
			canvas.zoomToPoint(center, zoomRatio < 0.2 ? 0.2 : zoomRatio);
		},
		getActiveFillColor: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return fillColor;
			}

			const value = selectedObject.fill || fillColor;

			// Gradients & patterns are returned as an object, so we need to handle that case separately.
			// For now, we will just return the default fill color as a string.
			return value as string;
		},
		getActiveStrokeColor: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return strokeColor;
			}

			const value = selectedObject.stroke || strokeColor;

			return value as string;
		},
		changeFillColor: (value: string) => {
			setFillColor(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ fill: value });
			});

			canvas.requestRenderAll();
		},
		changeStrokeColor: (value: string) => {
			setStrokeColor(value);
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					object.set({ fill: value });
					return;
				}
				object.set({ stroke: value });
			});
			canvas.requestRenderAll();
		},
		changeStrokeWidth: (value: number) => {
			setStrokeWidth(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ strokeWidth: value });
			});
			canvas.requestRenderAll();
		},
		addCircle: () => {
			const object = new Circle({
				...CIRCLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
			});

			addToCanvas(object);
		},
		addDiamond: () => {
			const HEIGHT = DIAMOND_OPTIONS.height as number;
			const WIDTH = DIAMOND_OPTIONS.width as number;

			const object = new Polygon(
				[
					{ x: WIDTH / 2, y: 0 },
					{ x: WIDTH, y: HEIGHT / 2 },
					{ x: WIDTH / 2, y: HEIGHT },
					{ x: 0, y: HEIGHT / 2 },
				],
				{
					...DIAMOND_OPTIONS,
					fill: fillColor,
					stroke: strokeColor,
					strokeWidth: strokeWidth,
				},
			);

			addToCanvas(object);
		},
		addRectangle: () => {
			const object = new Rect({
				...RECTANGLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
			});

			addToCanvas(object);
		},
		addRectangleRounded: () => {
			const object = new Rect({
				...RECTANGLE_OPTIONS,
				rx: 25,
				ry: 25,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
			});

			addToCanvas(object);
		},
		addTriangle: () => {
			const object = new Triangle({
				...TRIANGLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
			});

			addToCanvas(object);
		},
		addTriangleInverse: () => {
			const HEIGHT = TRIANGLE_OPTIONS.height as number;
			const WIDTH = TRIANGLE_OPTIONS.width as number;

			const object = new Polygon(
				[
					{ x: 0, y: 0 },
					{ x: WIDTH, y: 0 },
					{ x: WIDTH / 2, y: HEIGHT },
				],
				{
					...TRIANGLE_OPTIONS,
					fill: fillColor,
					stroke: strokeColor,
					strokeWidth: strokeWidth,
				},
			);

			addToCanvas(object);
		},
		canvas,
		fillColor,
		strokeWidth,
		strokeColor,
		selectedObjects,
	};
};

export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
	// State for main canvas object, container, and selected objects
	const [canvas, setCanvas] = useState<Canvas | null>(null);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [selectedObjects, setSelectedObjects] = useState<FabricObject[]>([]);

	// Prepare initial settings for new objects
	const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
	const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
	const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);

	const { autoZoom } = UseAutoResize({
		canvas,
		container,
	});

	UseCanvasEvents({
		canvas,
		setSelectedObjects,
		clearSelectionCallback,
	});

	UseAligningGuidelines({
		canvas,
	});

	// Don't need to put dispatch functions inside of useMemo dependencies/dependency array, as they are guaranteed to be stable by React.
	const editor = useMemo(() => {
		if (!canvas) return undefined;

		return buildEditor({
			canvas,
			autoZoom,
			fillColor,
			strokeColor,
			strokeWidth,
			selectedObjects,
			setFillColor,
			setStrokeColor,
			setStrokeWidth,
		});
	}, [canvas, autoZoom, fillColor, strokeColor, strokeWidth, selectedObjects]);

	const init = useCallback(
		({
			initialCanvas,
			initialContainer,
		}: {
			initialCanvas: Canvas;
			initialContainer: HTMLDivElement;
		}) => {
			// Customize the appearance of the selection controls
			InteractiveFabricObject.ownDefaults = {
				...InteractiveFabricObject.ownDefaults,
				cornerColor: "#fff",
				cornerStyle: "circle",
				// cornerStrokeColor: '#9c9c9c',
				// borderColor: '#009ceb',
				cornerStrokeColor: "#3b82f6",
				borderColor: "#3b82f6",
				borderScaleFactor: 2,
				transparentCorners: false,
				borderOpacityWhenMoving: 1,
				padding: 0,
			};

			// Set the canvas dimensions to match the container
			initialCanvas.setDimensions({
				width: initialContainer.offsetWidth,
				height: initialContainer.offsetHeight,
			});

			setCanvas(initialCanvas);
			setContainer(initialContainer);
		},
		[],
	);

	return {
		init,
		editor,
	};
};
