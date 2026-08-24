import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { SessionProvider } from "@/features/auth/session-context";
import type { User } from "@/types/user";
import { setSessionUser } from "./session-mock";

export const testUser: User = {
  id: "usr_test_1234",
  name: "Test Buyer",
  email: "buyer@example.com",
  phone: "9876543210",
  emailVerified: true,
  phoneVerified: true,
  createdAt: "2026-01-01T00:00:00.000Z",
};

/**
 * Renders inside the providers the app supplies at the root.
 *
 * Saved vehicles and comparisons are namespaced per account, so anything
 * touching them needs a session — pass `user: null` to exercise the
 * signed-out (guest) path.
 */
export function renderWithProviders(
  ui: ReactElement,
  { user = testUser, ...options }: RenderOptions & { user?: User | null } = {},
) {
  setSessionUser(user);

  function Wrapper({ children }: { children: ReactNode }) {
    return <SessionProvider initialUser={user}>{children}</SessionProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
export { renderWithProviders as render };
