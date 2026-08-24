import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';
import { SignOutButton } from '@/features/auth/components/sign-out-button';

const UserButton = async () => {
	const session = await auth();

	if (!session) {
		return (
			<div className='flex gap-2'>
				<Button asChild size='lg'>
					<Link href='/sign-in'>
						<UserIcon /> Sign In
					</Link>
				</Button>
				<Button asChild size='lg'>
					<Link href='/sign-up'>
						<UserIcon /> Sign Up
					</Link>
				</Button>
			</div>
		);
	}

	const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';

	return (
		<div className='flex gap-2 items-center'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className='flex items-center'>
						<Button
							variant='ghost'
							className='relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
						>
							{firstInitial}
						</Button>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent className='w-56' align='end' forceMount>
					<DropdownMenuLabel className='font-normal'>
						<div className='flex flex-col space-y-1'>
							<div className='text-sm font-medium leading-none'>
								{session.user?.name}
							</div>
							<div className='text-sm text-muted-foreground leading-none'>
								{session.user?.email}
							</div>
						</div>
					</DropdownMenuLabel>

					<DropdownMenuItem>
						<Link href='/user/profile' className='w-full'>
							User Profile
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link href='/user/orders' className='w-full'>
							Order History
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Link href='/dashboard' className='w-full'>
							Dashboard
						</Link>
					</DropdownMenuItem>

					{session?.user?.role === 'admin' && (
						<DropdownMenuItem>
							<Link href='/admin/overview' className='w-full'>
								Admin
							</Link>
						</DropdownMenuItem>
					)}

					<DropdownMenuItem className='p-0 mb-1'>
						<SignOutButton />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default UserButton;
