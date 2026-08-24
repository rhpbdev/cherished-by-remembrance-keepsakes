// features/cart/components/delete-cart-item-button.tsx
'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteCartItem } from '@/lib/actions/cart.actions';

const DeleteCartItemButton = ({ productId }: { productId: string }) => {
	const [isDeleting, setIsDeleting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const handleDelete = async () => {
		console.log(productId);
		setIsDeleting(true);

		try {
			const result = await deleteCartItem(productId);

			if (result?.success) {
				toast.success('Product deleted successfully!');
				setIsOpen(false);
			} else {
				toast.error(result?.message || 'Error deleting product.');
				console.error('Delete error:', result?.message);
			}
		} catch (error) {
			toast.error('Could not delete product');
			console.error('Delete error', error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div>
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogTrigger asChild>
					<Button
						variant='link'
						size='sm'
						onClick={(e) => e.stopPropagation()} // Prevent Link navigation
						className='text-destructive'
					>
						<Trash2 className='w-4 h-4' />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent onClick={(e) => e.stopPropagation()}>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to remove this item from your cart?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className='bg-red-600 hover:bg-red-700'
						>
							{isDeleting ? (
								<>
									<Loader2 className='w-4 h-4 mr-2 animate-spin' />
									Deleting...
								</>
							) : (
								'Delete'
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default DeleteCartItemButton;
