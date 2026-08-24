interface ComingSoonProps {
	title: string;
}

const ComingSoon = ({ title }: ComingSoonProps) => {
	return (
		<div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
			<h1 className='mb-4 text-4xl font-bold'>{title}</h1>
			<div className='mb-6 text-6xl'>🚧</div>
			<p className='mb-2 text-xl text-muted-foreground'>Coming Soon</p>
			<p className='max-w-md text-muted-foreground'>
				We&apos;re working hard to bring you this page. Please check back later!
			</p>
		</div>
	);
};

export default ComingSoon;
