'use server';

import { db } from '@/drizzle/db';
import {
	ProductVariantTable,
	OrderItemTable,
	DesignTable,
} from '@/drizzle/schema';
import { eq, inArray, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { variantFormSchema, type VariantFormValues } from '../validators';
import { formatError } from '../utils';
import { selectDefaultVariant } from '@/lib/utils/variant';

/**
 * Diff/upsert the full set of variants for a product from the inline admin
 * product form: rows with an id are updated, rows without one are inserted,
 * and existing rows missing from the payload are deleted. Exactly one variant
 * is forced to be the default.
 */
export async function saveProductVariants(
	productId: string,
	variants: VariantFormValues[],
) {
	try {
		if (!productId) throw new Error('Product is required');

		// Validate every row up front.
		const parsed = variants.map((v) => variantFormSchema.parse(v));

		// Enforce exactly one default among active rows (fall back to first row).
		const defaults = parsed.filter((v) => v.isDefault);
		if (defaults.length !== 1 && parsed.length > 0) {
			const chosen = selectDefaultVariant(parsed);
			parsed.forEach((v) => {
				v.isDefault = v === chosen;
			});
		}

		// Determine which existing variants are being removed.
		const existing = await db.query.ProductVariantTable.findMany({
			where: eq(ProductVariantTable.productId, productId),
			columns: { id: true },
		});
		const keepIds = parsed.map((v) => v.id).filter(Boolean) as string[];
		const toDelete = existing
			.map((e) => e.id)
			.filter((id) => !keepIds.includes(id));

		// Guard: never hard-delete a variant that an existing order or design
		// still references (FK). The admin must deactivate it instead — otherwise
		// Postgres would raise an opaque FK violation.
		if (toDelete.length > 0) {
			const [orderRef, designRef] = await Promise.all([
				db.query.OrderItemTable.findFirst({
					where: inArray(OrderItemTable.variantId, toDelete),
					columns: { variantId: true },
				}),
				db.query.DesignTable.findFirst({
					where: inArray(DesignTable.variantId, toDelete),
					columns: { variantId: true },
				}),
			]);
			if (orderRef || designRef) {
				return {
					success: false,
					message:
						'Cannot delete a variant that existing orders or designs still reference. Set it inactive instead.',
				};
			}
		}

		// Split the payload: rows without an id are inserted, rows with one updated.
		const toInsert = parsed.filter((v) => !v.id);
		const toUpdate = parsed.filter(
			(v): v is VariantFormValues & { id: string } => Boolean(v.id),
		);
		const rowValues = (v: VariantFormValues) => ({
			productId,
			variantOptions: v.variantOptions,
			sku: v.sku,
			slug: v.slug,
			price: v.price,
			stock: v.stock,
			allowedQuantities: v.allowedQuantities,
			printSpec: v.printSpec,
			images: v.images,
			isDefault: v.isDefault,
			isActive: v.isActive,
		});

		// Apply the delete + upsert atomically so a mid-save failure can't leave
		// a partially-updated variant set behind.
		await db.transaction(async (tx) => {
			if (toDelete.length > 0) {
				await tx
					.delete(ProductVariantTable)
					.where(
						and(
							eq(ProductVariantTable.productId, productId),
							inArray(ProductVariantTable.id, toDelete),
						),
					);
			}

			if (toInsert.length > 0) {
				await tx.insert(ProductVariantTable).values(toInsert.map(rowValues));
			}

			for (const v of toUpdate) {
				await tx
					.update(ProductVariantTable)
					.set({ ...rowValues(v), updatedAt: new Date() })
					.where(
						and(
							eq(ProductVariantTable.id, v.id),
							eq(ProductVariantTable.productId, productId),
						),
					);
			}
		});

		revalidatePath('/admin/products');
		revalidatePath(`/admin/products/${productId}`);

		return { success: true, message: 'Variants saved' };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
