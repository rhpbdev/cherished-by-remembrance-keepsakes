// components/shared/product/product-list.tsx
import { Product } from '@/types';
import ProductCard from './product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// const programs: Product = {
//   id: "programs-collection",
//   name: "Programs",
//   slug: "programs",
//   category: "Memorial Products",
//   brand: "CF Memories",
//   description: "Single Page, Multi-page, Booklet, and Trifold Program Options",
//   stock: 999, // Always in stock
//   images: ["/memory-products-booklet-programs.webp"], // Add your image
//   isFeatured: true,
//   banner: null,
//   price: "", // Or starting price like '29.99'
//   rating: "5.0",
//   createdAt: new Date(),
//   panelConfiguration: null,
//   height: "500",
//   width: "500",
//   options: [
//     {
//       name: "Size",
//       values: ["Small", "Medium", "Large"],
//     },
//   ],
// };

const ProductList = ({
  data,
  title,
  limit,
  lgColumns,
  showPrograms,
}: {
  data: Product[];
  title?: string;
  limit?: number;
  lgColumns: string;
  showPrograms: boolean;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  // Map columns to Tailwind classes
  const gridColsClass = {
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  }[lgColumns];

  return (
    <div className="my-10">
      <div className="mb-16 text-center">
        <h2
          className="mx-auto mb-4 max-w-5xl text-5xl text-purple-800 lg:text-6xl"
          style={{ fontFamily: 'var(--font-great-vibes)' }}
        >
          {title}
        </h2>
        <p className="text-md mx-auto max-w-3xl text-gray-600 lg:text-xl">
          Beautiful memorial products to honor and celebrate your loved
          one&apos;s legacy
        </p>
      </div>

      {/* Product Grid */}
      {data.length > 0 ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridColsClass} gap-3 px-4`}
        >
          {/* {showPrograms && <ProductCard product={programs} />} */}
          {limitedData.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-12 text-center">
        <Button
          asChild
          size="lg"
          className="group shadow-lg transition-all hover:shadow-xl"
        >
          <Link href="/products">
            See All of Our Products
            <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
