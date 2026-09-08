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
    ],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative mb-12 w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {data.map((product: Product) => (
            <div key={product.id} className="relative min-w-0 flex-[0_0_100%]">
              <Link href={`/products/${product.slug}`}>
                <div className="relative mx-auto">
                  <Image
                    src={product.banner!}
                    alt={product.name}
                    height="0"
                    width="0"
                    sizes="100vw"
                    className="h-auto w-full"
                  />
                  <div className="absolute inset-0 flex items-end justify-center">
                    <h2 className="bg-opacity-75 bg-gray-800 px-2 text-2xl font-bold text-white">
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
        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white"
        onClick={scrollPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-colors hover:bg-white"
        onClick={scrollNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ProductCarousel;
