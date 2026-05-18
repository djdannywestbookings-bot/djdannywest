import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { CityPage } from "@/components/city/CityPage";
import { StructuredData } from "@/components/StructuredData";
import { cityServiceSchema, faqSchema } from "@/lib/seo";

const city = "Irving";

const intro =
  "Las Colinas weddings, Toyota Music Factory corporate events, ExxonMobil and Verizon HQ holiday parties, country clubs across Irving — I work this side of DFW every week. Based 20 minutes away in Arlington. Official Dallas Cowboys Stadium Club DJ. Same DJ Dallas books, no out-of-town markup.";

const doing = [
  {
    label: "Las Colinas weddings",
    copy: "Four Seasons Las Colinas, Omni Mandalay, Las Colinas Country Club. Ceremony through last call.",
  },
  {
    label: "Toyota Music Factory · Corporate",
    copy: "Holiday parties, brand activations, sales kickoffs for the Irving corporate HQ campuses. Insured, on-brand.",
  },
  {
    label: "Private · Quinces",
    copy: "Bilingual Latin DJ, vals + surprise dance handled. Backyard birthdays, anniversaries.",
  },
];

const rooms = [
  "Four Seasons Resort and Club — Las Colinas",
  "Omni Mandalay Hotel at Las Colinas",
  "Las Colinas Country Club",
  "Toyota Music Factory — Irving",
  "Texican Court Hotel — Irving",
  "Hackberry Creek Country Club — Irving",
  "Westin Irving Convention Center at Las Colinas",
];

const faq = [
  {
    question: "Are you an Irving DJ?",
    answer:
      "Yes. I'm based 20 minutes south in Arlington and work Irving and Las Colinas regularly. Weddings, corporate floors at the Irving HQs, country club galas.",
  },
  {
    question: "Do you DJ Las Colinas weddings?",
    answer:
      "Yes — Four Seasons Las Colinas, Omni Mandalay, Las Colinas Country Club. Las Colinas is a regular wedding stop on my calendar.",
  },
  {
    question: "Have you worked at the Toyota Music Factory?",
    answer:
      "Yes — corporate activations and private events at the Music Factory. I know the venue, the load-in, the production teams.",
  },
  {
    question: "How early should I book an Irving wedding DJ?",
    answer:
      "9–12 months out for Saturday weddings. Las Colinas weekends fill fast — get your date on the calendar early.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "Irving DJ — Las Colinas Wedding · Toyota Music Factory Corporate | DJ Danny West",
  },
  description:
    "Irving DJ for hire — DJ Danny West, official Dallas Cowboys Stadium Club DJ. Four Seasons Las Colinas, Omni Mandalay, Toyota Music Factory — weddings, corporate, quinceañeras. Bookings by inquiry.",
  alternates: { canonical: "/dj-irving" },
  openGraph: {
    title: "Irving DJ — DJ Danny West",
    description:
      "Las Colinas weddings, Toyota Music Factory corporate, Irving HQ events. Cowboys' official DJ.",
    url: "/dj-irving",
    images: ["/og-image.jpg"],
  },
};

export default function IrvingPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData schemas={[cityServiceSchema(city), faqSchema(faq)]} />
      <SiteNav active="book" />
      <CityPage
        city={city}
        region="Irving, TX · DFW Metroplex"
        eyebrow="Irving"
        tagline="Las Colinas weddings, Toyota Music Factory activations, Irving HQ holiday parties. 20 minutes from home — no travel markup."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
        currentCityHref="/dj-irving"
      />
      <Footer />
    </main>
  );
}
