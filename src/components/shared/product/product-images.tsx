'use client';

import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProductImagesProps {
	images: string[];
	zoomScale?: number;
}

const ProductImages = ({ images, zoomScale = 2.5 }: ProductImagesProps) => {
	const [current, setCurrent] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);
	const [transformOrigin, setTransformOrigin] = useState('center center');
	const imageRef = useRef<HTMLDivElement>(null);

	const updateTransformOrigin = (clientX: number, clientY: number) => {
		if (!imageRef.current) return;

		const rect = imageRef.current.getBoundingClientRect();
		const x = ((clientX - rect.left) / rect.width) * 100;
		const y = ((clientY - rect.top) / rect.height) * 100;

		setTransformOrigin(`${x}% ${y}%`);
	};

	const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
		updateTransformOrigin(e.clientX, e.clientY);
	};

	const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
		if (e.touches.length === 1) {
			updateTransformOrigin(e.touches[0].clientX, e.touches[0].clientY);
		}
	};

	const handleMouseEnter = () => {
		setIsZoomed(true);
	};

	const handleMouseLeave = () => {
		setIsZoomed(false);
		setTransformOrigin('center center');
	};

	const handleTouchStart = () => {
		setIsZoomed(true);
	};

	const handleTouchEnd = () => {
		setIsZoomed(false);
		setTransformOrigin('center center');
	};

	return (
		<div className='space-y-4'>
			{/* Main Image with Zoom */}
			<div
				ref={imageRef}
				className='relative overflow-hidden w-full cursor-zoom-in bg-gray-50 rounded-lg aspect-square'
				onMouseMove={handleMouseMove}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<div
					className='absolute inset-0 transition-transform duration-500 ease-out'
					style={{
						transform: isZoomed ? `scale(${zoomScale})` : 'scale(1)',
						transformOrigin: transformOrigin,
					}}
				>
					<Image
						src={images[current]}
						alt='product image'
						fill
						className='object-cover object-center pointer-events-none select-none'
						sizes='(max-width: 768px) 100vw, 600px'
						priority
						draggable={false}
					/>
				</div>

				{/* Zoom indicator */}
				{isZoomed && (
					<div className='absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
						{zoomScale}x
					</div>
				)}
			</div>

			{/* Thumbnail Images */}
			<div className='flex gap-2 overflow-x-auto pb-2'>
				{images.map((image, index) => (
					<div
						key={image}
						onClick={() => setCurrent(index)}
						className={cn(
							'border-2 cursor-pointer hover:border-orange-600 transition-colors flex-shrink-0 rounded-md overflow-hidden',
							current === index && 'border-primary'
						)}
					>
						<Image
							src={image}
							alt={`thumbnail ${index + 1}`}
							width={100}
							height={100}
							className='object-cover'
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductImages;
