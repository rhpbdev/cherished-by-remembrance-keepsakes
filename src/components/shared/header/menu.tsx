import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from './user-button';
import { Separator } from '@/components/ui/separator';
// import { ThemeToggle } from './theme-toggle';

const links = [
	{ title: 'Home', href: '/' },
	{
		title: 'Learn More',
		href: '/learn-more',
	},
	{
		title: 'Our Products',
		href: '/products',
	},
	{
		title: 'About',
		href: '/about-us',
	},
	{
		title: 'Contact',
		href: '/contact-us',
	},
	{
		title: 'Dashboard',
		href: '/dashboard',
	},
	{
		title: 'Project Fit Quiz',
		href: '/project-fit-quiz',
	},
];

const Menu = () => {
	return (
		<div className='flex justify-end gap-3'>
			{/* Desktop Navigation */}
			<nav className='hidden xl:flex w-full max-w-lg gap-4 items-center'>
				{/* <Button asChild variant='link'>
					<Link href='/dashboard'>Dashboard</Link>
				</Button> */}
				{/* <ThemeToggle /> */}
				<Button asChild variant='ghost'>
					<Link href='/cart'>
						<ShoppingCart /> Cart
					</Link>
				</Button>
				<UserButton />
			</nav>

			{/* Mobile Navigation */}
			<nav className='xl:hidden'>
				<Sheet>
					<SheetTrigger className='align-middle'>
						<EllipsisVertical />
					</SheetTrigger>
					<SheetContent className='flex flex-col items-start p-4'>
						<SheetTitle className='flex justify-between w-[90%] items-center'>
							Menu
							<UserButton />
						</SheetTitle>
						<Separator className='mb-2' />
						<SheetDescription className='flex flex-col space-y-4'>
							{links.map((item) => {
								return (
									<Link
										key={item.href}
										href={item.href}
										className='text-sm font-medium hover:text-primary/80 transition-colors duration-300'
									>
										{item.title}
									</Link>
								);
							})}
							<Link
								href='cart'
								className='text-sm font-medium hover:text-primary/80 transition-colors duration-300'
							>
								Cart
							</Link>
						</SheetDescription>
					</SheetContent>
				</Sheet>
			</nav>
		</div>
	);
};

export default Menu;
