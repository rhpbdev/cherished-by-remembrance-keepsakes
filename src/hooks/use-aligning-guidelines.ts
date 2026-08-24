import { Canvas } from "fabric";
import { AligningGuidelines, type AligningLineConfig } from "fabric/extensions";
import { useEffect } from "react";

interface UseAligningGuidelinesProps {
	canvas: Canvas | null;
}

const config: Partial<AligningLineConfig> = {
	/** At what distance from the shape does alignment begin? */
	margin: 12,
	/** Aligning line dimensions */
	width: 2,
	/** Aligning line color */
	color: "rgba(255,0,0,0.9)",
	/** Close Vertical line, default false. */
	closeVLine: false,
	/** Close horizontal line, default false. */
	closeHLine: false,
};

export const UseAligningGuidelines = ({
	canvas,
}: UseAligningGuidelinesProps) => {
	useEffect(() => {
		if (!canvas) return;

		const aligningGuidelines = new AligningGuidelines(canvas, config);

		return () => {
			aligningGuidelines.dispose();
		};
	}, [canvas]);
};
