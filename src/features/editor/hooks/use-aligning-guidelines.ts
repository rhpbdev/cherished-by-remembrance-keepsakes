import { Canvas } from "fabric";
import { AligningGuidelines, type AligningLineConfig } from "fabric/extensions";
import { useEffect } from "react";

interface UseAligningGuidelinesProps {
  canvas: Canvas | null;
}

const config: Partial<AligningLineConfig> = {
  /** At what distance from the shape does alignment begin? */
  margin: 8,
  /** Aligning line dimensions */
  width: 1,
  /** Aligning line color */
  color: "rgba(255,0,0,0.9)",
};

// Fabric's interactive Canvas.toCanvasElement (used by toDataURL / toBlob,
// i.e. every image export) temporarily sets `elements.upper.ctx` to undefined
// so nothing paints onto the upper canvas while it renders to an offscreen
// one. The stock extension's before:render handler still calls
// `canvas.clearContext(canvas.contextTop)` unconditionally, which throws
// "Cannot read properties of undefined (reading 'clearRect')" mid-export.
// Guidelines are only meaningful during an interactive drag/scale, so skip
// both render hooks whenever there is no top context to draw on.
class SafeAligningGuidelines extends AligningGuidelines {
  beforeRender() {
    if (!this.canvas.contextTop) return;
    super.beforeRender();
  }

  afterRender() {
    if (!this.canvas.contextTop) return;
    super.afterRender();
  }
}

export const useAligningGuidelines = ({
  canvas,
}: UseAligningGuidelinesProps) => {
  useEffect(() => {
    if (!canvas) return;

    // The extension wires up its own canvas listeners (object:moving, scaling,
    // before/after:render, mouse:up) and manages its own state. Default behavior
    // aligns against every on-screen object — including the "clip" workspace rect —
    // so objects snap to the page center/edges and to each other.
    const guideline = new SafeAligningGuidelines(canvas, config);

    // Tear down the listeners when the canvas changes or the component unmounts.
    return () => {
      guideline.dispose();
    };
  }, [canvas]);
};
