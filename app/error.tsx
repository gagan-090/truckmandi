"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { ErrorState } from "@/components/ui/error-state";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with your error reporter. The digest correlates with the
    // server log entry for this render.
    console.error("Route error", error.digest ?? error.message);
  }, [error]);

  return (
    <PageContainer width="narrow" className="py-20 lg:py-28">
      <ErrorState
        title="This page ran into a problem"
        description="Something went wrong while loading this page. Trying again usually fixes it — if it does not, the issue is on our side and we are already looking."
        action={
          <>
            <Button onClick={reset}>
              <RotateCw />
              Try again
            </Button>
            <Button asChild variant="secondary">
              <Link href="/vehicles">Browse vehicles</Link>
            </Button>
          </>
        }
      />

      {error.digest && (
        <p className="mt-6 text-center text-xs text-steel-500">
          Reference <span className="tabular">{error.digest}</span>
        </p>
      )}
    </PageContainer>
  );
}
