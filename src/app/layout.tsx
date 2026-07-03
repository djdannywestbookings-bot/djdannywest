import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { StructuredData } from "@/components/StructuredData";
import { personSchema, localBusinessSchema, websiteSchema } from "@/lib/seo";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { PersistentMiniPlayer } from "@/components/player/PersistentMiniPlayer";

// Editorial type system, v3:
//   - Cormorant Garamond → display / prose / italic accents. Classical serif
//     with a real italic that carries character; used for headlines, sub-
//     heads, manifesto quotes, form fields.
//   - Inter → labels, nav, buttons, form labels, tickers, micro-copy — 10-14px
//     UI text where a serif would get muddy.
//
// The old CSS variables `--font-display`, `--font-serif`, `--font-sans` and
// `--font-mono` are re-pointed at Cormorant / Inter / system-mono in
// globals.css, so any legacy `font-*` utility on non-homepage routes still
// resolves without loading Fraunces / Inter Tight / JetBrains Mono.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Dallas DJ · Fort Worth DJ · Bookings by inquiry`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "DJ Danny West",
    "Danny West DJ",
    "best DJ in Dallas",
    "best DJ in Fort Worth",
    "Dallas DJ",
    "Fort Worth DJ",
    "DFW DJ",
    "Arlington DJ",
    "wedding DJ Dallas",
    "wedding DJ Fort Worth",
    "corporate DJ Dallas",
    "club DJ Dallas",
    "Latin DJ Dallas",
    "Dallas Cowboys DJ",
    "SiriusXM Pitbull's Globalization",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Dallas DJ · Fort Worth DJ`,
    description: site.description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Dallas DJ · Fort Worth DJ`,
    description: site.description,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/brand/icon-192.png",
  },
  category: "music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <head>
        <StructuredData schemas={[personSchema(), localBusinessSchema(), websiteSchema()]} />
      </head>
      <body className="min-h-screen antialiased">
        <PlayerProvider>
          {children}
          <PersistentMiniPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
