import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href='/' className='flex items-center gap-x-2'>
      <div className='size-10 relative shrink-0'>
        <Image
          src='/cfmemories-logo-dove-only-black.webp'
          alt='CF Memories Logo'
          fill
          className='shrink-0 hover:opacity-75 transition'
          loading='eager'
          fetchPriority='high'
        />
      </div>
    </Link>
  );
};
