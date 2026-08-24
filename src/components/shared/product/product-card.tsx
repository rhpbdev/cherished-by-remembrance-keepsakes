// components/shared/product/product-card.tsx
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
// import Rating from './rating';
import { ArrowRight } from 'lucide-react';

const ProductCard = ({ product }: { product: Product }) => {
	return (
		<Card className='w-full max-w-sm pt-0 group block overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full'>
			<CardHeader className='items-center justify-center p-0'>
				<Link
					href={
						product.id === 'programs-collection'
							? `/learn-more/${product.slug}`
							: `/products/${product.slug}`
					}
				>
					<div className='relative overflow-hidden'>
						<Image
							src={product.images[0]}
							alt={product.name}
							height={300}
							width={300}
							priority={true}
							className='object-cover group-hover:scale-105 transition-transform duration-300 overflow-hidden'
						/>
						<div className='absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/20 transition-colors duration-300' />
					</div>
				</Link>
			</CardHeader>
			<CardContent className='p-4 grid gap-4'>
				<div>
					<div className='text-xs'>{product.brand}</div>
					<Link
						href={
							product.id === 'programs-collection'
								? `/learn-more/${product.slug}`
								: `/products/${product.slug}`
						}
					>
						<h3 className='text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors'>
							{product.name}
						</h3>
					</Link>
				</div>
			</CardContent>
			<CardFooter className='flex items-center text-purple-600 font-medium'>
				<Link
					href={
						product.id === 'programs-collection'
							? `/learn-more/${product.slug}`
							: `/products/${product.slug}`
					}
					className='group-hover:mr-2 transition-all'
				>
					Order Now
				</Link>
				<ArrowRight className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-all' />
			</CardFooter>
		</Card>
	);
};

export default ProductCard;
