import "server-only";
import { cookies } from "next/headers";
import type { User } from "@/types/user";
import { readSessionEmail, SESSION_COOKIE } from "./session";
import { getUserByEmail } from "./user-store";

/**
 * The signed-in user, or null.
 *
 * Identity comes only from the signed session cookie. An earlier version
 * trusted a `truckmitr_user_data` cookie that was readable *and writable*
 * by the browser, so editing it was enough to impersonate anyone.
 */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const email = await readSessionEmail(store.get(SESSION_COOKIE)?.value);
  if (!email) return null;

  const user = await getUserByEmail(email);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    emailVerified: user.emailVerified,
    phoneVerified: true,
    createdAt: user.createdAt,
  };
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}
