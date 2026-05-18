import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { CityPage } from "@/components/city/CityPage";
import { StructuredData } from "@/components/StructuredData";
import { cityServiceSchema, faqSchema } from "@/lib/seo";

const city = "Southlake";

const intro =
  "Southlake's wedding venues — Marquee on Magnolia, Hilton Dallas/Southlake Town Square, Timarron Country Club, private estates across Carroll ISD — get the kind of receptions that demand a DJ who can hold the room from cocktail through closing. I'm the official Dallas Cowboys Stadium Club DJ. Southlake's nicest events get the same DJ the Cowboys book.";

const doing = [
  {
    label: "Weddings",
    copy: "Marquee on Magnolia, Hilton Southlake, Timarron Country Club, private estates. Ceremony through last call.",
  },
  {
    label: "Country clubs · Galas",
    copy: "Timarron, Vaquero Club. Wedding receptions, fundraisers, awards nights — the Southlake luxury slate.",
  },
  {
    label: "Private · Quinces",
    copy: "Bilingual Latin DJ. Backyard birthdays, anniversaries, private estate parties across Tarrant County.",
  },
];

const rooms = [
  "Marquee on Magnolia — Southlake",
  "Hilton Dallas / Southlake Town Square",
  "Timarron Country Club — Southlake",
  "Vaquero Club — Westlake",
  "Hyatt Regency Westlake (near Southlake)",
  "Private estates — Southlake, Westlake, Trophy Club",
];

const faq = [
  {
    question: "Are you a Southlake DJ?",
    answer:
      "Yes. I'm based in Arlington and work Southlake regularly. Marquee on Magnolia, Hilton Southlake Town Square, Timarron, private estates. Same DJ Dallas books, no out-of-town markup.",
  },
  {
    question: "Do you DJ Marquee on Magnolia weddings?",
    answer:
      "Yes — Marquee on Magnolia is a regular wedding venue on my calendar. Beautiful room, great for big-energy reads.",
  },
  {
    question: "Do you DJ Timarron Country Club weddings?",
    answer:
      "Yes. Timarron weddings, fundraisers, and members' galas are part of my regular Southlake calendar.",
  },
  {
    question: "How early should I book a Southlake wedding DJ?",
    answer:
      "9–14 months for Saturday weddings, especially May, June, October, November. Southlake luxury venues fill fast.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "Southlake DJ — Marquee on Magnolia · Timarron Wedding DJ | DJ Danny West",
  },
  description:
    "Southlake DJ for hire — DJ Danny West, official Dallas Cowboys Stadium Club DJ. Marquee on Magnolia, Hilton Southlake, Timarron Country Club. Weddings, corporate, quinceañeras. Bookings by inquiry.",
  alternates: { canonical: "/dj-southlake" },
  openGraph: {
    title: "Southlake DJ — DJ Danny West",
    description:
      "Marquee on Magnolia, Hilton Southlake, Timarron weddings. Cowboys' official DJ.",
    url: "/dj-southlake",
    images: ["/og-image.jpg"],
  },
};

export default function SouthlakePage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData schemas={[cityServiceSchema(city), faqSchema(faq)]} />
      <SiteNav active="book" />
      <CityPage
        city={city}
        region="Southlake, TX · Tarrant County · DFW"
        eyebrow="Southlake"
        tagline="Marquee on Magnolia, Hilton Southlake Town Square, Timarron, Vaquero Club. The luxury slate. Cowboys' official DJ on the same calendar."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
      />
      <Footer />
    </main>
  );
}
