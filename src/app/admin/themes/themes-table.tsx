// app/admin/themes/theme-table.tsx
'use client';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Pencil, Eye, Copy, LoaderIcon, AlertTriangleIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetAllThemes } from '@/features/themes/api/use-get-all-themes';
import { formatId } from '@/lib/utils';

// Helper to check if theme is "new" (created within last 7 days)
const isNewTheme = (createdAt: string | Date) => {
	const created = new Date(createdAt);
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);
	return created > sevenDaysAgo;
};

// Helper to format date
const formatDate = (date: string | Date) => {
	return new Date(date).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
};

export const ThemesTable = () => {
	const queryClient = useQueryClient();

	const { data, isLoading, isError } = useGetAllThemes({
		limit: '100', // Increased to see more themes
		page: '1',
	});

	const handleDuplicate = async (themeId: string) => {
		try {
			const response = await fetch(`/api/themes/${themeId}/duplicate`, {
				method: 'POST',
			});

			if (!response.ok) {
				throw new Error('Failed to duplicate theme');
			}

			toast.success('Theme duplicated successfully');
			await queryClient.invalidateQueries({ queryKey: ['all-themes'] });
		} catch (error) {
			toast.error('Failed to duplicate theme');
			console.error(error);
		}
	};

	// Group themes by productId for visual separation
	const groupedByProduct = data?.reduce(
		(acc, theme) => {
			const productId = theme.productId || 'no-product';
			if (!acc[productId]) {
				acc[productId] = [];
			}
			acc[productId].push(theme);
			return acc;
		},
		{} as Record<string, typeof data>
	);

	return (
		<div>
			{isLoading && (
				<div className='flex items-center justify-center flex-1 py-8'>
					<LoaderIcon className='size-4 text-muted-foreground animate-spin' />
				</div>
			)}

			{isError && (
				<div className='flex flex-col gap-y-2 items-center justify-center flex-1 py-8'>
					<AlertTriangleIcon className='size-4 text-muted-foreground' />
					<p className='text-muted-foreground text-xs'>
						Failed to fetch themes
					</p>
				</div>
			)}

			{groupedByProduct &&
				Object.entries(groupedByProduct).map(([productId, themes]) => (
					<div key={productId} className='mb-8'>
						{/* Product Header */}
						<div className='bg-muted px-4 py-2 rounded-t-md border border-b-0'>
							<h3 className='font-semibold text-sm'>
								Product: {productId}
								<span className='text-muted-foreground font-normal ml-2'>
									({themes.length} themes)
								</span>
							</h3>
						</div>

						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>NAME</TableHead>
									<TableHead>DISPLAY NAME</TableHead>
									<TableHead>CREATED</TableHead>
									<TableHead>TAGS</TableHead>
									<TableHead className='w-37.5'>ACTIONS</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{themes.map((theme) => (
									<TableRow key={theme.id}>
										<TableCell className='font-mono text-xs'>
											{formatId(theme.id)}
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2'>
												{theme.name}
												{isNewTheme(theme.createdAt) && (
													<Badge
														variant='default'
														className='text-[10px] px-1.5 py-0'
													>
														NEW
													</Badge>
												)}
											</div>
										</TableCell>
										<TableCell>{theme.displayName}</TableCell>
										<TableCell className='text-muted-foreground text-xs'>
											{formatDate(theme.createdAt)}
										</TableCell>
										<TableCell>{theme.tags}</TableCell>
										<TableCell className='flex gap-2'>
											<Button
												asChild
												variant='outline'
												size='sm'
												title='View Theme'
											>
												<Link href={`/admin/themes/${theme.id}`}>
													<Eye className='size-4' />
												</Link>
											</Button>
											<Button
												asChild
												variant='ghost'
												size='sm'
												title='Edit Theme'
											>
												<Link href={`/admin/themes/${theme.id}/edit`}>
													<Pencil className='size-4' />
												</Link>
											</Button>
											<Button
												variant='ghost'
												size='sm'
												title='Duplicate Theme'
												onClick={() => handleDuplicate(theme.id)}
											>
												<Copy className='size-4' />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				))}
		</div>
	);
};
