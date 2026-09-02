import { Canvas } from "fabric";
import { useEffect, useRef } from "react";

interface UseLoadStateProps {
	autoZoom: () => void;
	canvas: Canvas | null;
	initialState: React.RefObject<string | undefined>;
	canvasHistory: React.RefObject<string[]>;
	setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useLoadState = ({
	canvas,
	autoZoom,
	initialState,
	canvasHistory,
	setHistoryIndex,
}: UseLoadStateProps) => {
	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current || !initialState?.current || !canvas) return;

		const data = JSON.parse(initialState.current);
		let cancelled = false;

		// Fabric 6+: loadFromJSON returns a Promise. Its second argument is a
		// per-object reviver, run while each object is enlivened and before any of
		// them are added to the canvas, so it is NOT the v5 completion callback.
		// Anything that needs the loaded canvas has to wait for the Promise.
		canvas
			.loadFromJSON(data)
			.then(() => {
				if (cancelled) return;
				initialized.current = true;
				canvasHistory.current = [JSON.stringify(canvas.toJSON())];
				setHistoryIndex(0);
				autoZoom();
			})
			.catch((error) => {
				if (cancelled) return;
				initialized.current = true;
				console.error("Failed to load initial state:", error);
			});

		return () => {
			// The effect re-ran (StrictMode, a new canvas) or the editor unmounted
			// before the load finished: ignore this run's result. `initialized`
			// stays false so the next run loads again.
			cancelled = true;
		};
	}, [
		canvas,
		autoZoom,
		initialState, // no need, this is a ref
		canvasHistory, // no need, this is a ref
		setHistoryIndex, // no need, this is a dispatch
	]);
};
