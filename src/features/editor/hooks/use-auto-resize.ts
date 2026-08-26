import { Canvas, Rect, TMat2D, util } from 'fabric';
import { useCallback, useEffect } from 'react';

interface UseAutoResizeProps {
  canvas: Canvas | null;
  container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // 0. Bail on a zero-size container so findScaleToFit doesn't return NaN (which can happen with certain orderings)
    if (width === 0 || height === 0) return;

    // 1. Update canvas dimensions safely
    canvas.setDimensions({ width, height });

    // 2. Locate workspace bounding object
    const localWorkspace = canvas
      .getObjects()
      .find((object) => object.name === 'clip');

    // Fallback if no workspace is found yet
    if (!localWorkspace) {
      canvas.requestRenderAll();
      return;
    }

    // 3. Extract dimensions using scaled values for accuracy
    const workspaceDimensions = {
      width: localWorkspace.getScaledWidth(),
      height: localWorkspace.getScaledHeight(),
    };

    // 4. Calculate proper fit scale ratio
    const scale = util.findScaleToFit(workspaceDimensions, {
      width: width,
      height: height,
    });

    const zoomRatio = 0.85; // Leave 15% padding around the workspace
    const zoom = zoomRatio * scale;

    // 5. Get the center coordinates of the workspace
    const workspaceCenter = localWorkspace.getCenterPoint();

    // 6. Construct the view transformation matrix directly
    // [scaleX, skewY, skewX, scaleY, translateX, translateY]
    const updatedTransform: TMat2D = [
      zoom,
      0,
      0,
      zoom,
      width / 2 - workspaceCenter.x * zoom,
      height / 2 - workspaceCenter.y * zoom,
    ];

    canvas.setViewportTransform(updatedTransform);

    // 7. Sync the clip path seamlessly without heavy async cloning
    // Note: It's better to assign this once on initialization, but if needed here:
    if (canvas.clipPath !== localWorkspace) {
      canvas.set({ clipPath: localWorkspace as Rect });
    }

    // 8. Render synchronously, NOT via requestRenderAll() so the resize and redraw happen in the same frame, preventing flicker.
    canvas.renderAll();
  }, [canvas, container]);

  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;

    if (canvas && container) {
      // Call autoZoom straight from the observer callback
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

  // Exposed so the editor can re-fit imperatively (fit-to-screen, post-loadFromJSON,
  // page-size change). Initial fit still comes from the observer's first callback.
  return { autoZoom };
};
