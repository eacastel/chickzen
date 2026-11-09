import "./globals.css";
import "./editorial.css";
import SiteHeader from "@/components/editorial/SiteHeader";
import SiteFooter from "@/components/editorial/SiteFooter";
import AnalyticsConsent from "@/components/editorial/AnalyticsConsent";
import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/defaultMetadata";
import { isPublicProduction, isAnalyticsProduction } from "@/lib/deployment";

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL("https://chickzen.com"),
  robots: isPublicProduction()
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="describedby" href="/llms.txt" type="text/plain" />
      </head>
      <body className="site-body">
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="site-main">
          {children}
        </main>
        <SiteFooter />
        <AnalyticsConsent enabled={isAnalyticsProduction()} containerId={process.env.NEXT_PUBLIC_GTM_ID || ""} />
      </body>
    </html>
  );
}
