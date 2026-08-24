// import { Canvas, Group, Rect, Textbox } from 'fabric';
// import { FieldConfigurationTemplate } from '@/types';

// // Layout position configuration for collage photo layouts
// const layoutPositions = {
// 	collage_4: [
// 		{ left: 150, top: 250, width: 200, height: 200 },
// 		{ left: 380, top: 250, width: 200, height: 200 },
// 		{ left: 150, top: 480, width: 200, height: 200 },
// 		{ left: 380, top: 480, width: 200, height: 200 },
// 	],
// 	collage_6: [
// 		{ left: 150, top: 250, width: 200, height: 200 },
// 		{ left: 380, top: 250, width: 200, height: 200 },
// 		{ left: 150, top: 480, width: 200, height: 200 },
// 		{ left: 380, top: 480, width: 200, height: 200 },
// 		{ left: 150, top: 710, width: 200, height: 200 },
// 		{ left: 380, top: 710, width: 200, height: 200 },
// 	],
// 	// ... positions for other layouts
// };

// export async function addImageFramesFromLayout(
// 	canvas: Canvas,
// 	layout: FieldConfigurationTemplate,
// 	panelNumber: number
// ) {
// 	const positions = layoutPositions[layout.id] || [];

// 	layout.fields.forEach((field, index) => {
// 		if (field.type !== 'image') return;

// 		const position = positions[index] || {
// 			left: 200 + index * 80,
// 			top: 200,
// 			width: 180,
// 			height: 180,
// 		};

// 		// Create placeholder
// 		const placeholder = new Rect({
// 			width: position.width,
// 			height: position.height,
// 			fill: '#e5e7eb',
// 			stroke: '#9ca3af',
// 			strokeWidth: 2,
// 			originX: 'center',
// 			originY: 'center',
// 		});

// 		// Create clip path
// 		const clipPath = new Rect({
// 			width: position.width,
// 			height: position.height,
// 			originX: 'center',
// 			originY: 'center',
// 			absolutePositioned: false,
// 		});

// 		// Create group
// 		const group = new Group([placeholder], {
// 			id: `panel${panelNumber}_field_${field.fieldId}`,
// 			left: position.left,
// 			top: position.top,
// 			width: position.width,
// 			height: position.height,
// 			originX: 'center',
// 			originY: 'center',
// 			clipPath: clipPath,
// 			interactive: false,
// 			subTargetCheck: false,
// 		});

// 		canvas.add(group);
// 	});

// 	canvas.requestRenderAll();
// }

// // Layout position configuration for poem layouts
// const poemLayoutPositions = {
// 	poem_single: [
// 		{
// 			left: 320,
// 			top: 200,
// 			width: 500,
// 			fieldId: 'poem_title',
// 			fontSize: 32,
// 			fontFamily: 'Georgia',
// 			fontStyle: 'italic',
// 		},
// 		{
// 			left: 320,
// 			top: 280,
// 			width: 500,
// 			fieldId: 'poem_text',
// 			fontSize: 18,
// 			fontFamily: 'Georgia',
// 		},
// 	],
// 	poem_dual: [
// 		{
// 			left: 180,
// 			top: 200,
// 			width: 220,
// 			fieldId: 'poem_title_1',
// 			fontSize: 24,
// 			fontFamily: 'Georgia',
// 			fontStyle: 'italic',
// 		},
// 		{
// 			left: 180,
// 			top: 260,
// 			width: 220,
// 			fieldId: 'poem_text_1',
// 			fontSize: 16,
// 			fontFamily: 'Georgia',
// 		},
// 		{
// 			left: 460,
// 			top: 200,
// 			width: 220,
// 			fieldId: 'poem_title_2',
// 			fontSize: 24,
// 			fontFamily: 'Georgia',
// 			fontStyle: 'italic',
// 		},
// 		{
// 			left: 460,
// 			top: 260,
// 			width: 220,
// 			fieldId: 'poem_text_2',
// 			fontSize: 16,
// 			fontFamily: 'Georgia',
// 		},
// 	],
// 	poem_with_scripture: [
// 		{
// 			left: 320,
// 			top: 150,
// 			width: 500,
// 			fieldId: 'poem_title',
// 			fontSize: 28,
// 			fontFamily: 'Georgia',
// 			fontStyle: 'italic',
// 		},
// 		{
// 			left: 320,
// 			top: 210,
// 			width: 500,
// 			fieldId: 'poem_text',
// 			fontSize: 16,
// 			fontFamily: 'Georgia',
// 		},
// 		{
// 			left: 320,
// 			top: 450,
// 			width: 500,
// 			fieldId: 'scripture_reference',
// 			fontSize: 20,
// 			fontFamily: 'Georgia',
// 			fontWeight: 'bold',
// 		},
// 		{
// 			left: 320,
// 			top: 500,
// 			width: 500,
// 			fieldId: 'scripture_text',
// 			fontSize: 16,
// 			fontFamily: 'Georgia',
// 			fontStyle: 'italic',
// 		},
// 	],
// };

// // lib/canvas-helpers.ts
// export async function addTextFieldsFromLayout(
// 	canvas: Canvas,
// 	layout: any,
// 	panelNumber: number
// ) {
// 	const positions =
// 		poemLayoutPositions[layout.id as keyof typeof poemLayoutPositions] || [];

// 	layout.fields.forEach((field: any, index: number) => {
// 		if (field.type !== 'text' && field.type !== 'textarea') return;

// 		const position = positions[index] || {
// 			left: 320,
// 			top: 200 + index * 100,
// 			width: 500,
// 			fieldId: field.fieldId,
// 			fontSize: 18,
// 			fontFamily: 'Arial',
// 		};

// 		// Look for existing text object with matching fieldId pattern
// 		const existingObject = canvas.getObjects().find((obj: any) => {
// 			const idParts = obj.id?.split('_field_')[1];
// 			return idParts === field.fieldId;
// 		});

// 		if (existingObject && 'text' in existingObject) {
// 			// Update existing object's text content only (preserves all styling)
// 			existingObject.set({
// 				text: field.placeholder || 'Enter text...',
// 			});
// 		} else {
// 			// Create new text object if it doesn't exist
// 			const textObject = new Textbox(field.placeholder || 'Enter text...', {
// 				id: `panel${panelNumber}_field_${field.fieldId}`,
// 				// No panelType here - only in field configuration
// 				left: position.left,
// 				top: position.top,
// 				width: position.width,
// 				fontSize: position.fontSize,
// 				fontFamily: position.fontFamily,
// 				fontStyle: position.fontStyle || 'normal',
// 				fontWeight: position.fontWeight || 'normal',
// 				fill: '#000000',
// 				textAlign: 'center',
// 				originX: 'center',
// 				originY: 'top',
// 			});

// 			canvas.add(textObject);
// 		}
// 	});

// 	canvas.requestRenderAll();
// }
