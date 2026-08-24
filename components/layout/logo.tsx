import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";

/**
 * Renders app/image.png as the navbar logo image.
 */
export function Logo({
  className,
  tone = "dark",
  href = "/",
}: {
  className?: string;
  tone?: "dark" | "light";
  href?: string | null;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt={siteConfig.name}
        width={180}
        height={48}
        priority
        unoptimized
        className="h-9 w-auto object-contain sm:h-11"
      />
    </span>
  );

  if (href === null) return content;

  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className="shrink-0 focus:outline-none"
    >
      {content}
    </Link>
  );
}
