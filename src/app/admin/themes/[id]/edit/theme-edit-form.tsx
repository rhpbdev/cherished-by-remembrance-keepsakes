'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

const formSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	displayName: z.string().min(1, 'Display name is required'),
	productId: z.string().min(1, 'Product ID is required'),
	imagePreview: z.string().optional(),
	isActive: z.boolean(),
	pages: z
		.array(
			z.object({
				pageNumber: z.number(),
				label: z.string(),
				backgroundImageUrl: z.string(),
			})
		)
		.optional(),
});

interface ThemeEditFormProps {
	theme: {
		id: string;
		name: string;
		displayName: string | null;
		productId: string;
		imagePreview: string | null;
		isActive: boolean;
		jsonData?: any;
	};
}

export const ThemeEditForm = ({ theme }: ThemeEditFormProps) => {
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();
	const [pages, setPages] = useState<
		Array<{
			pageNumber: number;
			label: string;
			backgroundImageUrl: string;
		}>
	>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: theme.name || '',
			displayName: theme.displayName || '',
			productId: theme.productId || '',
			imagePreview: theme.imagePreview || '',
			isActive: theme.isActive,
			pages: [],
		},
	});

	// Extract pages and background URLs from jsonData
	useEffect(() => {
		if (theme.jsonData && typeof theme.jsonData === 'object') {
			const jsonData = theme.jsonData as { pages?: any[] };
			if (jsonData.pages && Array.isArray(jsonData.pages)) {
				const extractedPages = jsonData.pages.map((page: any) => {
					// Find the clip object which contains the background
					const clipObject = page.objects?.find(
						(obj: any) => obj.name === 'clip'
					);
					const backgroundUrl = clipObject?.fill?.source || '';
					return {
						pageNumber: page.pageNumber || 0,
						label: page.label || `Page ${page.pageNumber}`,
						backgroundImageUrl: backgroundUrl,
					};
				});
				setPages(extractedPages);
				form.setValue('pages', extractedPages);
			}
		}
	}, [theme, form]);

	const handlePageUrlChange = (pageNumber: number, url: string) => {
		const updatedPages = pages.map((page) =>
			page.pageNumber === pageNumber
				? { ...page, backgroundImageUrl: url }
				: page
		);
		setPages(updatedPages);
		form.setValue('pages', updatedPages);
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsPending(true);
		try {
			// Update jsonData with new background URLs if theme exists
			let updatedJsonData = theme.jsonData;
			if (theme.jsonData && values.pages && Array.isArray(values.pages)) {
				const jsonData = theme.jsonData as { pages?: any[] };
				if (jsonData.pages) {
					updatedJsonData = {
						...jsonData,
						pages: jsonData.pages.map((page: any) => {
							const pageUpdate = values.pages?.find(
								(p) => p.pageNumber === page.pageNumber
							);
							if (pageUpdate?.backgroundImageUrl) {
								return {
									...page,
									objects: page.objects?.map((obj: any) => {
										if (obj.name === 'clip' && obj.fill) {
											return {
												...obj,
												fill: {
													...obj.fill,
													source: pageUpdate.backgroundImageUrl,
												},
											};
										}
										return obj;
									}),
								};
							}
							return page;
						}),
					};
				}
			}

			const payload = {
				name: values.name,
				displayName: values.displayName,
				productId: values.productId,
				imagePreview: values.imagePreview || null,
				isActive: values.isActive,
				jsonData: updatedJsonData ? JSON.stringify(updatedJsonData) : null,
			};

			const response = await fetch(`/api/themes/${theme.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to update theme');
			}

			toast.success('Theme updated successfully');
			router.push('/admin/themes');
			router.refresh();
		} catch (error) {
			console.error('Error submitting form:', error);
			toast.error(
				error instanceof Error ? error.message : 'Failed to update theme'
			);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Theme Details</CardTitle>
				<CardDescription>
					Update theme information and page backgrounds
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						{/* Name */}
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='Enter theme name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Display Name */}
						<FormField
							control={form.control}
							name='displayName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Display Name</FormLabel>
									<FormControl>
										<Input placeholder='Enter display name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Product ID */}
						<FormField
							control={form.control}
							name='productId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product ID</FormLabel>
									<FormControl>
										<Input placeholder='Enter product ID' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Image Preview URL */}
						<FormField
							control={form.control}
							name='imagePreview'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image Preview URL</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter preview image URL'
											{...field}
											value={field.value || ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Is Active */}
						<FormField
							control={form.control}
							name='isActive'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Active</FormLabel>
										<FormDescription>
											Make this theme available for use
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						{/* Page Background URLs */}
						{pages.length > 0 && (
							<div className='space-y-4 pt-4 border-t'>
								<div>
									<h3 className='text-lg font-semibold mb-2'>
										Page Backgrounds
									</h3>
									<p className='text-sm text-muted-foreground mb-4'>
										Update the background image URL for each page. These URLs
										will be used as the background source for the clip object on
										each page.
									</p>
								</div>
								<div className='grid gap-4'>
									{pages.map((page) => (
										<div
											key={page.pageNumber}
											className='space-y-2 p-4 border rounded-lg'
										>
											<label className='text-sm font-medium'>
												{page.label} (Page {page.pageNumber})
											</label>
											<Input
												value={page.backgroundImageUrl}
												onChange={(e) =>
													handlePageUrlChange(page.pageNumber, e.target.value)
												}
												placeholder='Enter background image URL'
												disabled={isPending}
											/>
										</div>
									))}
								</div>
							</div>
						)}

						<div className='flex gap-4'>
							<Button type='submit' disabled={isPending}>
								{isPending ? 'Updating...' : 'Update Theme'}
							</Button>
							<Button
								type='button'
								variant='outline'
								onClick={() => router.push('/admin/themes')}
								disabled={isPending}
							>
								Cancel
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
