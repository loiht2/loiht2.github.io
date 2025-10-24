import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import ThemeScript from "@/components/theme-script";
import { ThemeProvider } from "@/components/theme-provider";
import AmbientBackground from "@/components/ambient-background";

export const metadata = {
  metadataBase: new URL("https://loiht2.github.io"),
  title: {
    default: "Thanh-Loi Hoang — Personal Site",
    template: "%s — Thanh-Loi Hoang",
  },
  description:
    "Cloud-native platform engineer Thanh-Loi Hoang shares projects, writing, and research on Kubernetes, MLOps, and dependable infrastructure.",
  openGraph: {
    title: "Thanh-Loi Hoang — Personal Site",
    description:
      "Cloud-native platform engineer Thanh-Loi Hoang shares projects, writing, and research on Kubernetes, MLOps, and dependable infrastructure.",
    type: "website",
    url: "https://loiht2.github.io/",
  },
  alternates: {
    canonical: "https://loiht2.github.io/",
    types: {
      "application/rss+xml": "https://loiht2.github.io/rss.xml",
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="light"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body>
        <ThemeScript />
        <ThemeProvider>
          <AmbientBackground />
          <a href="#main" className="skip">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
