/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import {
	insertProductSchema,
	insertCartSchema,
	cartItemSchema,
	shippingAddressSchema,
	insertOrderSchema,
	insertOrderItemSchema,
	paymentResultSchema,
	insertReviewSchema,
	insertDesignSchema,
	productOptionSchema,
	variantFormSchema,
} from '@/lib/validators';

export type ProductOption = z.infer<typeof productOptionSchema>;

export type ProductVariant = z.infer<typeof variantFormSchema> & {
	id: string;
	productId: string;
	createdAt: Date;
	updatedAt: Date;
};

export type Product = z.infer<typeof insertProductSchema> & {
	id: string;
	rating: string;
	createdAt: Date;
	panelConfiguration?: PanelConfiguration | null;
	options?: ProductOption[];
	variants?: ProductVariant[];
	// height: string;
	// width: string;
};

export type Design = z.infer<typeof insertDesignSchema> & {
	id: string;
	productId: string;
	productName: string;
	dateOfBirth: string;
	dateOfDeath: string;
	designName: string;
	slug: string;
	price: string;
	height: string;
	width: string;
	sessionDesignId: string;
	userId?: string | null;
	panelConfiguration?: PanelConfiguration;
	fieldConfiguration?: FieldConfiguration[]; // Simplified for now
	jsonData?: JsonData; // Simplified for now
	imagePreview?: string | null;
	designFiles?: any; // Simplified for now
	isApproved: boolean;
	approvedAt?: Date | null;
	showGutters?: boolean | null;
	createdAt: Date;
	updatedAt: Date;
};

export interface ProgramFieldConfig {
	type: string;
	label: string;
	fieldId: string;
	required?: boolean;
	panelNumber: number;
	placeholder?: string;
	maxLength?: number;
	maxRows?: number;
}

export interface FieldConfiguration {
	panelNumber: number;
	panelType: string;
	fields: ProgramFieldConfig[];
	selectedTemplateId?: string;
}

export interface PanelSpec {
	label: string;
	width: number;
	height: number;
	safeZone: number;
	bleedSize: number;
	gutterSize: number;
	marginSize: number;
	panelNumber: number;
	type?: 'collage' | 'poem' | 'standard';
}

export interface PanelConfiguration {
	totalPanels: number;
	showMargins: boolean;
	showGutters: boolean;
	panels?: PanelSpec[];
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
	id: string;
	createdAt: Date;
	isPaid: boolean;
	paidAt: Date | null;
	isDelivered: boolean;
	deliveredAt: Date | null;
	orderItems: OrderItem[];
	user: { name: string; email: string };
	paymentResult: PaymentResult;
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type Review = z.infer<typeof insertReviewSchema> & {
	id: string;
	createdAt: Date;
	user?: { name: string };
};

// Design Types

export interface PrintSpecs {
	marginSize: number;
	gutterSize: number;
	bleedSize: number;
	safeZone: number;
	foldLines?: number[];
	bindingType?: 'saddle-stitch' | 'perfect-bind' | 'spiral' | 'none';
	guttersActive?: boolean;
}

export interface User {
	id: string;
	name?: string | null;
	email?: string | null;
	role?: string | null;
}

// Unsplash
export interface UnsplashImage {
	id: string;
	urls: {
		thumb: string;
		regular: string;
		small?: string;
		full?: string;
		raw?: string;
	};
	alt_description: string | null;
	slug: string;
	description?: string | null;
}

export interface UnsplashSearchResponse {
	results: UnsplashImage[];
	total: number;
	total_pages: number;
}

export interface Theme {
	id: string;
	name: string;
	displayName: string;
	imagePreview: string;
	isActive: boolean;
	jsonData: JsonData; // Or PanelData[] if you have the type
	fieldConfiguration: any; // Or FieldConfiguration[] if you have the type
	productId: string;
	tags?: string[] | null;
	createdAt: Date;
}

export type JsonData = Array<{
	panelNumber: number;
	imagePreview: string;
	jsonTemplate: any;
}>;

// Types for selectable field configurations panel
export interface FieldConfigurationTemplate {
	id: string;
	name: string; // e.g., "4 Photo Layout", "5 Photo Layout"
	description?: string;
	previewImage?: string; // Optional preview of the layout
	fields: any[];
}

export interface PanelFieldConfiguration {
	availableTemplates: FieldConfigurationTemplate[];
	selectedTemplateId: string;
	fields: any[];
	panelNumber: number;
}
