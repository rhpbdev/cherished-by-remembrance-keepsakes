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
		<div className='wrapper mx-auto px-4 py-12'>
			{/* Hero Section */}
			<section className='mb-20'>
				<div className='grid md:grid-cols-2 gap-8 items-center'>
					<div className='relative h-[400px] rounded-lg overflow-hidden shadow-xl'>
						<Image
							src={product.images[0]}
							alt={product.name}
							fill
							className='object-cover'
							priority
						/>
					</div>
					<div>
						<h1 className='text-4xl lg:text-5xl font-bold text-primary mb-4'>
							{product.name}
						</h1>
						<p className='text-lg text-muted-foreground mb-6'>
							{product.description}
						</p>
						<Button asChild size='lg'>
							<Link href={`/products/${product.slug}`}>
								View Product Details
								<ArrowRight className='ml-2 w-4 h-4' />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Product Details Section */}
			<section className='mb-20'>
				<div className='bg-white rounded-lg shadow-lg p-8'>
					<h2 className='text-3xl font-bold text-primary mb-6'>
						About {product.name}
					</h2>
					<p className='text-muted-foreground leading-relaxed text-lg'>
						{product.description}
					</p>
					{/* Add more product-specific content here */}
				</div>
			</section>

			{/* CTA Section */}
			<section className='text-center'>
				<h2 className='text-3xl font-bold text-primary mb-6'>
					Ready to Get Started?
				</h2>
				<Button asChild size='lg' className='shadow-lg'>
					<Link href={`/products/${product.slug}`}>
						Start Your Memorial Project
						<ArrowRight className='ml-2 w-4 h-4' />
					</Link>
				</Button>
			</section>
		</div>
	);
};

export default LearnMoreDetailsPage;
