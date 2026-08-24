import { z } from 'zod';

const urlSchema = z.url().refine(
	(url) => {
		const allowed = [
			'https://ik.imagekit.io',
			'https://images.unsplash.com',
			'https://placehold.co',
			'https://utfs.io',
			'https://1muluawqaj.ufs.sh',
			'https://replicate.delivery',
		];
		return allowed.some((domain) => url.startsWith(domain));
	},
	{ message: 'Image URL must be from allowed domains' },
);

// Pattern fill (background images)
const patternFillSchema = z.looseObject({
	type: z.literal('pattern'),
	source: urlSchema,
	repeat: z.string().optional(),
	offsetX: z.number().optional(),
	offsetY: z.number().optional(),
	crossOrigin: z.string().optional(),
	patternTransform: z.array(z.number()).optional(),
});

// Gradient fill
const gradientFillSchema = z.looseObject({
	type: z.enum(['linear', 'radial']),
	coords: z.looseObject({}).optional(),
	colorStops: z.array(z.looseObject({})).optional(),
});

// Fill can be a color string, pattern, or gradient
const fillSchema = z.union([
	z.string(), // Solid color like "rgba(255, 255, 255, 1)" or "red"
	patternFillSchema,
	gradientFillSchema,
	z.null(),
]);

// Shadow schema (since it appears in your objects)
const shadowSchema = z
	.looseObject({
		type: z.literal('shadow').optional(),
		color: z.string(),
		blur: z.number(),
		offsetX: z.number(),
		offsetY: z.number(),
	})
	.nullable();

// Base schema for common Fabric.js object properties
const baseFabricObjectSchema = z.looseObject({
	type: z.string(),
	top: z.number(),
	left: z.number(),
	width: z.number(),
	height: z.number(),
	scaleX: z.number().optional(),
	scaleY: z.number().optional(),
	angle: z.number().optional(),
	opacity: z.number().min(0).max(1).optional(),
	visible: z.boolean().optional(),
	selectable: z.boolean().optional(),
	name: z.string().optional(),
	fill: fillSchema.optional(),
	shadow: shadowSchema.optional(),
	// Custom fields for your app
	fieldId: z.string().optional(),
	fieldType: z.string().optional(),
	fieldLabel: z.string().optional(),
	fieldHint: z.string().optional(),
	src: urlSchema.optional(),
	text: z.string().max(10_000).optional(),
});

// Page schema
const pageSchema = z.object({
	id: z.uuid(),
	pageNumber: z.number().int().positive().max(24),
	label: z.string().max(100),
	width: z.number().positive().max(10000),
	height: z.number().positive().max(10000),
	background: z.string().optional(),
	marginSize: z.number().optional(),
	gutterSize: z.number().optional(),
	themeId: z.string().optional(),
	objects: z.array(baseFabricObjectSchema).max(500),
	backgroundImage: z.any().optional(),
	clipPath: baseFabricObjectSchema.optional(),
	pageImagePreview: z.string().default(''),
});

// Top-level design JSON schema
export const designJsonSchema = z.object({
	pages: z.array(pageSchema).min(1).max(24),
	designImagePreview: z.string().default(''),
});

export type DesignJson = z.infer<typeof designJsonSchema>;
