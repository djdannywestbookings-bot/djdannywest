import type { Metadata } from "next";
import { DM_Serif_Display, Geist } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { StructuredData } from "@/components/StructuredData";
import { personSchema, localBusinessSchema, websiteSchema } from "@/lib/seo";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
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
    <html lang="en" className={`${dmSerif.variable} ${geist.variable}`}>
      <head>
        <StructuredData schemas={[personSchema(), localBusinessSchema(), websiteSchema()]} />
      </head>
      <body className="min-h-screen bg-night text-cream antialiased">
        {children}
      </body>
    </html>
  );
}
