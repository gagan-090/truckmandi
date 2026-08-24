import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Shown wherever an account page needs a real session. Saved vehicles and
 * comparisons work signed out because they live in the browser; enquiries,
 * listings and the profile do not.
 */
export function SignInPrompt({
  title = "Sign in to continue",
  description,
}: {
  title?: string;
  description: string;
}) {
  return (
    <EmptyState
      icon={<LogIn />}
      title={title}
      description={description}
      action={
        <>
          <Button asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/auth/register">Create an account</Link>
          </Button>
        </>
      }
    />
  );
}
