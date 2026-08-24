'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Image from 'next/image';
import { getPaymentMethodLabel } from '@/lib/constants';
import Link from 'next/link';
import { useTransition } from 'react';
import {
	PayPalButtons,
	PayPalScriptProvider,
	usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import {
	createPayPalOrder,
	approvePayPalOrder,
	updateOrderToPaidCOD,
	deliverOrder,
} from '@/lib/actions/order.actions';
import StripePayment from './stripe-payment';

const OrderDetailsTable = ({
	order,
	payPalClientId,
	isAdmin,
	stripeClientSecret,
}: {
	order: Omit<Order, 'paymentResult'>;
	payPalClientId: string;
	isAdmin: boolean;
	stripeClientSecret: string | null;
}) => {
	const {
		id,
		shippingAddress,
		orderItems,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
		paymentMethod,
		isDelivered,
		isPaid,
		paidAt,
		deliveredAt,
	} = order;

	const PrintLoadingState = () => {
		const [{ isPending, isRejected }] = usePayPalScriptReducer();
		let status = '';

		if (isPending) {
			status = 'Loading PayPal...';
		} else if (isRejected) {
			status = 'Error loading PayPal';
		}
		return status;
	};

	const handleCreatePayPalOrder = async () => {
		const res = await createPayPalOrder(order.id);

		if (!res.success) {
			toast.error(res.message);
		}

		return res.data;
	};

	const handleApprovePayPalOrder = async (data: { orderID: string }) => {
		const res = await approvePayPalOrder(order.id, data);

		if (!res.success) {
			toast.error(res.message);
		} else {
			toast.success(res.message);
		}
	};

	// Button to mark order as paid
	const MarkAsPaidButton = () => {
		const [isPending, startTransition] = useTransition();

		return (
			<Button
				type='button'
				disabled={isPending}
				onClick={() =>
					startTransition(async () => {
						const res = await updateOrderToPaidCOD(order.id);

						if (!res.success) {
							toast.error(res.message);
						} else {
							toast.success(res.message);
						}
					})
				}
			>
				{isPending ? 'Processing...' : 'Mark As Paid'}
			</Button>
		);
	};

	// Button to mark order as delivered
	const MarkAsDeliveredButton = () => {
		const [isPending, startTransition] = useTransition();

		return (
			<Button
				type='button'
				disabled={isPending}
				onClick={() =>
					startTransition(async () => {
						const res = await deliverOrder(order.id);

						if (!res.success) {
							toast.error(res.message);
						} else {
							toast.success(res.message);
						}
					})
				}
			>
				{isPending ? 'Processing...' : 'Mark As Delivered'}
			</Button>
		);
	};

	return (
		<div className='w-full flex flex-col items-center justify-center pb-4'>
			<div className='w-7xl'>
				<h1 className='py-4 text-2xl font-bold'>Order {formatId(id)}</h1>
				<div className='grid md:grid-cols-3 md:gap-5 w-full'>
					<div className='col-span-2 space-y-4 overflow-x-auto'>
						<Card>
							<CardContent className='p-4 gap-4'>
								<h2 className='text-xl pb-4 font-bold'>Payment Method</h2>
								<p className='mb-2'>{getPaymentMethodLabel(paymentMethod)}</p>
								{isPaid ? (
									<Badge variant='secondary' className='bg-green-400'>
										Paid at {formatDateTime(paidAt!).dateTime}
									</Badge>
								) : (
									<Badge variant='destructive'>Not paid</Badge>
								)}
							</CardContent>
						</Card>
						<Card>
							<CardContent className='p-4 gap-4'>
								<h2 className='text-xl pb-4 font-bold'>Shipping Address</h2>
								<p>{shippingAddress.fullName}</p>
								<p className='mb-2'>
									{shippingAddress.streetAddress}, {shippingAddress.city}
									{shippingAddress.postalCode}, {shippingAddress.country}
								</p>
								{isDelivered ? (
									<Badge variant='secondary'>
										Delivered at {formatDateTime(deliveredAt!).dateTime}
									</Badge>
								) : (
									<Badge variant='destructive'>Not delivered</Badge>
								)}
							</CardContent>
						</Card>
						<Card>
							<CardContent className='p-4 gap-4'>
								<h2 className='text-xl pb-4 font-bold'>Order Items</h2>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Items</TableHead>
											<TableHead>Quantity</TableHead>
											<TableHead className='text-right'>Price</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{orderItems.map((item) => (
											<TableRow key={item.slug}>
												<TableCell>
													<Link
														href={`/products/${item.slug}`}
														className='flex items-center'
													>
														<Image
															src={item.image}
															alt={item.name}
															width={50}
															height={50}
														/>
														<span className='px-2'>{item.name}</span>
													</Link>
												</TableCell>
												<TableCell>
													<span className='px-2'>{item.qty}</span>
												</TableCell>
												<TableCell className='text-right'>
													${item.price}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
					<div>
						<Card>
							<CardContent className='p-4 gap-4 space-y-4'>
								<div className='flex justify-between'>
									<div>Items</div>
									<div>{formatCurrency(itemsPrice)}</div>
								</div>
								<div className='flex justify-between'>
									<div>Tax</div>
									<div>{formatCurrency(taxPrice)}</div>
								</div>
								<div className='flex justify-between'>
									<div>Shipping</div>
									<div>{formatCurrency(shippingPrice)}</div>
								</div>
								<div className='flex justify-between'>
									<div>Total</div>
									<div>{formatCurrency(totalPrice)}</div>
								</div>
								{/* PayPal Payment */}
								{!isPaid && paymentMethod === 'PayPal' && (
									<div>
										<PayPalScriptProvider
											options={{ clientId: payPalClientId }}
										>
											<PrintLoadingState />
											<PayPalButtons
												createOrder={handleCreatePayPalOrder}
												onApprove={handleApprovePayPalOrder}
											/>
										</PayPalScriptProvider>
									</div>
								)}
								{/* Stripe Payment */}
								{!isPaid &&
									paymentMethod === 'Stripe' &&
									stripeClientSecret && (
										<StripePayment
											priceInCents={Number(order.totalPrice) * 100}
											orderId={order.id}
											clientSecret={stripeClientSecret}
										/>
									)}
								{/* Cash On Delivery */}
								{isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
									<MarkAsPaidButton />
								)}
								{isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetailsTable;
