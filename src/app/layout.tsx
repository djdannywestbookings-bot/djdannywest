import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { StructuredData } from "@/components/StructuredData";
import { personSchema, localBusinessSchema, websiteSchema } from "@/lib/seo";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { PersistentMiniPlayer } from "@/components/player/PersistentMiniPlayer";

// Editorial type system:
//   - Fraunces (variable serif) → display / headlines. Variable font: we let
//     CSS font-weight drive weight (Tailwind font-bold / font-extrabold map
//     straight through), and opt into SOFT + opsz axes for editorial breath.
//     IMPORTANT: when `axes` is specified, `weight` MUST be omitted (or
//     `"variable"`) — Next.js's font loader rejects the combo otherwise.
//   - Inter Tight → body, nav, buttons, UI labels.
//   - JetBrains Mono → marquee + tour-itinerary / broadcast accents.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
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
      className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <StructuredData schemas={[personSchema(), localBusinessSchema(), websiteSchema()]} />
      </head>
      <body className="min-h-screen bg-night text-cream antialiased">
        <PlayerProvider>
          {children}
          <PersistentMiniPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
