import { Metadata } from 'next';
import CartTableComponent from './cart-table';
import { getMyCart } from '@/lib/actions/cart.actions';
import RecommendedProducts from '@/features/products/components/recommended-products';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

export const metadata: Metadata = {
	title: 'Shopping Cart',
};

const CartPage = async () => {
	const cart = await getMyCart();

	return (
		<div className='wrapper'>
			<Link
				href={'/dashboard'}
				className='text-xs text-primary font-medium flex items-center'
			>
				<ArrowLeftIcon className='size-3 mr-1' />
				Back to Dashboard
			</Link>
			<CartTableComponent cart={cart} />
			<RecommendedProducts />
		</div>
	);
};

export default CartPage;
