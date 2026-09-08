import {
  Canvas,
  Circle,
  FabricObject,
  Polygon,
  Rect,
  Shadow,
  Textbox,
  Triangle,
  InteractiveFabricObject,
  FabricText,
  FabricImage,
  type TMat2D,
} from 'fabric';
import { useCallback, useMemo, useState } from 'react';

import {
  CIRCLE_OPTIONS,
  DIAMOND_OPTIONS,
  FILL_COLOR,
  RECTANGLE_OPTIONS,
  STROKE_COLOR,
  STROKE_DASH_ARRAY,
  STROKE_WIDTH,
  TEXT_OPTIONS,
  TRIANGLE_OPTIONS,
  type EditorHookProps,
  type BuildEditorProps,
  type Editor,
  FONT_FAMILY,
  FONT_SIZE,
} from '@/features/editor/types';
import {
  downloadFile,
  isTextType,
  transformText,
} from '@/features/editor/utils';
import { FONT_WEIGHT } from '@/features/editor/constants';

import { useHistory } from '@/features/editor/hooks/use-history';
import { useClipboard } from '@/features/editor/hooks/use-clipboard';
import { useAutoResize } from '@/features/editor/hooks/use-auto-resize';
import { useCanvasEvents } from '@/features/editor/hooks/use-canvas-events';
import { useAligningGuidelines } from '@/features/editor/hooks/use-aligning-guidelines';
import { useWindowEvents } from './use-window-events';

type ExportBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Step 1: Build the editor object.
 * @param props - The properties required to build the editor object.
 * @returns The editor object with all the methods for manipulating the canvas.
 * @remarks
 * Build the editor object that will contain all the methods for manipulating the canvas.
 * This object will be created once and memoized, so it doesn't cause unnecessary re-renders.
 * Takes inspiration from the Fabric.js canvas API (fabric-react package / react-canvas).
 */
