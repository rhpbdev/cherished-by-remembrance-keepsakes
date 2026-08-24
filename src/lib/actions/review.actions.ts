'use server';

import { z } from 'zod';
import { insertReviewSchema } from '../validators';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { ReviewTable, ProductTable, UserTable } from '@/drizzle/schema';
import { and, eq, avg, count, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/drizzle/db';

// Create & Update Reviews
export async function createUpdateReview(
	data: z.infer<typeof insertReviewSchema>
) {
	try {
		// Authenticate user first
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error('User is not authenticated');
		}

		// Validate and sanitize input data
		const review = insertReviewSchema.parse({
			...data,
			userId: session.user.id, // Always use server-side session for userId
		});

		// Verify product exists
		const [product] = await db
			.select()
			.from(ProductTable)
			.where(eq(ProductTable.id, review.productId))
			.limit(1);

		if (!product) {
			throw new Error('Product not found');
		}

		// Check for existing review
		const [existingReview] = await db
			.select()
			.from(ReviewTable)
			.where(
				and(
					eq(ReviewTable.productId, review.productId),
					eq(ReviewTable.userId, review.userId)
				)
			)
			.limit(1);

		// Use transaction for data consistency
		await db.transaction(async (tx) => {
			if (existingReview) {
				// Update existing review
				await tx
					.update(ReviewTable)
					.set({
						title: review.title,
						description: review.description,
						rating: review.rating,
					})
					.where(eq(ReviewTable.id, existingReview.id));
			} else {
				// Create new review
				await tx.insert(ReviewTable).values({
					...review,
					isVerifiedPurchase: true, // You might want to check actual purchase history
				});
			}

			// Calculate new average rating and count
			const [stats] = await tx
				.select({
					avgRating: avg(ReviewTable.rating),
					numReviews: count(),
				})
				.from(ReviewTable)
				.where(eq(ReviewTable.productId, review.productId));

			// Update product statistics
			await tx
				.update(ProductTable)
				.set({
					rating: stats.avgRating ? String(stats.avgRating) : '0',
					numReviews: stats.numReviews,
				})
				.where(eq(ProductTable.id, review.productId));
		});

		// Revalidate the product page
		revalidatePath(`/products/${product.slug}`);

		return {
			success: true,
			message: existingReview
				? 'Review updated successfully'
				: 'Review created successfully',
		};
	} catch (error) {
		console.error('Review operation failed:', error);
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Get all reviews for a product with user info
export async function getReviews({ productId }: { productId: string }) {
	try {
		// Validate productId format (assuming UUID)
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(productId)) {
			throw new Error('Invalid product ID format');
		}

		const reviews = await db
			.select({
				id: ReviewTable.id,
				title: ReviewTable.title,
				description: ReviewTable.description,
				rating: ReviewTable.rating,
				isVerifiedPurchase: ReviewTable.isVerifiedPurchase,
				createdAt: ReviewTable.createdAt,
				userId: ReviewTable.userId,
				productId: ReviewTable.productId,
				userName: UserTable.name,
			})
			.from(ReviewTable)
			.leftJoin(UserTable, eq(ReviewTable.userId, UserTable.id))
			.where(eq(ReviewTable.productId, productId))
			.orderBy(desc(ReviewTable.createdAt));

		// Transform the data to match expected format
		const data = reviews.map((review) => ({
			id: review.id,
			title: review.title,
			description: review.description,
			rating: review.rating,
			isVerifiedPurchase: review.isVerifiedPurchase,
			createdAt: review.createdAt,
			userId: review.userId,
			productId: review.productId,
			user: review.userName ? { name: review.userName } : undefined,
		}));

		return { data };
	} catch (error) {
		console.error('Failed to fetch reviews:', error);
		return { data: [] };
	}
}

// Get all reviews for a product
export async function getReviewByProductId({
	productId,
}: {
	productId: string;
}) {
	try {
		// Authenticate user
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error('User is not authenticated');
		}

		// Validate productId format
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		if (!uuidRegex.test(productId)) {
			throw new Error('Invalid product ID format');
		}

		const [review] = await db
			.select()
			.from(ReviewTable)
			.where(
				and(
					eq(ReviewTable.productId, productId),
					eq(ReviewTable.userId, session.user.id)
				)
			)
			.limit(1);

		return review || null;
	} catch (error) {
		console.error('Failed to fetch user review:', error);
		return null;
	}
}

// Optional: Add a function to verify if a purchase was made
// export async function verifyPurchase(
// 	userId: string,
// 	productId: string
// ): Promise<boolean> {
// 	// This would check your OrderTable and OrderItemTable
// 	// Implementation depends on your order schema
// 	// For now, returning true as placeholder
// 	return true;
// }

// Optional: Add rate limiting helper
// const reviewRateLimiter = new Map<string, number>();

// function checkRateLimit(userId: string): boolean {
// 	const now = Date.now();
// 	const lastReview = reviewRateLimiter.get(userId);

// 	// Allow one review per minute per user
// 	if (lastReview && now - lastReview < 60000) {
// 		return false;
// 	}

// 	reviewRateLimiter.set(userId, now);
// 	return true;
// }
