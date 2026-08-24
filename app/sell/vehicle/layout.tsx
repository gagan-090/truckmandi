import { PageContainer } from "@/components/layout/page-container";
import { SellProgress } from "@/components/sell/sell-progress";
import { SellProvider } from "@/features/sell/store";
import { Logo } from "@/components/layout/logo";

/**
 * The wizard shell. `SellProvider` lives here rather than in each step, so
 * moving between steps never remounts it and never loses what was typed.
 */
export default function SellVehicleLayout({
  children,
}: LayoutProps<"/sell/vehicle">) {
  return (
    <SellProvider>
      <div className="border-b border-steel-200 bg-white">
        <PageContainer width="narrow" className="py-4">
          <div className="mb-4 lg:hidden">
            <Logo />
          </div>
          <SellProgress />
        </PageContainer>
      </div>

      <PageContainer width="narrow" className="py-8 pb-16 lg:py-10">
        {children}
      </PageContainer>
    </SellProvider>
  );
}
