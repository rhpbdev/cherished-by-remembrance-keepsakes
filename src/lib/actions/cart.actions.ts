'use server';

import { type CartItem } from '@/types';
import { formatError, round2 } from '../utils';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { CartTable, ProductTable, ProductVariantTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { TAX_RATE } from '@/lib/constants';

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
	const itemsPrice = round2(
			items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
		),
		shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
		// taxPrice = round2(0.15 * itemsPrice),
		taxPrice = round2(TAX_RATE * itemsPrice),
		totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

	return {
		itemsPrice: itemsPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice.toFixed(2),
		totalPrice: totalPrice.toFixed(2),
	};
};

export async function addItemToCart(data: CartItem) {
	try {
		// Check for cart cookie
		const sessionCartId = (await cookies()).get('sessionCartId')?.value;
		if (!sessionCartId) throw new Error('Cart session not found');

		// Get session and user ID
		const session = await auth();
		const userId = session?.user?.id ? (session.user.id as string) : undefined;

		// Get cart
		const cart = await getMyCart();

		// Parse and validate item
		const item = cartItemSchema.parse(data);

		// Find product in database
		const product = await db.query.ProductTable.findFirst({
			where: eq(ProductTable.id, item.productId),
		});
		if (!product) throw new Error('Product not found');

		// Resolve the variant (SKU) for stock — falls back to product-level
		// stock for legacy items without a variantId.
		const variant = item.variantId
			? await db.query.ProductVariantTable.findFirst({
					where: eq(ProductVariantTable.id, item.variantId),
				})
			: undefined;
		const availableStock = variant?.stock ?? product.stock;

		// Match an existing cart line by variant when present, else by product.
		const isSameLine = (x: CartItem) =>
			item.variantId
				? x.variantId === item.variantId
				: x.productId === item.productId;

		if (!cart) {
			// Create new cart object
			const newCart = insertCartSchema.parse({
				userId: userId || null, // null for anonymous users
				items: [item],
				sessionCartId: sessionCartId,
				...calcPrice([item]), // Should include totalPrice
			});

			// Add to database
			await db.insert(CartTable).values(newCart);

			// Revalidate the product page
			revalidatePath(`/products/${product.slug}`);

			return {
				success: true,
				message: `${product.name} added to cart`,
			};
		} else {
			// Check if item is already in cart
			const existItem = (cart.items as CartItem[]).find(isSameLine);

			if (existItem) {
				// Check stock
				if (availableStock < existItem.qty + 1) {
					throw new Error('Not enough stock');
				}

				// Increase the quantity
				(cart.items as CartItem[]).find(isSameLine)!.qty = existItem.qty + 1;
			} else {
				// If item does not exist in cart
				// Check stock
				if (availableStock < 1) throw new Error('Not enough stock');

				// Add item to the cart.items
				cart.items.push(item);
			}

			// Save to database
			await db
				.update(CartTable)
				.set({
					items: cart.items,
					...calcPrice(cart.items as CartItem[]),
				})
				.where(eq(CartTable.id, cart.id));

			revalidatePath(`/products/${product.slug}`);

			return {
				success: true,
				message: `${product.name} ${
					existItem ? 'updated in' : 'added to'
				} cart`,
			};
		}
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

export async function updateItemQuantity(productId: string, newQty: number) {
	try {
		// Check for cart cookie
		const sessionCartId = (await cookies()).get('sessionCartId')?.value;
		if (!sessionCartId) throw new Error('Cart session not found');

		// Get session and user ID
		const session = await auth();
		const userId = session?.user?.id ? (session.user.id as string) : undefined;

		// Get cart
		const cart = await getMyCart();
		if (!cart) throw new Error('Cart not found');

		// Find product in database
		const product = await db.query.ProductTable.findFirst({
			where: eq(ProductTable.id, productId),
		});
		if (!product) throw new Error('Product not found');

		// Check stock
		if (product.stock < newQty) {
			throw new Error(`Only ${product.stock} items in stock`);
		}

		// Find item in cart
		const existItem = (cart.items as CartItem[]).find(
			(x) => x.productId === productId
		);

		if (!existItem) throw new Error('Item not found in cart');

		// Update quantity
		existItem.qty = newQty;

		// Save to database
		await db
			.update(CartTable)
			.set({
				items: cart.items,
				...calcPrice(cart.items as CartItem[]),
			})
			.where(eq(CartTable.id, cart.id));

		revalidatePath(`/products/${product.slug}`);
		revalidatePath('/cart');

		return {
			success: true,
			message: `Updated ${product.name} quantity to ${newQty}`,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

export async function getMyCart() {
	// Check for cart cookie
	const sessionCartId = (await cookies()).get('sessionCartId')?.value;
	if (!sessionCartId) throw new Error('Cart session not found');

	// Get session and user ID
	const session = await auth();
	const userId = session?.user?.id ? (session.user.id as string) : undefined;
	// console.log(userId);

	// Get user cart from database using relational query
	const cart = await db.query.CartTable.findFirst({
		where: userId
			? eq(CartTable.userId, userId)
			: eq(CartTable.sessionCartId, sessionCartId),
	});

	// Get user cart from database using sql select
	// const cartArray = await db
	// 	.select()
	// 	.from(CartTable)
	// 	.where(
	// 		userId
	// 			? or(
	// 					eq(CartTable.userId, userId),
	// 					eq(CartTable.sessionCartId, sessionCartId)
	// 			  )
	// 			: eq(CartTable.sessionCartId, sessionCartId)
	// 	)
	// 	.limit(1);

	// const cart = cartArray[0];

	if (!cart) return undefined;

	// Convert decimals and return
	return {
		...cart,
		items: cart.items as CartItem[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
	};
}

export async function removeItemFromCart(productId: string) {
	try {
		// Check for cart cookie
		const sessionCartId = (await cookies()).get('sessionCartId')?.value;
		if (!sessionCartId) throw new Error('Cart session not found');

		// Get product
		const product = await db.query.ProductTable.findFirst({
			where: eq(ProductTable.id, productId),
		});
		if (!product) throw new Error('Product not found');

		// Get the user's cart
		const cart = await getMyCart();
		if (!cart) throw new Error('Cart not found');

		// Check for item in cart
		const exist = (cart.items as CartItem[]).find(
			(x) => x.productId === productId
		);
		if (!exist) throw new Error('Item not found');

		// Check if item quantity is only 1
		if (exist.qty === 1) {
			// Remove item from cart
			cart.items = (cart.items as CartItem[]).filter(
				(x) => x.productId !== exist.productId
			);
		} else {
			// Decrease the qty
			(cart.items as CartItem[]).find((x) => x.productId === productId)!.qty =
				exist.qty - 1;
		}

		// Update cart in database
		await db
			.update(CartTable)
			.set({
				items: cart.items,
				...calcPrice(cart.items as CartItem[]),
			})
			.where(eq(CartTable.id, cart.id));

		revalidatePath(`/products/${product.slug}`);

		return {
			success: true,
			message: `${product.name} was removed from cart`,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Delete item from shopping cart
export async function deleteCartItem(productId: string) {
	try {
		// Check for cart cookie
		const sessionCartId = (await cookies()).get('sessionCartId')?.value;
		if (!sessionCartId) throw new Error('Cart session not found');

		// Get product
		const product = await db.query.ProductTable.findFirst({
			where: eq(ProductTable.id, productId),
		});
		if (!product) throw new Error('Product not found');

		// Get the user's cart
		const cart = await getMyCart();
		if (!cart) throw new Error('Cart not found');

		// Check for item in cart
		const exist = (cart.items as CartItem[]).find(
			(x) => x.productId === productId
		);
		if (!exist) throw new Error('Item not found');

		// Remove item from cart
		cart.items = (cart.items as CartItem[]).filter(
			(x) => x.productId !== exist.productId
		);

		// Update cart in database
		await db
			.update(CartTable)
			.set({
				items: cart.items,
				...calcPrice(cart.items as CartItem[]),
			})
			.where(eq(CartTable.id, cart.id));

		revalidatePath(`/cart`);

		return {
			success: true,
			message: `${product.name} was removed from cart`,
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
