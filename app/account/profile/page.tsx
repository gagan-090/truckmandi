import type { Metadata } from "next";
import { SignInPrompt } from "@/components/account/sign-in-prompt";
import { UserProfileForm } from "@/components/account/user-profile-form";
import { getCurrentUser } from "@/lib/auth/auth";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Profile",
  description: "Manage your TruckMitr Exchange profile and contact details.",
  path: "/account/profile",
  noIndex: true,
});

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h2 className="font-display text-lg font-bold text-steel-900">Profile</h2>
      <p className="mt-1.5 mb-6 max-w-2xl text-sm text-pretty text-steel-600">
        Your name, mobile number and account preferences.
      </p>

      {user ? (
        <UserProfileForm initialUser={user} />
      ) : (
        <SignInPrompt description="Sign in to view and update your profile details and contact number." />
      )}
    </div>
  );
}
