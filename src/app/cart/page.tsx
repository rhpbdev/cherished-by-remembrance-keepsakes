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
    <div className="wrapper">
      <Link
        href={'/dashboard'}
        className="flex items-center text-xs font-medium text-primary"
      >
        <ArrowLeftIcon className="mr-1 size-3" />
        Back to Dashboard
      </Link>
      <CartTableComponent cart={cart} />
      <RecommendedProducts />
    </div>
  );
};

export default CartPage;
