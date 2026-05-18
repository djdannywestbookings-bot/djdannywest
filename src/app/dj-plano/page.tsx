import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { CityPage } from "@/components/city/CityPage";
import { StructuredData } from "@/components/StructuredData";
import { cityServiceSchema, faqSchema } from "@/lib/seo";

const city = "Plano";

const intro =
  "Plano weddings, corporate floors at the Legacy West tech campuses, country-club galas, private estates — Plano is a regular stop on my calendar. Based 30 minutes south in Arlington, working Plano every weekend. I'm the official DJ for the Dallas Cowboys Stadium Club and mix-show coordinator on SiriusXM Channel 13. You're not getting a generic out-of-town DJ — you're getting the same DJ Dallas books for their highest-stakes nights.";

const doing = [
  {
    label: "Weddings",
    copy: "Country clubs, hotel ballrooms, private estates. Ceremony through last call, MC support, dance-floor reads.",
  },
  {
    label: "Corporate · Legacy West",
    copy: "Toyota, JPMorgan, Liberty Mutual, FedEx — holiday parties, sales kickoffs, brand activations on the Plano campus.",
  },
  {
    label: "Private · Quinces",
    copy: "Bilingual Latin DJ, vals + surprise dance handled. Backyard birthdays, anniversaries, themed nights.",
  },
];

const rooms = [
  "Gleneagles Country Club — Plano",
  "Marriott Legacy Town Center — Plano",
  "Hilton Dallas / Plano Granite Park",
  "Renaissance Dallas at Plano Legacy West",
  "The Box Garden at Legacy Hall — Plano",
  "Brinker International HQ — Plano",
  "Toyota North America HQ — Plano",
  "JPMorgan Chase Legacy West campus — Plano",
];

const faq = [
  {
    question: "Are you a Plano DJ?",
    answer:
      "Yes. I'm based in Arlington and work Plano regularly — weddings, corporate floors at Legacy West, country club galas, private estates. Same DJ Dallas books, no out-of-town markup.",
  },
  {
    question: "Do you DJ Plano weddings?",
    answer:
      "Yes. Country clubs, hotel ballrooms, private estates — Plano weddings are a regular part of my Saturday calendar. Ceremony through last call, MC support, the full kit.",
  },
  {
    question: "Do you have experience with Legacy West corporate events?",
    answer:
      "Yes. I've worked corporate floors across Plano — holiday parties, sales kickoffs, brand activations. Insured, on-brand, on-time. References available on request.",
  },
  {
    question: "How far in advance should I book for a Plano date?",
    answer:
      "Saturdays in May, June, October, November lock up 9–12 months out. If your date is firm, get on the calendar now.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "Plano DJ — Wedding · Corporate · Quinceañera DJ Plano TX | DJ Danny West",
  },
  description:
    "Plano DJ for hire — DJ Danny West, official Dallas Cowboys Stadium Club DJ, SiriusXM Channel 13 mix-show coordinator. Plano weddings, Legacy West corporate, quinceañeras, private parties. Bookings by inquiry.",
  alternates: { canonical: "/dj-plano" },
  openGraph: {
    title: "Plano DJ — DJ Danny West",
    description:
      "Plano weddings, Legacy West corporate, quinceañeras, private parties. Bookings by inquiry.",
    url: "/dj-plano",
    images: ["/og-image.jpg"],
  },
};

export default function PlanoPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData schemas={[cityServiceSchema(city), faqSchema(faq)]} />
      <SiteNav active="book" />
      <CityPage
        city={city}
        region="Plano, TX · DFW Metroplex"
        eyebrow="Plano"
        tagline="Weddings, Legacy West corporate floors, country club galas, quinceañeras, private estates. Same DJ Dallas books — no out-of-town markup."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
      />
      <Footer />
    </main>
  );
}
