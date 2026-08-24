'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../validators';
import { db } from '@/drizzle/db';
import {
	CartTable,
	OrderItemTable,
	OrderTable,
	ProductTable,
	UserTable,
} from '@/drizzle/schema';
import type { CartItem, Order, PaymentResult, ShippingAddress } from '@/types';
import { count, desc, eq, ilike, sql } from 'drizzle-orm';
import { paypal } from '@/services/paypal/client';
import { revalidatePath } from 'next/cache';
import { PAGE_SIZE } from '../constants';
import { requireAdmin } from '../../features/auth/auth-guard';
import { sendPurchaseReceipt } from '@/email';

import { appendOrderToSheet, OrderSheetData } from '@/services/google/sheets';
import { createNetSuiteInvoice } from '@/services/netsuite/client';

// Create order and create the order items
export async function createOrder() {
	try {
		const session = await auth();
		if (!session) throw new Error('User is not authenticated');

		const cart = await getMyCart();
		const userId = session?.user?.id;
		if (!userId) throw new Error('User not found');

		const user = await getUserById(userId);

		if (!cart || cart.items.length === 0) {
			return {
				success: false,
				message: 'Your cart is empty',
				redirectTo: '/cart',
			};
		}

		if (!user.address) {
			return {
				success: false,
				message: 'No shipping address',
				redirectTo: '/shipping-address',
			};
		}

		if (!user.paymentMethod) {
			return {
				success: false,
				message: 'No payment method',
				redirectTo: '/payment-method',
			};
		}

		// Create the order object
		const order = insertOrderSchema.parse({
			userId: user.id,
			shippingAddress: user.address,
			paymentMethod: user.paymentMethod,
			itemsPrice: cart.itemsPrice,
			shippingPrice: cart.shippingPrice,
			taxPrice: cart.taxPrice,
			totalPrice: cart.totalPrice,
		});

		// Create a transaction to create order and order items in the database
		const insertedOrderId = await db.transaction(async (tx) => {
			// Create the order
			const [insertedOrder] = await tx
				.insert(OrderTable)
				.values(order)
				.returning();

			// Create the order items from the cart items
			for (const item of cart.items as CartItem[]) {
				await tx.insert(OrderItemTable).values({
					...item,
					price: item.price,
					orderId: insertedOrder.id,
				});
			}

			// Clear cart
			await tx
				.update(CartTable)
				.set({
					items: [],
					totalPrice: '0',
					taxPrice: '0',
					shippingPrice: '0',
					itemsPrice: '0',
				})
				.where(eq(CartTable.id, cart.id));

			return insertedOrder.id;
		});

		if (!insertedOrderId) throw new Error('Order not created');

		return {
			success: true,
			message: 'Order created',
			redirectTo: `/order/${insertedOrderId}`,
		};
	} catch (error) {
		if (isRedirectError(error)) throw error;
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Get order by ID
export async function getOrderById(orderId: string) {
	const data = await db.query.OrderTable.findFirst({
		where: eq(OrderTable.id, orderId),
		with: {
			orderItems: true,
			user: {
				columns: {
					name: true,
					email: true,
				},
			},
		},
	});

	return data;
}

// Create new PayPal order
export async function createPayPalOrder(orderId: string) {
	try {
		// Get order from database
		const order = await db.query.OrderTable.findFirst({
			where: eq(OrderTable.id, orderId),
		});

		if (order) {
			// Create PayPal order by calling createOrder in paypal object (paypal.ts)
			const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

			// Update the order with PayPal order id
			await db
				.update(OrderTable)
				.set({
					paymentResult: {
						id: paypalOrder.id,
						email_address: '',
						status: '',
						pricePaid: '0',
					},
				})
				.where(eq(OrderTable.id, orderId));

			return {
				success: true,
				message: 'Item order created successfully',
				data: paypalOrder.id,
			};
		} else {
			throw new Error('Order not found');
		}
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Approve PayPal order and update order to paid
export async function approvePayPalOrder(
	orderId: string,
	data: { orderID: string },
) {
	try {
		// Get order from database
		const order = await db.query.OrderTable.findFirst({
			where: eq(OrderTable.id, orderId),
		});

		if (!order) throw new Error('Order not found');

		const captureData = await paypal.capturePayment(data.orderID);

		if (
			!captureData ||
			captureData.id !== (order.paymentResult as PaymentResult)?.id ||
			captureData.status !== 'COMPLETED'
		) {
			throw new Error('Error in PayPal payment');
		}

		// Update order to paid
		await updateOrderToPaid({
			orderId,
			paymentResult: {
				id: captureData.id,
				status: captureData.status,
				email_address: captureData.payer.email_address,
				pricePaid:
					captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
			},
		});

		revalidatePath(`/order/${orderId}`);

		return {
			success: true,
			message: 'Your order has been paid',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Helper to format order data for Google Sheets
function formatOrderForSheet(order: any): OrderSheetData {
	const shippingAddress = order.shippingAddress as ShippingAddress;
	const addressString = `${shippingAddress.fullName}, ${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;

	const itemsString = order.orderItems
		.map((item: any) => `${item.name} (x${item.qty}) - $${item.price}`)
		.join('; ');

	return {
		orderId: order.id,
		customerName: order.user.name,
		customerEmail: order.user.email,
		orderDate: new Date(order.createdAt).toLocaleString(),
		totalAmount: `$${order.totalPrice}`,
		paymentMethod: order.paymentMethod,
		paymentStatus: order.isPaid ? 'Paid' : 'Pending',
		shippingAddress: addressString,
		items: itemsString,
	};
}

// Update order to paid
export async function updateOrderToPaid({
	orderId,
	paymentResult,
}: {
	orderId: string;
	paymentResult?: PaymentResult;
}) {
	// Get order from database with orderItems
	const order = await db.query.OrderTable.findFirst({
		where: eq(OrderTable.id, orderId),
		with: {
			orderItems: true,
		},
	});

	if (!order) throw new Error('Order not found');

	// If already paid, just return without error (prevents duplicate webhook/success page calls)
	if (order.isPaid) {
		return;
	}

	// Transaction to update order and account for product stock
	await db.transaction(async (tx) => {
		// Iterate over products and update stock
		// for (const item of order.orderItems) {
		// 	await tx
		// 		.update(ProductTable)
		// 		.set({
		// 			stock: sql`${ProductTable.stock} - ${item.qty}`,
		// 		})
		// 		.where(eq(ProductTable.id, item.productId));
		// }

		// Set the order to paid
		await tx
			.update(OrderTable)
			.set({
				isPaid: true,
				paidAt: new Date(),
				paymentResult,
			})
			.where(eq(OrderTable.id, orderId));
	});

	// Get updated order after transaction
	const updatedOrder = await db.query.OrderTable.findFirst({
		where: eq(OrderTable.id, orderId),
		with: {
			orderItems: true,
			user: {
				columns: {
					name: true,
					email: true,
				},
			},
		},
	});

	if (!updatedOrder)
		throw new Error(
			'Order not found. Either deleted, corrupted, or transaction failed.',
		);

	// Send to Google Sheets (non-blocking)
	try {
		const shippingAddress = updatedOrder.shippingAddress as ShippingAddress;
		const addressString = `${shippingAddress.fullName}, ${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;

		const itemsString = updatedOrder.orderItems
			.map((item: any) => `${item.name} (x${item.qty}) - $${item.price}`)
			.join('; ');

		const sheetData: OrderSheetData = {
			orderId: updatedOrder.id,
			customerName: updatedOrder.user.name,
			customerEmail: updatedOrder.user.email,
			orderDate: new Date(updatedOrder.createdAt).toLocaleString(),
			totalAmount: `$${updatedOrder.totalPrice}`,
			paymentMethod: updatedOrder.paymentMethod,
			paymentStatus: 'Paid',
			shippingAddress: addressString,
			items: itemsString,
		};

		await appendOrderToSheet(sheetData);
		console.log('Order sent to Google Sheets:', updatedOrder.id);
	} catch (error) {
		console.error('Failed to send order to Google Sheets:', error);
		// Don't throw - we don't want sheet errors to break the order
	}

	// Send to NetSuite (non-blocking)
	try {
		const result = await createNetSuiteInvoice({
			entity: { id: '15661' },
			item: {
				items: updatedOrder.orderItems.map((item) => ({
					item: { id: '462' },
					quantity: item.qty,
					rate: Number(item.price),
				})),
			},
			customForm: { id: '320' },
			subsidiary: { id: '1' },
			amountPaid: Number(updatedOrder.totalPrice),
			shippingCost: Number(updatedOrder.shippingPrice),
		});
		console.log('NetSuite invoice created:', result.invoiceId);
	} catch (error) {
		console.error('Failed to create NetSuite invoice:', error);
	}

	// Send purchase receipt email
	sendPurchaseReceipt({
		order: {
			...updatedOrder,
			shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
			paymentResult: updatedOrder.paymentResult as PaymentResult,
		} as Order,
	});
}

// Get user's orders
export async function getMyOrders({
	limit = PAGE_SIZE,
	page,
}: {
	limit?: number;
	page: number;
}) {
	const session = await auth();
	if (!session) throw new Error('User is not authorized');

	const data = await db
		.select()
		.from(OrderTable)
		.where(eq(OrderTable.userId, session?.user?.id as string))
		.orderBy(desc(OrderTable.createdAt))
		.limit(limit)
		.offset((page - 1) * limit);

	const [{ dataCount }] = await db
		.select({ dataCount: count() })
		.from(OrderTable)
		.where(eq(OrderTable.userId, session?.user?.id as string));

	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
	};
}

type SalesDataType = {
	month: string;
	totalSales: number;
}[];

// Get sales data and order summary
export async function getOrderSummary() {
	// 1. Get counts for each resource
	const [{ ordersCount }] = await db
		.select({ ordersCount: count() })
		.from(OrderTable);
	const [{ productsCount }] = await db
		.select({ productsCount: count() })
		.from(ProductTable);
	const [{ usersCount }] = await db
		.select({ usersCount: count() })
		.from(UserTable);

	// 2. Calculate the total sales
	const [result] = await db
		.select({
			totalPrice: sql<string>`COALESCE(SUM(${OrderTable.totalPrice}), '0')`,
		})
		.from(OrderTable);

	const totalSales = {
		_sum: {
			totalPrice: result.totalPrice,
		},
	};

	// 3. Get monthly sales
	const salesDataRaw = await db
		.select({
			month: sql<string>`to_char(${OrderTable.createdAt}, 'MM/YY')`,
			totalSales: sql<string>`sum(${OrderTable.totalPrice})`,
		})
		.from(OrderTable)
		.groupBy(sql`to_char(${OrderTable.createdAt}, 'MM/YY')`);

	const salesData: SalesDataType = salesDataRaw.map((entry) => ({
		month: entry.month,
		totalSales: Number(entry.totalSales),
	}));

	// 4. Get latest sales
	const latestSales = await db.query.OrderTable.findMany({
		with: {
			user: {
				columns: {
					name: true,
				},
			},
		},
		orderBy: [desc(OrderTable.createdAt)],
		limit: 6,
	});

	return {
		ordersCount,
		productsCount,
		usersCount,
		totalSales,
		latestSales,
		salesData, // Added salesData to return
	};
}

// Get all orders
export async function getAllOrders({
	limit = PAGE_SIZE,
	page,
	query,
}: {
	limit?: number;
	page: number;
	query: string;
}) {
	await requireAdmin();

	if (query && query !== 'all') {
		// Use a join since we are filtering by the user name on the OrderTable
		const data = await db
			.select({
				order: OrderTable,
				userName: UserTable.name,
			})
			.from(OrderTable)
			.innerJoin(UserTable, eq(OrderTable.userId, UserTable.id))
			.where(ilike(UserTable.name, `%${query}%`))
			.orderBy(desc(OrderTable.createdAt))
			.limit(limit)
			.offset((page - 1) * limit);

		const [{ orderCount }] = await db
			.select({ orderCount: count() })
			.from(OrderTable)
			.innerJoin(UserTable, eq(OrderTable.userId, UserTable.id))
			.where(ilike(UserTable.name, `%${query}%`));

		// Transform data to match expected structure
		const transformedData = data.map(({ order, userName }) => ({
			...order,
			user: { name: userName },
		}));

		return {
			data: transformedData,
			totalPages: Math.ceil(orderCount / limit),
		};
	} else {
		// No filter/join = findMany
		const data = await db.query.OrderTable.findMany({
			with: {
				user: {
					columns: {
						name: true,
					},
				},
			},
			orderBy: desc(OrderTable.createdAt),
			limit: limit,
			offset: (page - 1) * limit,
		});

		const [{ orderCount }] = await db
			.select({ orderCount: count() })
			.from(OrderTable);

		return {
			data,
			totalPages: Math.ceil(orderCount / limit),
		};
	}
}

// Delete an order
export async function deleteOrder(id: string) {
	try {
		await db.delete(OrderTable).where(eq(OrderTable.id, id));

		revalidatePath('/admin/orders');

		return {
			success: true,
			message: 'Order deleted successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update COD order to paid
export async function updateOrderToPaidCOD(orderId: string) {
	try {
		await updateOrderToPaid({ orderId });

		revalidatePath(`/order/${orderId}`);

		return {
			success: true,
			message: 'Order marked as paid',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update COD order to delivered
export async function deliverOrder(orderId: string) {
	try {
		const order = await db.query.OrderTable.findFirst({
			where: eq(OrderTable.id, orderId),
		});

		if (!order) throw new Error('Order not found');
		if (!order.isPaid) throw new Error('Order is not paid');

		await db
			.update(OrderTable)
			.set({
				isDelivered: true,
				deliveredAt: new Date(),
			})
			.where(eq(OrderTable.id, orderId));

		revalidatePath(`/order/${orderId}`);

		return {
			success: true,
			message: 'Order updated to delivered',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
