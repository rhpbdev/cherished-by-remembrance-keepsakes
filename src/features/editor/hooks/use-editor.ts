import {
	Canvas,
	Circle,
	FabricObject,
	InteractiveFabricObject,
	Polygon,
	Rect,
	Shadow,
	Triangle,
} from "fabric";
import { useCallback, useMemo, useState } from "react";

import {
	CIRCLE_OPTIONS,
	DIAMOND_OPTIONS,
	EditorHookProps,
	FILL_COLOR,
	RECTANGLE_OPTIONS,
	STROKE_COLOR,
	STROKE_DASH_ARRAY,
	STROKE_WIDTH,
	TRIANGLE_OPTIONS,
	type BuildEditorProps,
	type Editor,
} from "@/features/editor/types";
import { isTextType } from "@/features/editor/utils";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { useCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import { useAligningGuidelines } from "./use-aligning-guidelines";

// 1. Build the editor object that will contain all the methods for manipulating the canvas. This object will be created once and memoized, so it doesn't cause unnecessary re-renders. Takes inspiration from the Fabric.js canvas API (fabric-react package / react-canvas).
const buildEditor = ({
	canvas,
	fillColor,
	strokeColor,
	strokeWidth,
	selectedObjects,
	strokeDashArray,
	autoZoom,
	setFillColor,
	setStrokeColor,
	setStrokeWidth,
	setStrokeDashArray,
}: BuildEditorProps): Editor => {
	// Helper: finds the main canvas area (white background)
	const getWorkspace = () => {
		return canvas.getObjects().find((object) => object.name === "clip") as Rect;
	};

	// Helper: Standard flow for adding new objects: 1. center → 2. add → 3. select → 4. render
	const addToCanvas = (object: FabricObject) => {
		center(object);
		canvas.add(object);
		canvas.setActiveObject(object);
		canvas.requestRenderAll();
	};

	// Helper: Centers object in workspace using Fabric's internal method
	const center = (object: FabricObject) => {
		const workspace = getWorkspace();
		const center = workspace?.getCenterPoint();

		if (!center) return;

		canvas._centerObject(object, center);
	};

	return {
		// --- Viewport ---
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

		// --- Shape creation ---
		addCircle: () => {
			const object = new Circle({
				...CIRCLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
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
					strokeDashArray: strokeDashArray,
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
				strokeDashArray: strokeDashArray,
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
				strokeDashArray: strokeDashArray,
			});

			addToCanvas(object);
		},
		addTriangle: () => {
			const object = new Triangle({
				...TRIANGLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
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
					strokeDashArray: strokeDashArray,
				},
			);

			addToCanvas(object);
		},

		// --- Text creation ---
		addText: () => {

		},

		// --- Arrangement (layer order & positioning) ---
		bringForward: () => {
			canvas.getActiveObjects().forEach((object) => {
				canvas.bringObjectForward(object);
			});

			canvas.requestRenderAll();

			const workspace = getWorkspace();
			if (workspace) canvas.sendObjectToBack(workspace);
		},
		sendBackward: () => {
			canvas.getActiveObjects().forEach((object) => {
				canvas.sendObjectBackwards(object);
			});

			canvas.requestRenderAll();

			const workspace = getWorkspace();
			if (workspace) canvas.sendObjectToBack(workspace);
			// TODO: Fix workspace overflow
		},
		centerFabricObject: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) return;

			center(selectedObject);
			canvas.requestRenderAll();
		},

		// --- Appearance: fill ---
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
		changeFillColor: (value: string) => {
			setFillColor(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ fill: value });
			});

			canvas.requestRenderAll();
		},

		// --- Appearance: stroke color ---
		getActiveStrokeColor: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return strokeColor;
			}

			const value = selectedObject.stroke || strokeColor;

			return value as string;
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

		// --- Appearance: stroke width ---
		getActiveStrokeWidth: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return strokeWidth;
			}

			const value = selectedObject.strokeWidth ?? strokeWidth;

			return value;
		},
		changeStrokeWidth: (value: number) => {
			setStrokeWidth(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ strokeWidth: value });
			});
			canvas.requestRenderAll();
		},

		// --- Appearance: stroke dash array ---
		getActiveStrokeDashArray: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return strokeDashArray;
			}

			const value = selectedObject.strokeDashArray || strokeDashArray;

			return value as number[];
		},
		changeStrokeDashArray: (value: number[]) => {
			setStrokeDashArray(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ strokeDashArray: value });
			});
			canvas.requestRenderAll();
		},

		// --- Appearance: opacity ---
		getActiveOpacity: () => {
			const selectedObject = selectedObjects[0];

			if (!selectedObject) {
				return 1;
			}

			const value = selectedObject.opacity ?? 1;

			return value;
		},
		changeOpacity: (value: number) => {
			canvas.getActiveObjects().forEach((object) => {
				object.set({ opacity: value });
			});
			canvas.requestRenderAll();
		},

		// --- State passthrough ---
		canvas,
		fillColor,
		strokeColor,
		strokeWidth,
		selectedObjects,
	};
};

