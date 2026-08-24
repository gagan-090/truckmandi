import type { User } from "@/types/user";

/**
 * What `/api/auth/session` should answer during a test.
 *
 * `SessionProvider` always re-reads the session after mount, so seeding it
 * with `initialUser` is not enough — the fetch has to agree, or the
 * provider settles on "signed out" mid-assertion.
 */
let currentUser: User | null = null;

export function setSessionUser(user: User | null): void {
  currentUser = user;
}

export function getSessionUser(): User | null {
  return currentUser;
}
