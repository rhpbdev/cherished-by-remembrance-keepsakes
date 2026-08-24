import Link from 'next/link';
import Menu from './menu';
import { Button } from '@/components/ui/button';
import HomeMainNav from './home-main-nav';
import Logo from './logo';

const Header = () => {
	return (
		<header className='w-full border-b'>
			<div className='flex-between px-6 py-4'>
				<div className='flex-start gap-6'>
					{/* Category Drawer Component */}
					{/* <CategoryDrawer /> */}
					<Logo />
					<Button asChild size='lg'>
						<Link href='/our-products'>Start Now</Link>
					</Button>
					<HomeMainNav className='hidden xl:flex' />
				</div>
				{/* Search Component */}
				{/* <div className='hidden md:block'>
					<Search />
				</div> */}
				<Menu />
			</div>
		</header>
	);
};

export default Header;
