import Link from 'next/link';
import Image from 'next/image';

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-x-2">
      <div className="relative size-10 shrink-0">
        <Image
          src="/cfmemories-logo-dove-only-black.webp"
          alt="CF Memories Logo"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="shrink-0 transition hover:opacity-75"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </Link>
  );
};
