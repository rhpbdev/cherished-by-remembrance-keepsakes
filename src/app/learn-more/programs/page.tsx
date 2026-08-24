// app/(root)/learn-more/programs/page.tsx
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Funeral and Memorial Service Programs | CF Memories',
	description:
		'Learn about our funeral and memorial service program options including booklet and trifold programs in various sizes.',
};

const LearnMoreProgramsPage = () => {
	return (
		<div className='wrapper mx-auto px-4 py-12'>
			{/* Hero Section */}
			<section className='mb-20'>
				<div className='grid md:grid-cols-2 gap-8 items-center'>
					<div className='relative h-[400px] rounded-lg overflow-hidden shadow-xl'>
						<Image
							src='/images/programs-hero.jpg' // Add your image
							alt='Funeral and Memorial Service Programs'
							fill
							className='object-cover'
							priority
						/>
					</div>
					<div>
						<h1 className='text-4xl lg:text-5xl font-bold text-primary mb-4'>
							Funeral and Memorial Service Programs
						</h1>
						<p className='text-lg text-muted-foreground'>
							Honor your loved one with beautifully designed programs that serve
							as both a guide for the service and a cherished keepsake for
							family and friends.
						</p>
					</div>
				</div>
			</section>

			{/* Section 2: What is a Program? */}
			<section className='mb-20'>
				<h2 className='text-3xl font-bold text-center text-primary mb-12'>
					What is a Funeral & Memorial Service Program?
				</h2>
				<div className='grid md:grid-cols-2 gap-12 items-center'>
					<div className='relative h-[350px] rounded-lg overflow-hidden shadow-lg'>
						<Image
							src='/images/reading-program.jpg' // Add your image
							alt='Person reading funeral program'
							fill
							className='object-cover'
						/>
					</div>
					<div className='space-y-6'>
						<div>
							<h3 className='h3-bold mb-3'>Funeral Programs</h3>
							<p className='text-muted-foreground leading-relaxed'>
								Funeral Programs feature a combination of service details (date,
								location, pallbearers, etc.), obituary, order of service
								(program), poem tributes, personal written tributes, and
								photographs arranged to both inform funeral guests and serve as
								a permanent keepsake honoring the life of your loved one.{' '}
								<Link
									href='#program-options'
									className='text-primary/80 hover:underline'
								>
									Learn more about different programs and folds below.
								</Link>
							</p>
						</div>
						<div>
							<h3 className='h3-bold mb-3'>Memorial Service Programs</h3>
							<p className='text-muted-foreground leading-relaxed'>
								Memorial Service Programs, just like Funeral Programs, feature
								the service details, obituary, tributes and poems. Some may
								include order of service (program) information, but for grave
								side services and cremation ceremonies it may not be needed.{' '}
								<Link
									href='#program-options'
									className='text-primary/80 hover:underline'
								>
									Learn more about different programs and folds below.
								</Link>
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Section 3: Program Options */}
			<section id='program-options' className='mb-20 scroll-mt-20'>
				<h2 className='text-3xl font-bold text-center text-primary mb-12'>
					Program Options
				</h2>
				<div className='space-y-12'>
					{/* Booklet Programs */}
					<div className='bg-white rounded-lg shadow-lg p-8'>
						<div className='grid md:grid-cols-2 gap-8 items-center'>
							<div className='relative h-[300px] rounded-lg overflow-hidden'>
								<Image
									src='/images/booklet-programs.jpg' // Add your image
									alt='Booklet Programs'
									fill
									className='object-cover'
								/>
							</div>
							<div>
								<h3 className='h3-bold mb-4'>Booklet Programs</h3>
								<p className='text-muted-foreground leading-relaxed mb-4'>
									Booklet programs are available in 2 sizes (large and medium)
									and as single folded sheet of paper or multi-sheet, folded and
									stapled options. Take our Project Fit Quiz to see what might
									work best with your information.
								</p>
								<div className='space-y-2 w-[50%] flex flex-col'>
									<Button asChild>
										<Link href='/products/large-4-page-booklet'>
											Large 4-Page Booklets
											<ArrowRight className='ml-2 w-4 h-4' />
										</Link>
									</Button>
									<Button asChild variant='outline'>
										<Link href='/project-fit-quiz'>
											Take Project Fit Quiz
											<ArrowRight className='ml-2 w-4 h-4' />
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>

					{/* Trifold Programs */}
					<div className='bg-white rounded-lg shadow-lg p-8'>
						<div className='grid md:grid-cols-2 gap-8 items-center'>
							<div className='md:order-2 relative h-[300px] rounded-lg overflow-hidden'>
								<Image
									src='/images/trifold-programs.jpg' // Add your image
									alt='Trifold Programs'
									fill
									className='object-cover'
								/>
							</div>
							<div className='md:order-1'>
								<h3 className='h3-bold mb-4'>Trifold Programs</h3>
								<p className='text-muted-foreground leading-relaxed mb-4'>
									Trifold programs are available in 2 sizes (large and medium)
									and are a single sheet of paper folded into 3 panels. Each
									panel features information and/or picture(s) depending on your
									Funeral or Memorial Service needs. Take our Project Fit Quiz
									to see what might work best with your information.
								</p>
								<div className='space-y-2 w-[50%] flex flex-col'>
									<Button asChild>
										<Link href='/products/deluxe-trifold-programs'>
											Deluxe Trifold Programs
											<ArrowRight className='ml-2 w-4 h-4' />
										</Link>
									</Button>
									<Button asChild>
										<Link href='/products/legal-trifold-programs'>
											Legal Trifold Programs
											<ArrowRight className='ml-2 w-4 h-4' />
										</Link>
									</Button>
									<Button asChild variant='outline'>
										<Link href='/project-fit-quiz'>
											Take Project Fit Quiz
											<ArrowRight className='ml-2 w-4 h-4' />
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* CTA Button */}
				<div className='text-center mt-12'>
					<Button asChild size='lg' className='shadow-lg'>
						<Link href=''>
							Ready to design? Start Memorial Project Now
							<ArrowRight className='ml-2 w-4 h-4' />
						</Link>
					</Button>
				</div>
			</section>

			{/* Section 4: Other Products */}
			<section>
				<h2 className='text-3xl font-bold text-center text-primary mb-12'>
					Learn About Other Products
				</h2>
				<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					{/* Tribute Bookmarks */}
					<Link href='/learn-more/tribute-bookmarks' className='group'>
						<div className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
							<div className='relative h-[200px]'>
								<Image
									src='/bookmarks.webp' // Add your image
									alt='Tribute Bookmarks'
									fill
									className='object-contain group-hover:scale-105 transition-transform'
								/>
							</div>
							<div className='p-4'>
								<h3 className='font-semibold text-lg mb-2 group-hover:text-primary/90 transition-colors'>
									Tribute Bookmarks
								</h3>
								<p className='text-sm text-muted-foreground mb-3'>
									2-sided Tribute Bookmarks
								</p>
								<span className='text-primary font-semibold text-sm flex items-center'>
									Learn More <ArrowRight className='ml-1 w-4 h-4' />
								</span>
							</div>
						</div>
					</Link>

					{/* Thank You Cards */}
					<Link href='/learn-more/thank-you-cards' className='group'>
						<div className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
							<div className='relative h-[200px]'>
								<Image
									src='/thank-you-cards.webp' // Add your image
									alt='Thank You Cards'
									fill
									className='object-contain group-hover:scale-105 transition-transform'
								/>
							</div>
							<div className='p-4'>
								<h3 className='font-semibold text-lg mb-2 group-hover:text-primary/90 transition-colors'>
									Thank You Cards
								</h3>
								<p className='text-sm text-muted-foreground mb-3'>
									Personalized folded cards for post-service gratitude mailings
								</p>
								<span className='text-primary font-semibold text-sm flex items-center'>
									Learn More <ArrowRight className='ml-1 w-4 h-4' />
								</span>
							</div>
						</div>
					</Link>

					{/* Guest Books */}
					<Link href='/learn-more/guest-books' className='group'>
						<div className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
							<div className='relative h-[200px]'>
								<Image
									src='/memory-products-guest-books.webp' // Add your image
									alt='Guest Books'
									fill
									className='object-cover group-hover:scale-105 transition-transform'
								/>
							</div>
							<div className='p-4'>
								<h3 className='font-semibold text-lg mb-2 group-hover:text-primary/90 transition-colors'>
									Guest Books
								</h3>
								<p className='text-sm text-muted-foreground mb-3'>
									Hard Cover Registry Book with Sign-in Pages
								</p>
								<span className='text-primary font-semibold text-sm flex items-center'>
									Learn More <ArrowRight className='ml-1 w-4 h-4' />
								</span>
							</div>
						</div>
					</Link>

					{/* Portrait Prints */}
					<Link href='/learn-more/portrait-prints' className='group'>
						<div className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
							<div className='relative h-[200px]'>
								<Image
									src='/memory-products-portrait-prints.webp' // Add your image
									alt='Portrait Prints'
									fill
									className='object-contain group-hover:scale-105 transition-transform'
								/>
							</div>
							<div className='p-4'>
								<h3 className='font-semibold text-lg mb-2 group-hover:text-primary/90 transition-colors'>
									Portrait Prints
								</h3>
								<p className='text-sm text-muted-foreground mb-3'>
									High-Quality Prints and Mounted Photos
								</p>
								<span className='text-primary font-semibold text-sm flex items-center'>
									Learn More <ArrowRight className='ml-1 w-4 h-4' />
								</span>
							</div>
						</div>
					</Link>
				</div>
			</section>
		</div>
	);
};

export default LearnMoreProgramsPage;
