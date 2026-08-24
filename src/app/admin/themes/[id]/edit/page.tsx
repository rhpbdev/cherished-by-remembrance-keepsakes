import { Metadata } from 'next';
import { requireAdmin } from '@/features/auth/auth-guard';
import { notFound } from 'next/navigation';
import { db } from '@/drizzle/db';
import { ThemeTable } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { ThemeEditForm } from './theme-edit-form';

export const metadata: Metadata = {
	title: 'Edit Theme',
};

const AdminThemeEditPage = async (props: {
	params: Promise<{
		id: string;
	}>;
}) => {
	await requireAdmin();

	const { id } = await props.params;

	const themes = await db
		.select()
		.from(ThemeTable)
		.where(eq(ThemeTable.id, id))
		.limit(1);

	if (themes.length === 0) return notFound();

	const theme = themes[0];

	return (
		<div className='space-y-8 max-w-5xl mx-auto p-6'>
			<h1 className='h2-bold'>Edit Theme</h1>
			<ThemeEditForm theme={theme} />
		</div>
	);
};

export default AdminThemeEditPage;
