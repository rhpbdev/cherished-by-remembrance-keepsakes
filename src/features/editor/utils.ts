import { Point, TMat2D } from 'fabric';
import { RgbaColor } from 'react-colorful';

export function isTextType(type: string | undefined) {
  return type === 'text' || type === 'i-text' || type === 'textbox';
}

export function rgbaObjectToString(rgba: RgbaColor | 'transparent') {
  if (rgba === 'transparent') return `rgba(0,0,0,0)`;

  const alpha = rgba.a === undefined ? 1 : rgba.a;

  return `rgba(${rgba.r},${rgba.g},${rgba.b},${alpha})`;
}

export function canvasPointToScreen(point: Point, viewportTransform: TMat2D) {
  return {
    x:
      point.x * viewportTransform[0] +
      point.y * viewportTransform[2] +
      viewportTransform[4],
    y:
      point.x * viewportTransform[1] +
      point.y * viewportTransform[3] +
      viewportTransform[5],
  };
}

export function getViewportScale(viewportTransform: TMat2D) {
  const xAxisScale = Math.hypot(viewportTransform[0], viewportTransform[1]);

  return xAxisScale || 1;
}

export function screenDeltaToCanvasDelta(
  screenDelta: number,
  viewportTransform: TMat2D,
) {
  const scale = getViewportScale(viewportTransform);

  return screenDelta / scale;
}
