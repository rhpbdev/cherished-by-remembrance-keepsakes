'use server';
import { auth } from '@/auth';
import { db } from '@/drizzle/db';
import { DesignTable } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { formatError } from '../utils';
import { PanelSpec } from '@/types';
import { cookies } from 'next/headers';

// Save a single design
export async function saveDesign({
	designId,
	saveData,
	imagePreview,
	printFiles,
}: {
	designId: string;
	saveData: PanelSpec[];
	imagePreview?: string | null;
	printFiles?: string[];
}) {
	try {
		// Check for design cookie
		const sessionDesignId = (await cookies()).get('sessionDesignId')?.value;
		if (!sessionDesignId) throw new Error('Design session not found');

		// Get session and user ID
		const session = await auth();
		const userId = session?.user?.id ? (session.user.id as string) : undefined;

		// Verify the design exists and belongs to the user or session
		const design = await db.query.DesignTable.findFirst({
			where: userId
				? and(eq(DesignTable.userId, userId), eq(DesignTable.id, designId))
				: and(
						eq(DesignTable.sessionDesignId, sessionDesignId),
						eq(DesignTable.id, designId)
					),
		});

		if (!design) {
			return {
				success: false,
				message: 'Design not found or user not authorized',
			};
		}

		// Update the design with new jsonData and print files
		if (userId) {
			await db
				.update(DesignTable)
				.set({
					jsonData: saveData,
					updatedAt: new Date(),
					imagePreview: imagePreview,
					designFiles: printFiles ? { printFiles } : design.designFiles,
				})
				.where(
					and(eq(DesignTable.id, designId), eq(DesignTable.userId, userId))
				);
		} else {
			await db
				.update(DesignTable)
				.set({
					jsonData: saveData,
					updatedAt: new Date(),
					imagePreview: imagePreview,
					designFiles: printFiles ? { printFiles } : design.designFiles,
				})
				.where(
					and(
						eq(DesignTable.id, designId),
						eq(DesignTable.sessionDesignId, sessionDesignId)
					)
				);
		}

		// Revalidate paths
		revalidatePath(`/canvas/${designId}`);
		revalidatePath('/dashboard');

		return {
			success: true,
			message: 'Design saved successfully',
		};
	} catch (error) {
		console.error('Error saving design:', error);
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to save design',
		};
	}
}

// Get approval status
export async function getApprovalStatus({ designId }: { designId: string }) {
	try {
		// Verify user authentication
		const session = await auth();
		const userId = session?.user?.id;
		if (!userId) {
			return {
				success: false,
				message: 'User not authenticated',
				isApproved: false,
			};
		}

		const design = await db.query.DesignTable.findFirst({
			where: and(eq(DesignTable.userId, userId), eq(DesignTable.id, designId)),
			columns: {
				isApproved: true,
				approvedAt: true,
			},
		});

		if (!design) {
			return {
				success: false,
				message: 'Design not found',
				isApproved: false,
			};
		}

		return {
			success: true,
			isApproved: design.isApproved || false,
			approvedAt: design.approvedAt,
		};
	} catch (error) {
		console.error('Error getting approval status:', error);
		return {
			success: false,
			message: formatError(error),
			isApproved: false,
		};
	}
}

// Toggle approval status
export async function toggleApprovalStatus({ designId }: { designId: string }) {
	try {
		// Verify user authentication
		const session = await auth();
		const userId = session?.user?.id;
		if (!userId) {
			return {
				success: false,
				message: 'User not authenticated',
			};
		}

		// Get current status
		const design = await db.query.DesignTable.findFirst({
			where: and(eq(DesignTable.userId, userId), eq(DesignTable.id, designId)),
			columns: {
				isApproved: true,
			},
		});

		if (!design) {
			return {
				success: false,
				message: 'Design not found',
			};
		}

		// Toggle the approval status
		const newApprovalStatus = !design.isApproved;

		await db
			.update(DesignTable)
			.set({
				isApproved: newApprovalStatus,
				approvedAt: newApprovalStatus ? new Date() : null,
				updatedAt: new Date(),
			})
			.where(and(eq(DesignTable.id, designId), eq(DesignTable.userId, userId)));

		// Revalidate paths
		revalidatePath(`/canvas/${designId}`);
		revalidatePath('/dashboard');

		return {
			success: true,
			message: newApprovalStatus ? 'Design approved' : 'Approval removed',
			isApproved: newApprovalStatus,
		};
	} catch (error) {
		console.error('Error toggling approval status:', error);
		return {
			success: false,
			message: formatError(error),
		};
	}
}
