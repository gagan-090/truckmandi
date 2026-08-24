import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";
import { PageContainer } from "@/components/layout/page-container";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <PageContainer width="narrow" className="py-12 lg:py-20">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <Logo className="justify-center" />
          <h1 className="mt-7 font-display text-2xl font-extrabold text-balance text-steel-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-pretty text-steel-600">
            {description}
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-steel-200 bg-white p-6 shadow-sm">
          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-steel-600">
            {footer}
          </div>
        )}

        <p className="mt-8 text-center text-xs leading-relaxed text-steel-500">
          By continuing you agree to our{" "}
          <Link href="/terms" className="font-medium text-steel-700 underline">
            terms of use
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-steel-700 underline"
          >
            privacy policy
          </Link>
          .
        </p>
      </div>
    </PageContainer>
  );
}
