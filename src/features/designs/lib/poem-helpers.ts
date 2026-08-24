import { ProgramFieldConfig } from '@/types';
import { Canvas, Textbox } from 'fabric';

// Layout position configuration for poem layouts
const poemLayoutPositions = {
	poem_single: [
		{
			left: 320,
			top: 200,
			width: 500,
			fieldId: 'poem_title',
			fontSize: 32,
			fontFamily: 'Georgia',
			fontStyle: 'italic',
		},
		{
			left: 320,
			top: 280,
			width: 500,
			fieldId: 'poem_text',
			fontSize: 18,
			fontFamily: 'Georgia',
		},
	],
};

// lib/canvas-helpers.ts
export async function addTextFieldsFromLayout(
	canvas: Canvas,
	layout: any,
	panelNumber: number,
	centerX: number,
	centerY: number
) {
	const positions =
		poemLayoutPositions[layout.id as keyof typeof poemLayoutPositions] || [];

	const gapBetweenTitleAndText = 40; // Gap between title and text

	// Separate title and text fields
	const titleField = layout.fields.find(
		(f: ProgramFieldConfig) => f.fieldId === 'poem_title'
	);
	const textField = layout.fields.find(
		(f: ProgramFieldConfig) => f.fieldId === 'poem_text'
	);

	let titleObject: any = null;
	let titleHeight = 40; // Default estimate

	// First, handle the title
	if (titleField) {
		const titlePosition = positions[0] || {
			left: centerX,
			top: 100, // Temporary position, will be adjusted
			width: 500,
			fieldId: 'poem_title',
			fontSize: 32,
			fontFamily: 'Georgia',
			fontWeight: 'normal',
			fontStyle: 'italic',
		};

		// Look for existing title object
		const existingTitle = canvas.getObjects().find((obj: any) => {
			const idParts = obj.id?.split('_field_')[1];
			return idParts === 'poem_title';
		});

		if (existingTitle && 'text' in existingTitle) {
			// Update existing title (preserve font properties like fill color)
			existingTitle.set({
				text: titleField.placeholder || 'Enter text...',
				left: titlePosition.left,
				width: titlePosition.width,
				originX: 'center',
				originY: 'top',
			});
			titleObject = existingTitle;
		} else {
			// Create new title
			titleObject = new Textbox(titleField.placeholder || 'Enter text...', {
				id: `panel${panelNumber}_field_${titleField.fieldId}`,
				left: titlePosition.left,
				top: 100, // Temporary
				width: titlePosition.width,
				fontSize: titlePosition.fontSize,
				fontFamily: titlePosition.fontFamily,
				fontStyle: titlePosition.fontStyle || 'normal',
				fontWeight: (titlePosition as any).fontWeight || 'normal',
				fill: '#000000',
				textAlign: 'center',
				originX: 'center',
				originY: 'top',
			});
			canvas.add(titleObject as any);
		}

		// Get actual rendered height of title
		titleHeight = titleObject.height || 40;
	}

	// Now handle the text field
	if (textField) {
		const textPosition = positions[1] || {
			left: centerX,
			top: 200,
			width: 500,
			fieldId: 'poem_text',
			fontSize: 18,
			fontFamily: 'Georgia',
			fontWeight: 'normal',
			fontStyle: 'normal',
		};

		// Look for existing text object
		const existingText = canvas.getObjects().find((obj: any) => {
			const idParts = obj.id?.split('_field_')[1];
			return idParts === 'poem_text';
		});

		if (existingText && 'text' in existingText) {
			// Update existing text (preserve font properties like fill color)
			existingText.set({
				text: textField.placeholder || 'Enter text...',
				left: textPosition.left,
				width: textPosition.width,
				originX: 'center',
				originY: 'top',
			});
		} else {
			// Create new text
			const textObject = new Textbox(textField.placeholder || 'Enter text...', {
				id: `panel${panelNumber}_field_${textField.fieldId}`,
				left: textPosition.left,
				top: 200, // Temporary
				width: textPosition.width,
				fontSize: textPosition.fontSize,
				fontFamily: textPosition.fontFamily,
				fontStyle: textPosition.fontStyle || 'normal',
				fontWeight: (textPosition as any).fontWeight || 'normal',
				fill: '#000000',
				textAlign: 'center',
				originX: 'center',
				originY: 'top',
			});
			canvas.add(textObject as any);
		}
	}

	// Now position both elements centered vertically
	// Get both objects again to ensure we have current references
	const finalTitleObject = canvas.getObjects().find((obj: any) => {
		const idParts = obj.id?.split('_field_')[1];
		return idParts === 'poem_title';
	});

	const finalTextObject = canvas.getObjects().find((obj: any) => {
		const idParts = obj.id?.split('_field_')[1];
		return idParts === 'poem_text';
	});

	if (finalTitleObject && finalTextObject) {
		const actualTitleHeight = finalTitleObject.height || 40;
		const actualTextHeight = finalTextObject.height || 200;
		const totalHeight =
			actualTitleHeight + gapBetweenTitleAndText + actualTextHeight;

		// Center the combined block vertically
		const startY = centerY - totalHeight / 2;

		finalTitleObject.set({
			top: startY,
		});

		finalTextObject.set({
			top: startY + actualTitleHeight + gapBetweenTitleAndText,
		});
	} else if (finalTitleObject) {
		// Only title exists, center it
		const actualTitleHeight = finalTitleObject.height || 40;
		finalTitleObject.set({
			top: centerY - actualTitleHeight / 2,
		});
	} else if (finalTextObject) {
		// Only text exists, center it
		const actualTextHeight = finalTextObject.height || 200;
		finalTextObject.set({
			top: centerY - actualTextHeight / 2,
		});
	}

	canvas.requestRenderAll();
}
