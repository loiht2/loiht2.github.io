import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ViewTransitions } from "next-view-transitions";
import ThemeProvider from "@/components/theme-provider";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { PROFILE } from "@/content/profile";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Cloud-Native Infrastructure`, template: `%s — ${SITE_NAME}` },
  description: PROFILE.positioning,
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="flex min-h-svh flex-col bg-bg font-sans text-fg antialiased">
          <ThemeProvider>
            <a href="#main" className="skip-link">Skip to content</a>
            <SiteHeader />
            <main id="main" className="flex-1">{children}</main>
            <SiteFooter />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
