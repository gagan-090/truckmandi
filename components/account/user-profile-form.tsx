"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, LogOut, Mail, Phone, Save, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth/session-context";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import type { User as UserType } from "@/types/user";

export function UserProfileForm({ initialUser }: { initialUser: UserType }) {
  const router = useRouter();
  const { signOut } = useSession();
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);
  const [phone, setPhone] = useState(initialUser.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSavedSuccess(false);

    const updatedUser = {
      ...initialUser,
      name,
      email,
      phone,
    };

    document.cookie = `truckmitr_user_data=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=2592000`;

    setTimeout(() => {
      setSubmitting(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      // Clears the httpOnly cookie server-side and resets the client
      // session, so the header stops showing the previous user.
      await signOut();
      router.push("/auth/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Active User Card Banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-steel-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 font-display text-xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold text-steel-900">{name}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-trust-100 px-2.5 py-0.5 text-xs font-semibold text-trust-800">
                <ShieldCheck className="size-3.5 text-trust-600" />
                Verified User
              </span>
            </div>
            <p className="text-xs text-steel-500 mt-0.5">
              Member ID: <code className="font-mono text-steel-700">{initialUser.id}</code> · Member since 2024
            </p>
          </div>
        </div>

        {/* Log Out Button */}
        <Button
          type="button"
          variant="subtle"
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
        >
          {loggingOut ? <Loader2 className="animate-spin size-4" /> : <LogOut className="size-4" />}
          Log Out
        </Button>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-md border border-trust-200 bg-trust-50 p-3 text-sm text-trust-800">
          <CheckCircle2 className="size-4 text-trust-600 shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Form Details */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-steel-200 bg-white p-5 sm:p-6 space-y-5 shadow-xs">
        <h4 className="font-display text-base font-bold text-steel-900 border-b border-steel-100 pb-3">
          Personal Information
        </h4>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="profile-name" label="Full Name" required>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-steel-400" />
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
              />
            </div>
          </FormField>

          <FormField id="profile-email" label="Email Address" required>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-steel-400" />
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </FormField>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="profile-phone" label="Mobile Number" required hint="Used for enquiry SMS alerts">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-steel-400" />
              <Input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9"
              />
            </div>
          </FormField>

          <div className="flex flex-col justify-end">
            <div className="rounded-lg bg-steel-50 p-3 text-xs text-steel-600 border border-steel-100">
              <p className="font-semibold text-steel-800">Account Security Status</p>
              <p className="mt-0.5">Email and mobile number are verified for trading on TruckMitr Exchange.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-steel-100 pt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="subtle"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            {loggingOut ? <Loader2 className="animate-spin size-4" /> : <LogOut className="size-4" />}
            Log Out Account
          </Button>

          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
