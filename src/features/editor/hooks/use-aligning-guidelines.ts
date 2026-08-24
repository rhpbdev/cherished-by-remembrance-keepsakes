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

export const useAligningGuidelines = ({
  canvas,
}: UseAligningGuidelinesProps) => {
  useEffect(() => {
    if (!canvas) return;

    // The extension wires up its own canvas listeners (object:moving, scaling,
    // before/after:render, mouse:up) and manages its own state. Default behavior
    // aligns against every on-screen object — including the "clip" workspace rect —
    // so objects snap to the page center/edges and to each other.
    const guideline = new AligningGuidelines(canvas, config);

    // Tear down the listeners when the canvas changes or the component unmounts.
    return () => {
      guideline.dispose();
    };
  }, [canvas]);
};