const buildEditor = ({
  save,
  undo,
  redo,
  canRedo,
  canUndo,
  copy,
  paste,
  canvas,
  fillColor,
  fontFamily,
  strokeColor,
  strokeWidth,
  strokeDashArray,
  selectedObjects,
  autoZoom,
  setFillColor,
  setFontFamily,
  setStrokeColor,
  setStrokeWidth,
  setStrokeDashArray,
}: BuildEditorProps): Editor => {
  // Get the bounds of the workspace to be exported. Returns undefined if the workspace is not available.
  const getExportBounds = (): ExportBounds | undefined => {
    const workspace = getWorkspace();

    if (!workspace) return undefined;

    const center = workspace.getCenterPoint();

    // Calculate the export bounds based on the center point and scaled dimensions of the workspace.
    // NOTE: Do not use getScaledWidth()/getBoundingRect() as they include the stroke width.
    const width = workspace.width * workspace.scaleX;
    const height = workspace.height * workspace.scaleY;

    return {
      left: center.x - width / 2,
      top: center.y - height / 2,
      width,
      height,
    };
  };

  // Export the workspace by temporarily removing viewport transform, clip path, and shadow.
  // The original state is restored after the export.
  const exportWorkspace = (exporter: (bounds: ExportBounds) => void) => {
    const workspace = getWorkspace();
    const bounds = getExportBounds();

    if (!workspace || !bounds) return;

    const originalViewport = [...canvas.viewportTransform] as TMat2D;
    const originalClipPath = canvas.clipPath;
    const originalShadow = workspace.shadow;

    canvas.clipPath = undefined;
    workspace.set({ shadow: null });
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

    try {
      exporter(bounds);
    } finally {
      workspace.set({ shadow: originalShadow });
      canvas.clipPath = originalClipPath;
      canvas.setViewportTransform(originalViewport);
      autoZoom();
    }
  };

  const savePng = () => {
    exportWorkspace((bounds) => {
      const dataUrl = canvas.toDataURL({
        ...bounds,
        format: 'png',
        quality: 1,
        multiplier: 3,
      });

      downloadFile(dataUrl, 'png');
    });
  };

  const saveSvg = () => {
    exportWorkspace(({ left, top, width, height }) => {
      const svg = canvas.toSVG({
        width: `${width}`,
        height: `${height}`,
        viewBox: { x: left, y: top, width, height },
      });

      downloadFile(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
        'svg',
      );
    });
  };

  const saveJpg = () => {
    exportWorkspace((bounds) => {
      const dataUrl = canvas.toDataURL({
        ...bounds,
        format: 'jpeg',
        quality: 1,
        multiplier: 3,
      });

      downloadFile(dataUrl, 'jpg');
    });
  };

  const saveJson = async () => {
    // const dataUrl = JSON.stringify(canvas.toJSON());
    const dataUrl = canvas.toJSON();

    // await transformText(JSON.parse(dataUrl).objects);
    await transformText(dataUrl.objects);
    const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataUrl, null, '\t'))}`;
    downloadFile(fileString, 'json');
  };

  const loadJson = (json: string) => {
    const data = JSON.parse(json);
    canvas
      .loadFromJSON(data)
      .then(() => {
        autoZoom();
        canvas.requestRenderAll();
      })
      .catch((error) => {
        console.error('Failed to load JSON:', error);
      });
  };

  // Helper: finds the main canvas area (white background)
  const getWorkspace = () => {
    return canvas
      .getObjects()
      .find((object) => object.name === 'clip') as FabricObject;
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
    savePng,
    saveSvg,
    saveJpg,
    saveJson,
    loadJson,
    autoZoom,
    canUndo,
    canRedo,
    getWorkspace,
    changeSize: (value: { width: number; height: number }) => {
      const workspace = getWorkspace();

      workspace?.set({ ...value });
      canvas.requestRenderAll();
      autoZoom();

      // TODO: Save
      save();
    },
    changeBackground: (value) => {
      const workspace = getWorkspace();

      workspace?.set({ fill: value });
      canvas.requestRenderAll();

      // TODO: Save
      save();
    },

    // --- Clipboard ---
    onDuplicate: async () => {
      await copy();
      await paste();
    },
    onUndo: () => undo(),
    onRedo: () => redo(),

    // --- Image manipulation ---
    addImage: async (value) => {
      try {
        const image = await FabricImage.fromURL(value, {
          crossOrigin: 'anonymous',
        });

        const workspace = getWorkspace();
        if (!workspace) return;

        image.scaleToWidth(workspace.width ?? image.width);
        image.scaleToHeight(workspace.height ?? image.height);

        addToCanvas(image);
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    },

    // --- Deletion ---
    delete: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.remove(object);
      });
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    },

    // --- Viewport ---
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
    addText: (value, options) => {
      const object = new Textbox(value, {
        ...TEXT_OPTIONS,
        fill: fillColor,
        ...options,
      });

      addToCanvas(object);
    },

    // --- Arrangement (layer order & positioning) ---
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringObjectForward(object);
      });

      canvas.requestRenderAll();

      const workspace = getWorkspace();
      if (workspace) canvas.sendObjectToBack(workspace);
      // TODO: Consider using optional chaining for safety
    },
    sendBackward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendObjectBackwards(object);
      });

      canvas.requestRenderAll();

      const workspace = getWorkspace();
      if (workspace) canvas.sendObjectToBack(workspace);
      // TODO: Consider using optional chaining for safety
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
    changeFillColor: (value) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });

      canvas.requestRenderAll();
    },

    // --- Appearance: text ---
    getActiveFontFamily: () => {
      const selectedObject = selectedObjects[0] as FabricText;

      if (!selectedObject) return fontFamily;

      const value = selectedObject.fontFamily || fontFamily;

      return value;
    },
    changeFontFamily: (value) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontFamily: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0] as FabricText;

      if (!selectedObject) return FONT_WEIGHT;

      const value = selectedObject.fontWeight || FONT_WEIGHT;

      return value as number;
    },
    changeFontWeight: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontWeight: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0] as FabricText;

      if (!selectedObject) return 'normal';

      const value = selectedObject.fontStyle || 'normal';

      return value;
    },
    changeFontStyle: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontStyle: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0] as FabricText;

      if (!selectedObject) return false;

      const value = selectedObject.linethrough || false;

      return value;
    },
    changeFontLinethrough: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ linethrough: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0] as FabricText;

      if (!selectedObject) return false;

      const value = selectedObject.underline || false;

      return value;
    },
    changeFontUnderline: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ underline: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0] as FabricText;

      if (!selectedObject) return 'left';

      const value = selectedObject.textAlign || 'left';

      return value;
    },
    changeTextAlign: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ textAlign: value });
        }
      });
      canvas.requestRenderAll();
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0] as FabricText;

      if (!selectedObject) return FONT_SIZE;

      const value = selectedObject.fontSize || FONT_SIZE;

      return value;
    },
    changeFontSize: (value) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fontSize: value });
        }
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
    changeStrokeColor: (value) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
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
    changeStrokeWidth: (value) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          return;
        }
        object.set({ strokeWidth: value });
        object.setCoords();
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

      return value;
    },
    changeStrokeDashArray: (value) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          return;
        }
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
    changeOpacity: (value) => {
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

/**
 * Step 2: Create the useEditor hook.
 * @param clearSelectionCallback - A callback function that will be called when the selection is cleared.
 * @returns The editor object that provides methods for manipulating the canvas.
 * @remarks
 * This hook will handle the initialization of the canvas, manage its state, and provide the editor object to the components that need it.
 * It will also handle resizing the canvas when the window size changes.
 */
export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
  // State for main canvas object, container, and selected objects
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<FabricObject[]>([]);

  // Prepare initial settings for new objects
  const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY);
  const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] =
    useState<number[]>(STROKE_DASH_ARRAY);

  const {
    save,
    undo,
    redo,
    canUndo,
    canRedo,
    canvasHistoryRef,
    setHistoryIndex,
  } = useHistory({ canvas });

  const { copy, paste } = useClipboard({ canvas });

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    save,
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  useAligningGuidelines({
    canvas,
  });

  useWindowEvents();

  /**
   * Step 3: Return the init and editor objects.
   * @remarks
   * The init object is responsible for initializing the canvas and container.
   * The editor object provides methods for manipulating the canvas.
   */
  const editor = useMemo(() => {
    if (!canvas) return undefined;

    return buildEditor({
      save,
      undo,
      redo,
      canUndo,
      canRedo,
      copy,
      paste,
      canvas,
      fillColor,
      fontFamily,
      strokeColor,
      strokeWidth,
      strokeDashArray,
      selectedObjects,
      autoZoom,
      setFillColor,
      setFontFamily,
      setStrokeColor,
      setStrokeWidth,
      setStrokeDashArray,
    });
  }, [
    save,
    canRedo,
    canUndo,
    undo,
    redo,
    copy,
    paste,
    canvas,
    fillColor,
    fontFamily,
    strokeColor,
    strokeWidth,
    strokeDashArray,
    selectedObjects,
    autoZoom,
  ]); // NOTE: Don't need to put dispatch functions inside of useMemo dependencies/dependency array, as they are guaranteed to be stable by React.

  // The init object is responsible for initializing the canvas and container.
  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      // Customize the appearance of the selection controls.
      InteractiveFabricObject.ownDefaults = {
        ...InteractiveFabricObject.ownDefaults,
        cornerColor: '#fff',
        cornerStyle: 'circle',
        // cornerStrokeColor: '#9c9c9c',
        // borderColor: '#009ceb',
        cornerStrokeColor: '#3b82f6',
        borderColor: '#3b82f6',
        borderScaleFactor: 2,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        padding: 0,
      };

      // Create a clipping rectangle that matches the container size that will be used as the clipPath for the canvas.
      const initialWorkspace = new Rect({
        width: 500,
        height: 800,
        name: 'clip',
        fill: '#fff',
        selectable: false,
        hasControls: false,
        shadow: new Shadow({
          color: 'rgba(0,0,0,0.8)',
          blur: 5,
        }),
      });

      // Set the canvas dimensions to match the container.
      initialCanvas.setDimensions({
        width: initialContainer.offsetWidth,
        height: initialContainer.offsetHeight,
      });

      // Note: The order of these operations is important.
      // The clipPath must be set after the object is added to the canvas, otherwise it will not work correctly.
      // This might cause issues with the undo/redo history, as it adds multiple states.
      // TODO: We can optimize this later by using a custom history implementation that ignores certain state changes (like adding the workspace object).
      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.set({ clipPath: initialWorkspace });

      setCanvas(initialCanvas);
      setContainer(initialContainer);

      const currentState = JSON.stringify(initialCanvas.toJSON());
      canvasHistoryRef.current = [currentState];
      setHistoryIndex(0);
    },
    [canvasHistoryRef, setHistoryIndex],
  );

  /**
   * Step 4: Return the init and editor objects.
   * @returns An object containing the init and editor functions.
   */
  return {
    init,
    editor,
  };
};
