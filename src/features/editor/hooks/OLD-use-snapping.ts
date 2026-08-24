import { Canvas, FabricObject, Line } from 'fabric';
import { useEffect, useState } from 'react';

interface UseSnappingProps {
  canvas: Canvas | null;
  selectedObjects: FabricObject[];
  guidelines: FabricObject[];
  setGuidelines: React.Dispatch<React.SetStateAction<FabricObject[]>>;
}

export const useSnapping = ({
  canvas,
  selectedObjects,
  guidelines,
  setGuidelines,
}: UseSnappingProps) => {
  const snappingDistance = 10;

  if (!canvas) return;

  const clearGuidelines = () => {
    const guidelines = canvas
      .getObjects()
      .filter((obj) => obj.name === 'guideline');
    guidelines.forEach((guide) => canvas.remove(guide));
    canvas.requestRenderAll();
  };

  const guidelineExists = (canvas: Canvas, name: string) => {
    const objects = canvas.getObjects('line');
    return objects.some((obj) => obj.name === name);
  };

  const createVerticalGuideline = (canvas: Canvas, x: number, id: string) => {
    return new Line([x, 0, x, canvas.height], {
      id,
      stroke: 'rgba(255,0,0,0.5)',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      opacity: 0.5,
      name: 'guideline',
    });
  };

  const createHorizontalGuideline = (canvas: Canvas, y: number, id: string) => {
    return new Line([0, y, canvas.width, y], {
      id,
      stroke: 'rgba(255,0,0,0.5)',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      opacity: 0.5,
      name: 'guideline',
    });
  };

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const selectedObject = selectedObjects[0];

  if (!selectedObject) return;

  const left = selectedObject.left;
  const top = selectedObject.top;
  const right = left + selectedObject.width;
  const bottom = top + selectedObject.height;

  const centerX = left + (selectedObject.width * selectedObject.scaleX) / 2;
  const centerY = top + (selectedObject.height * selectedObject.scaleY) / 2;

  const newGuidelines = [];
  clearGuidelines();

  let snapped = false;

  if (Math.abs(left) < snappingDistance) {
    selectedObject.set({ left: 0 });
    if (!guidelineExists(canvas, 'vertical-left')) {
      const line = createVerticalGuideline(canvas, 0, 'vertical-left');
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  if (Math.abs(top) < snappingDistance) {
    selectedObject.set({ top: 0 });
    if (!guidelineExists(canvas, 'horizontal-top')) {
      const line = createHorizontalGuideline(canvas, 0, 'horizontal-top');
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  if (Math.abs(right - canvasWidth) < snappingDistance) {
    selectedObject.set({
      left: canvasWidth - selectedObject.width * selectedObject.scaleX,
    });
    if (!guidelineExists(canvas, 'vertical-right')) {
      const line = createVerticalGuideline(
        canvas,
        canvasWidth,
        'vertical-right',
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  if (Math.abs(bottom - canvasHeight) < snappingDistance) {
    selectedObject.set({
      top: canvasHeight - selectedObject.height * selectedObject.scaleY,
    });
    if (!guidelineExists(canvas, 'horizontal-bottom')) {
      const line = createHorizontalGuideline(
        canvas,
        canvasHeight,
        'horizontal-bottom',
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  if (Math.abs(centerX - canvasWidth / 2) < snappingDistance) {
    selectedObject.set({
      left:
        canvasWidth / 2 - (selectedObject.width * selectedObject.scaleX) / 2,
    });
    if (!guidelineExists(canvas, 'vertical-center')) {
      const line = createVerticalGuideline(
        canvas,
        canvasWidth / 2,
        'vertical-center',
      );
      newGuidelines.push(line);
      canvas.add(line);
    }
    snapped = true;
  }

  if (!snapped) {
    clearGuidelines();
  } else {
    setGuidelines(newGuidelines);
  }

  canvas.requestRenderAll();
};
