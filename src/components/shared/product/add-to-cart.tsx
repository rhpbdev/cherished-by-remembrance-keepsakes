'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { Cart, type CartItem } from '@/types';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();

	// Handle add to cart
	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addItemToCart(item);

			// Handle add to cart error
			if (!res.success) {
				toast.error(res.message);
				return;
			}

			// Hanlde add to cart success
			toast(res.message, {
				action: {
					label: 'Go to Cart',
					onClick: () => router.push('/cart'),
				},
			});
		});
	};

	// Handle remove from cart
	const handleRemoveFromCart = async () => {
		startTransition(async () => {
			const res = await removeItemFromCart(item.productId);

			// Handle remove from cart error
			if (!res.success) {
				toast.error(res.message);
				return;
			}

			// Hanlde remove from cart success
			toast(res.message);

			return;
		});
	};

	// Check if item is in cart
	const existItem =
		cart && cart.items.find((x) => x.productId === item.productId);

	return existItem ? (
		<div className='flex items-center gap-2'>
			<Button
				type='button'
				variant='outline'
				className='rounded-md'
				onClick={handleRemoveFromCart}
				disabled={isPending}
			>
				{isPending ? (
					<Loader className='w-4 h-4 animate-spin' />
				) : (
					<Minus className='w-4 h-4' />
				)}
			</Button>
			<span className='px-2'>{existItem.qty}</span>
			<Button
				type='button'
				variant='outline'
				className='rounded-md'
				onClick={handleAddToCart}
				disabled={isPending}
			>
				{isPending ? (
					<Loader className='w-4 h-4 animate-spin' />
				) : (
					<Plus className='w-4 h-4' />
				)}
			</Button>
		</div>
	) : (
		<Button
			className='w-full'
			type='button'
			onClick={handleAddToCart}
			disabled={isPending}
		>
			{isPending ? (
				<Loader className='w-4 h-4 animate-spin' />
			) : (
				<Plus className='w-4 h-4' />
			)}{' '}
			Add to Cart
		</Button>
	);
};

export default AddToCart;
