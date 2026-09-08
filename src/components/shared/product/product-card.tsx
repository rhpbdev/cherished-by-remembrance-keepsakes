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
    <Card className="group block h-full w-full max-w-sm transform overflow-hidden pt-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <CardHeader className="items-center justify-center p-0">
        <Link
          href={
            product.id === 'programs-collection'
              ? `/learn-more/${product.slug}`
              : `/products/${product.slug}`
          }
        >
          <div className="relative overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              height={300}
              width={300}
              priority={true}
              className="overflow-hidden object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-purple-900/0 transition-colors duration-300 group-hover:bg-purple-900/20" />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 p-4">
        <div>
          <div className="text-xs">{product.brand}</div>
          <Link
            href={
              product.id === 'programs-collection'
                ? `/learn-more/${product.slug}`
                : `/products/${product.slug}`
            }
          >
            <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-purple-700">
              {product.name}
            </h3>
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex items-center font-medium text-purple-600">
        <Link
          href={
            product.id === 'programs-collection'
              ? `/learn-more/${product.slug}`
              : `/products/${product.slug}`
          }
          className="transition-all group-hover:mr-2"
        >
          Order Now
        </Link>
        <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100" />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
