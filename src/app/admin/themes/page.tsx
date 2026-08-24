import { requireAdmin } from '@/features/auth/auth-guard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemesTable } from './themes-table';

const AdminThemesPage = async (props: {
	searchParams: Promise<{
		page: number;
		query: string;
		category: string;
	}>;
}) => {
	await requireAdmin();

	return (
		<div className='space-y-2'>
			<div className='flex-between'>
				<div className='flex items-center gap-3'>
					<h1 className='h2-bold'>Themes</h1>
				</div>
				<Button asChild variant='default'>
					<Link href='/admin/themes/create'>Create Theme</Link>
				</Button>
			</div>
			<ThemesTable />
		</div>
	);
};

export default AdminThemesPage;
