import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { MarketplaceLayoutShell } from "@/components/layout/marketplace-layout-shell";
import { SessionProvider } from "@/features/auth/session-context";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { getCompareIndex } from "@/features/compare/index-data";
import { organizationSchema, websiteSchema } from "@/lib/seo/structured-data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Buy & Sell Used Commercial Trucks in India`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  applicationName: siteConfig.name,
  keywords: [
    "used trucks",
    "commercial vehicles India",
    "buy used truck",
    "sell truck online",
    "used pickup",
    "used tipper",
    "used bus",
    "second hand commercial vehicles",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image", site: siteConfig.social.twitter },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const compareIndex = await getCompareIndex();

  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <SessionProvider>
          <a
            href="#main"
            className="sr-only rounded-md bg-steel-900 px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
          >
            Skip to main content
          </a>

          <MarketplaceLayoutShell compareIndex={compareIndex}>
            {children}
          </MarketplaceLayoutShell>

          <JsonLd data={[organizationSchema(), websiteSchema()]} />
        </SessionProvider>
      </body>
    </html>
  );
}
