"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

const links = [
  { title: "Home", href: "/" },
  {
    title: "Learn More",
    href: "/learn-more",
  },
  {
    title: "Our Products",
    href: "/products",
  },
  {
    title: "About",
    href: "/about-us",
  },
  {
    title: "Contact",
    href: "/contact-us",
  },
  {
    title: "Project Fit Quiz",
    href: "/project-fit-quiz",
  },
];

const HomeMainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 xl:space-x-5", className)}
      {...props}
    >
      {links.map((item) => {
        // Check for exact match for home, includes for others
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium hover:text-primary/80 transition-colors duration-300",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default HomeMainNav;
