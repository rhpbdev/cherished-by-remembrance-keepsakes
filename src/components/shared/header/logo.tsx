import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
}

const Logo = ({ variant }: LogoProps) => {
  return (
    <>
      <Link href='/' className='flex-start'>
        <Image
          src='/images/logo.svg'
          alt={`${APP_NAME} logo`}
          height={48}
          width={48}
          priority={true}
          className={variant === "light" ? "invert" : ""}
        />
        <span className='hidden lg:block font-bold text-xl ml-3'>
          {APP_NAME}
        </span>
      </Link>
    </>
  );
};

export default Logo;
