import "./globals.css";
import "./editorial.css";
import SiteHeader from "@/components/editorial/SiteHeader";
import SiteFooter from "@/components/editorial/SiteFooter";
import Script from "next/script";
import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/defaultMetadata";
import { isPublicProduction } from "@/lib/deployment";

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
  const ga =
    isPublicProduction() &&
    /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID || "")
      ? process.env.NEXT_PUBLIC_GA_ID
      : null;
  return (
    <html lang="en">
      <body className="site-body">
        {ga && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
              strategy="afterInteractive"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
            >{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(ga)});`}</Script>
          </>
        )}
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="site-main">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