// 2. Create the useEditor hook that will initialize the canvas and provide the editor object to the components that need it. This hook will also handle resizing the canvas when the window size changes.
export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
	// State for main canvas object, container, and selected objects
	const [canvas, setCanvas] = useState<Canvas | null>(null);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [selectedObjects, setSelectedObjects] = useState<FabricObject[]>([]);

	// Prepare initial settings for new objects
	const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
	const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
	const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);
	const [strokeDashArray, setStrokeDashArray] =
		useState<number[]>(STROKE_DASH_ARRAY);

	const { autoZoom } = useAutoResize({
		canvas,
		container,
	});

	useCanvasEvents({
		canvas,
		setSelectedObjects,
		clearSelectionCallback,
	});

	useAligningGuidelines({
		canvas,
	});

	// Don't need to put dispatch functions inside of useMemo dependencies/dependency array, as they are guaranteed to be stable by React.
	const editor = useMemo(() => {
		if (!canvas) return undefined;

		return buildEditor({
			canvas,
			fillColor,
			strokeColor,
			strokeWidth,
			strokeDashArray,
			autoZoom,
			setFillColor,
			setStrokeColor,
			setStrokeWidth,
			setStrokeDashArray,
			selectedObjects,
		});
  }, [canvas, autoZoom, fillColor, strokeColor, strokeWidth, strokeDashArray, selectedObjects]);

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

			// Create a clipping rectangle that matches the container size
			const initialWorkspace = new Rect({
                width: 500,
                height: 800,
				name: "clip",
				fill: "#fff",
				selectable: false,
				hasControls: false,
				shadow: new Shadow({
					color: "rgba(0,0,0,0.8)",
					blur: 5,
				}),
			});

			// Set the canvas dimensions to match the container
			initialCanvas.setDimensions({
				width: initialContainer.offsetWidth,
				height: initialContainer.offsetHeight,
			});

			// Note: The order of these operations is important. The clipPath must be set after the object is added to the canvas, otherwise it will not work correctly. This might cause issues with the undo/redo history, as it adds multiple states. We can optimize this later by using a custom history implementation that ignores certain state changes (like adding the workspace object).
			initialCanvas.add(initialWorkspace);
			initialCanvas.centerObject(initialWorkspace);
			initialCanvas.set({ clipPath: initialWorkspace });

			setCanvas(initialCanvas);
			setContainer(initialContainer);

            // const rect = new Rect({
            //   left: 100,
            //   top: 100,
            //   fill: FILL_COLOR,
            //   width: 100,
            //   height: 100,
            // });

            // initialCanvas.add(rect);
            // initialCanvas.centerObject(rect);
		},
		[],
	);

	// Return the init object. Return the editor object.
	return {
		init,
		editor,
	};
};
