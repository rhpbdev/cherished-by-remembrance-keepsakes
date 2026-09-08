// app/(root)/learn-more/[slug]/page.tsx
import { getProductBySlug } from '@/lib/actions/product.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }

  return {
    title: `${product.name} | CF Memories`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images:
        product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

const LearnMoreDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="wrapper mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-20">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="relative h-[400px] overflow-hidden rounded-lg shadow-xl">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="mb-4 text-4xl font-bold text-primary lg:text-5xl">
              {product.name}
            </h1>
            <p className="mb-6 text-lg text-muted-foreground">
              {product.description}
            </p>
            <Button asChild size="lg">
              <Link href={`/products/${product.slug}`}>
                View Product Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="mb-20">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-primary">
            About {product.name}
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          {/* Add more product-specific content here */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="mb-6 text-3xl font-bold text-primary">
          Ready to Get Started?
        </h2>
        <Button asChild size="lg" className="shadow-lg">
          <Link href={`/products/${product.slug}`}>
            Start Your Memorial Project
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default LearnMoreDetailsPage;
