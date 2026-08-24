'use server';

import {
	shippingAddressSchema,
	signInFormSchema,
	signUpFormSchema,
	paymentMethodSchema,
	updateUserSchema,
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { db } from '@/drizzle/db';
import { UserTable } from '@/drizzle/schema';
import { formatError } from '../utils';
import { asc, count, desc, eq, ilike } from 'drizzle-orm';
import { type ShippingAddress } from '@/types';
import z from 'zod';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../features/auth/auth-guard';

// Sign in the user with credentials
export async function signInWithCredentials(
	prevState: unknown,
	formData: FormData,
) {
	try {
		const user = signInFormSchema.parse({
			email: formData.get('email'),
			password: formData.get('password'),
		});

		const callbackUrl = (formData.get('callbackUrl') as string) || '/';
		await signIn('credentials', { ...user, redirectTo: callbackUrl });

		return { success: true, message: 'Signed in successfully' };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}

		return { success: false, message: 'Invalid email or password' };
	}
}

// Sign user out
export async function signOutUser() {
	await signOut({ redirect: true, redirectTo: '/' });
}

// Sign up a new user
export async function signUpUser(prevState: unknown, formData: FormData) {
	try {
		const user = signUpFormSchema.parse({
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword'),
		});

		const callbackUrl = (formData.get('callbackUrl') as string) || '/';
		const plainPassword = user.password;
		user.password = hashSync(user.password, 10);

		await db.insert(UserTable).values({
			name: user.name,
			email: user.email,
			password: user.password,
		});

		await signIn('credentials', {
			email: user.email,
			password: plainPassword,
			redirectTo: callbackUrl,
		});

		return { success: true, message: 'User registered successfully' };
	} catch (error) {
		// console.log(error);
		// console.log(error.name);
		// console.log(error.cause.name);
		// console.log(error.cause.code);

		if (isRedirectError(error)) {
			throw error;
		}

		return { success: false, message: formatError(error) };
	}
}

// Get user by the ID
export async function getUserById(userId: string) {
	const user = await db.query.UserTable.findFirst({
		where: eq(UserTable.id, userId),
	});
	if (!user) throw new Error('User not found');

	return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
	try {
		const session = await auth();
		// if (!session) throw new Error('No session found');

		const currentUser = await db.query.UserTable.findFirst({
			where: eq(UserTable.id, session?.user?.id as string),
		});

		if (!currentUser) throw new Error('User not found');

		const address = shippingAddressSchema.parse(data);

		await db
			.update(UserTable)
			.set({
				address: address,
			})
			.where(eq(UserTable.id, currentUser.id));

		return {
			success: true,
			message: 'User updated successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update user's payment method
export async function updateUserPaymentMethod(
	data: z.infer<typeof paymentMethodSchema>,
) {
	try {
		const session = await auth();
		const currentUser = await db.query.UserTable.findFirst({
			where: eq(UserTable.id, session?.user?.id as string),
		});

		if (!currentUser) throw new Error('User not found');

		const paymentMethod = paymentMethodSchema.parse(data);

		await db
			.update(UserTable)
			.set({
				paymentMethod: paymentMethod.type,
			})
			.where(eq(UserTable.id, currentUser.id));

		return {
			success: true,
			message: 'User payment method updated successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update the user profile
export async function updateProfile(user: { name: string; email: string }) {
	try {
		const session = await auth();
		const currentUser = await db.query.UserTable.findFirst({
			where: eq(UserTable.id, session?.user?.id as string),
		});

		if (!currentUser) throw new Error('User not found');

		await db
			.update(UserTable)
			.set({
				name: user.name,
			})
			.where(eq(UserTable.id, currentUser.id));

		return {
			success: true,
			message: 'User updated successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Get all the users
export async function getAllUsers({
	limit = PAGE_SIZE,
	page,
	query,
}: {
	limit?: number;
	page: number;
	query: string;
}) {
	await requireAdmin();

	const whereClause =
		query && query !== 'all' ? ilike(UserTable.name, `%${query}%`) : undefined;

	const data = await db.query.UserTable.findMany({
		columns: {
			id: true,
			name: true,
			email: true,
			emailVerified: true,
			image: true,
			role: true,
			address: false,
			createdAt: true,
			updatedAt: true,
			password: false,
			paymentMethod: false,
		},
		orderBy: [asc(UserTable.role), desc(UserTable.createdAt)],
		limit,
		offset: (page - 1) * limit,
		where: whereClause,
	});

	const [{ dataCount }] = await db
		.select({ dataCount: count() })
		.from(UserTable)
		.where(whereClause);

	return {
		data,
		totalPages: Math.ceil(dataCount / limit),
	};
}

// Delete a user
export async function deleteUser(id: string) {
	try {
		await requireAdmin();

		await db.delete(UserTable).where(eq(UserTable.id, id));

		revalidatePath('/admin/users');

		return {
			success: true,
			message: 'User deleted successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
	try {
		await requireAdmin();

		await db
			.update(UserTable)
			.set({
				name: user.name,
				role: user.role,
			})
			.where(eq(UserTable.id, user.id));

		revalidatePath('/admin/users');

		return {
			success: true,
			message: 'User updated successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
