import { Canvas, FabricObject, TextStyleDeclaration } from "fabric";

export const selectionDependentTools = [
	"fill",
	"font",
	"filter",
	"opacity",
	"remove-bg",
	"stroke-color",
	"stroke-width",
];

export type ActiveTool =
	| "select"
	| "shapes"
	| "elements"
	| "text"
	| "images"
	| "draw"
	| "fill"
	| "stroke-color"
	| "stroke-width"
	| "font"
	| "opacity"
	| "filter"
	| "settings"
	| "ai"
	| "remove-bg"
	| "templates";

export const COLORS = [
	{ name: "Black", value: "rgba(0,0,0,1)" },
	{ name: "White", value: "rgba(255,255,255,1)" },
	{ name: "Red", value: "rgba(255,0,0,1)" },
	{ name: "Green", value: "rgba(0,255,0,1)" },
	{ name: "Blue", value: "rgba(0,0,255,1)" },
	{ name: "Yellow", value: "rgba(255,255,0,1)" },
	{ name: "Cyan", value: "rgba(0,255,255,1)" },
	{ name: "Magenta", value: "rgba(255,0,255,1)" },
	{ name: "Transparent", value: "rgba(0,0,0,0)" },
];

export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 2;
export const STROKE_DASH_ARRAY = [];
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32;

export const CIRCLE_OPTIONS = {
	radius: 100,
	left: 100,
	top: 100,
	fill: FILL_COLOR,
	stroke: STROKE_COLOR,
	strokeWidth: STROKE_WIDTH,
};

export const DIAMOND_OPTIONS = {
	left: 100,
	top: 100,
	fill: FILL_COLOR,
	stroke: STROKE_COLOR,
	strokeWidth: STROKE_WIDTH,
	width: 284,
	height: 284,
	angle: 0,
};

export const RECTANGLE_OPTIONS = {
	left: 100,
	top: 100,
	fill: FILL_COLOR,
	stroke: STROKE_COLOR,
	strokeWidth: STROKE_WIDTH,
	width: 200,
	height: 200,
	angle: 0,
};

export const TRIANGLE_OPTIONS = {
	left: 100,
	top: 100,
	fill: FILL_COLOR,
	stroke: STROKE_COLOR,
	strokeWidth: STROKE_WIDTH,
	width: 200,
	height: 200,
	angle: 0,
};

export const TEXT_OPTIONS = {
	// type: "textbox",
	left: 100,
	top: 100,
	fill: FILL_COLOR,
	fontSize: FONT_SIZE,
	fontFamily: FONT_FAMILY,
	width: 200,
	height: 500,
};
export interface EditorHookProps {
	clearSelectionCallback?: () => void;
}

export type BuildEditorProps = {
	canvas: Canvas;
	fillColor: string;
	fontFamily: string;
	strokeColor: string;
	strokeWidth: number;
	strokeDashArray: number[];
	selectedObjects: FabricObject[];
	autoZoom: () => void;
	setFillColor: (value: string) => void;
	setFontFamily: (value: string) => void;
	setStrokeColor: (value: string) => void;
	setStrokeWidth: (value: number) => void;
	setStrokeDashArray: (value: number[]) => void;
};

export interface Editor {
	addImage: (value: string) => Promise<void>;
	delete: () => void;

	// --- Viewport ---
	autoZoom: () => void;
	zoomIn: () => void;
	zoomOut: () => void;

	// --- Shape creation ---
	addCircle: () => void;
	addDiamond: () => void;
	addRectangle: () => void;
	addRectangleRounded: () => void;
	addTriangle: () => void;
	addTriangleInverse: () => void;

	// --- Text creation ---
	addText: (value: string, options?: TextStyleDeclaration) => void;

	// --- Arrangement (layer order & positioning) ---
	bringForward: () => void;
	sendBackward: () => void;
	centerFabricObject: () => void;

	// --- Appearance: fill ---
	getActiveFillColor: () => string;
	changeFillColor: (value: string) => void;

	// --- Appearance: stroke ---
	getActiveStrokeColor: () => string;
	changeStrokeColor: (value: string) => void;
	getActiveStrokeWidth: () => number;
	changeStrokeWidth: (value: number) => void;
	getActiveStrokeDashArray: () => number[];
	changeStrokeDashArray: (value: number[]) => void;

	// --- Appearance: opacity ---
	getActiveOpacity: () => number;
	changeOpacity: (value: number) => void;

	// --- Appearance: text ---
	getActiveFontFamily: () => string;
	changeFontFamily: (value: string) => void;
	getActiveFontWeight: () => number;
	changeFontWeight: (value: number) => void;
	getActiveFontStyle: () => string;
	changeFontStyle: (value: string) => void;
	getActiveFontLinethrough: () => boolean;
	changeFontLinethrough: (value: boolean) => void;
	getActiveFontUnderline: () => boolean;
	changeFontUnderline: (value: boolean) => void;
	getActiveTextAlign: () => string;
	changeTextAlign: (value: string) => void;
	getActiveFontSize: () => number;
	changeFontSize: (value: number) => void;

	// --- State passthrough ---
	canvas: Canvas;
	fillColor: string;
	strokeColor: string;
	strokeWidth: number;
	selectedObjects: FabricObject[];
}

// 1. TypeScript Module Augmentation (Prevents IDE compilation errors) to extend Fabric.js interfaces
declare module "fabric" {
	// Adds types to the runtime instances and constructor configuration
	interface FabricObject {
		name?: string;
	}
	// Adds types to the exported JSON/Object structures
	interface SerializedObjectProps {
		name?: string;
	}
}

// 2. Global Serialization Registration
// This instructs Fabric.js to automatically include these keys when calling toObject() or toJSON()
FabricObject.customProperties = ["name"];
