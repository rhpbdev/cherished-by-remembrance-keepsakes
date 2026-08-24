import { Canvas, Group, Rect } from 'fabric';
import { FieldConfigurationTemplate } from '@/types';

// Layout position configuration for collage photo layouts
const layoutPositions = {
	collage_4: [
		{ left: 150, top: 250, width: 200, height: 200 },
		{ left: 380, top: 250, width: 200, height: 200 },
		{ left: 150, top: 480, width: 200, height: 200 },
		{ left: 380, top: 480, width: 200, height: 200 },
	],
	collage_6: [
		{ left: 150, top: 250, width: 200, height: 200 },
		{ left: 380, top: 250, width: 200, height: 200 },
		{ left: 150, top: 480, width: 200, height: 200 },
		{ left: 380, top: 480, width: 200, height: 200 },
		{ left: 150, top: 710, width: 200, height: 200 },
		{ left: 380, top: 710, width: 200, height: 200 },
	],
	// ... positions for other layouts
};

export async function addImageFramesFromLayout(
	canvas: Canvas,
	layout: FieldConfigurationTemplate,
	panelNumber: number,
	centerX: number,
	centerY: number
) {
	const positions = layoutPositions[layout.id] || [];

	layout.fields.forEach((field, index) => {
		if (field.type !== 'image') return;

		// Get predefined position or create default
		const basePosition = positions[index];

		let position;
		if (basePosition) {
			// Use predefined position from layoutPositions
			position = basePosition;
		} else {
			// Create default position centered on panel
			position = {
				left: centerX + (index % 2) * 230 - 115,
				top: centerY + Math.floor(index / 2) * 230 - 115,
				width: 180,
				height: 180,
			};
		}

		// Create placeholder
		const placeholder = new Rect({
			width: position.width,
			height: position.height,
			fill: '#e5e7eb',
			stroke: '#9ca3af',
			strokeWidth: 2,
			originX: 'center',
			originY: 'center',
		});

		// Create clip path
		const clipPath = new Rect({
			width: position.width,
			height: position.height,
			originX: 'center',
			originY: 'center',
			absolutePositioned: false,
		});

		// Create group
		const group = new Group([placeholder], {
			id: `panel${panelNumber}_field_${field.fieldId}`,
			left: position.left,
			top: position.top,
			width: position.width,
			height: position.height,
			originX: 'center',
			originY: 'center',
			clipPath: clipPath,
			interactive: false,
			subTargetCheck: false,
		});

		canvas.add(group);
	});

	canvas.requestRenderAll();
}
