'use client';

import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCarousel = ({ data }: { data: Product[] }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(
		{
			loop: true,
			align: 'start',
		},
		[
			AutoScroll({
				playOnInit: true,
				speed: 3, // Continuous scroll speed
				stopOnInteraction: false, // Keep scrolling after interaction
				stopOnMouseEnter: true, // Pause on hover
			}),
		]
	);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	return (
		<div className='relative w-full mb-12'>
			<div className='overflow-hidden' ref={emblaRef}>
				<div className='flex gap-6'>
					{data.map((product: Product) => (
						<div key={product.id} className='flex-[0_0_100%] min-w-0 relative'>
							<Link href={`/products/${product.slug}`}>
								<div className='relative mx-auto'>
									<Image
										src={product.banner!}
										alt={product.name}
										height='0'
										width='0'
										sizes='100vw'
										className='w-full h-auto'
									/>
									<div className='absolute inset-0 flex items-end justify-center'>
										<h2 className='bg-gray-800 bg-opacity-75 text-2xl font-bold px-2 text-white'>
											{product.name}
										</h2>
									</div>
								</div>
							</Link>
						</div>
					))}
				</div>
			</div>

			{/* Navigation Buttons */}
			<button
				className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors'
				onClick={scrollPrev}
				aria-label='Previous slide'
			>
				<ChevronLeft className='w-6 h-6' />
			</button>
			<button
				className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors'
				onClick={scrollNext}
				aria-label='Next slide'
			>
				<ChevronRight className='w-6 h-6' />
			</button>
		</div>
	);
};

export default ProductCarousel;
