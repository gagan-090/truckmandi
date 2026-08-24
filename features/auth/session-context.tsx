"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { adoptGuestData, clearGuestData } from "@/lib/storage/account-scope";
import type { User } from "@/types/user";

export type SessionStatus = "loading" | "authenticated" | "anonymous";

interface SessionValue {
  user: User | null;
  status: SessionStatus;
  /** Re-reads the session, e.g. after sign-in or a profile update. */
  refresh: () => void;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

/**
 * Client-side session, fetched once from `/api/auth/session`.
 *
 * Deliberately not read from `cookies()` in the root layout: that would opt
 * every route out of static rendering. Fetching after mount keeps the 120
 * prerendered pages static and still gives every client component one
 * consistent view of the signed-in user.
 */
export function SessionProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [status, setStatus] = useState<SessionStatus>(
    initialUser ? "authenticated" : "loading",
  );
  // Bumped by `refresh()`; re-runs the effect below rather than sharing an
  // async callback, which keeps state updates out of the effect body.
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/session", { credentials: "include", cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`session ${response.status}`);
        return response.json() as Promise<{ user: User | null }>;
      })
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        setStatus(data.user ? "authenticated" : "anonymous");
      })
      .catch(() => {
        // Offline or the endpoint is down — treat as signed out rather than
        // leaving the UI stuck on a loading state forever.
        if (cancelled) return;
        setUser(null);
        setStatus("anonymous");
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  // Anything saved while signed out belongs to whoever is at the browser,
  // so it moves into the account on sign-in — once per account.
  const adoptedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!user || adoptedFor.current === user.id) return;
    adoptedFor.current = user.id;
    adoptGuestData(user.id);
  }, [user]);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Clearing local state still signs the user out of this tab.
    }
    // Clear the guest bucket too, so the previous session's saved
    // vehicles and enquiries cannot follow the next person who signs in.
    clearGuestData();
    adoptedFor.current = null;
    setUser(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo(
    () => ({ user, status, refresh, signOut }),
    [user, status, refresh, signOut],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside <SessionProvider>");
  }
  return context;
}
