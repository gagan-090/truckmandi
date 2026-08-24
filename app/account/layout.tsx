import { PageContainer } from "@/components/layout/page-container";
import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <PageContainer className="py-6 lg:py-10">
      <h1 className="font-display text-2xl font-extrabold text-steel-900 sm:text-3xl">
        Your account
      </h1>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-10">
        <AccountNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </PageContainer>
  );
}
