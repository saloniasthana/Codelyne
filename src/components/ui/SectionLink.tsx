"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/Providers";

/**
 * Link to a "#section" on the home page. Smooth-scrolls when already on the
 * home page, otherwise navigates to "/#section".
 */
export default function SectionLink({
  href,
  children,
  className,
  onNavigate,
  ...rest
}: {
  href: `#${string}`;
  children: React.ReactNode;
  className?: string;
  onNavigate?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const pathname = usePathname();
  const { scrollTo } = useApp();

  return (
    <Link
      href={`/${href}`}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (pathname === "/") {
          e.preventDefault();
          scrollTo(href === "#top" ? 0 : href);
          history.replaceState(null, "", href === "#top" ? "/" : href);
        }
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
