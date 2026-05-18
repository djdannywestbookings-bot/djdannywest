import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { CityPage } from "@/components/city/CityPage";
import { StructuredData } from "@/components/StructuredData";
import { cityServiceSchema, faqSchema } from "@/lib/seo";

const city = "Frisco";

const intro =
  "Frisco weddings at the Star, Omni PGA Frisco, and Stonebriar — corporate floors for the Cowboys HQ campus — Latin nights, country clubs, private estates. I'm the official DJ for the Dallas Cowboys Stadium Club, so Frisco is already on my map every season. If your wedding or event is in Frisco, you're not flying anyone in — I'm already in town.";

const doing = [
  {
    label: "Weddings",
    copy: "Hotel Crescent Court, Omni PGA, The Star, country club ballrooms. Ceremony through last call.",
  },
  {
    label: "Cowboys HQ · Corporate",
    copy: "Holiday parties, sales kickoffs, brand activations at the Star. Insured, on-brand, on-time.",
  },
  {
    label: "Private · Quinces",
    copy: "Bilingual Latin DJ, vals + surprise dance handled. Backyard birthdays, anniversaries, holiday house parties.",
  },
];

const rooms = [
  "The Star in Frisco — Dallas Cowboys HQ campus",
  "Omni PGA Frisco Resort",
  "Westin Stonebriar Hotel & Golf Club — Frisco",
  "Hilton Frisco at the Star",
  "Embassy Suites — Frisco",
  "Stonebriar Country Club — Frisco",
  "The Cottonwood Building — Frisco",
];

const faq = [
  {
    question: "Are you a Frisco DJ?",
    answer:
      "Yes. I'm based 40 minutes south in Arlington and work Frisco regularly. The Star, Omni PGA, Stonebriar, country clubs, private estates. Same DJ Dallas books, no out-of-town markup.",
  },
  {
    question: "Have you DJed events at the Star in Frisco?",
    answer:
      "Yes. The Star is the Cowboys HQ campus and I'm the team's official DJ for the Stadium Club. I work events on the Frisco campus throughout the year.",
  },
  {
    question: "Do you DJ Omni PGA Frisco weddings?",
    answer:
      "Yes — Omni PGA Frisco is a regular wedding venue on my calendar. Big-room reads, full PA scoping for the ballroom, MC support included.",
  },
  {
    question: "How early should I book for a Frisco wedding?",
    answer:
      "9–14 months for Saturday weddings, especially spring and fall. Frisco's nicest rooms get booked early — get your date on my calendar now.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "Frisco DJ — Wedding · Cowboys HQ · Corporate DJ Frisco TX | DJ Danny West",
  },
  description:
    "Frisco DJ for hire — DJ Danny West, official Dallas Cowboys Stadium Club DJ. The Star, Omni PGA Frisco, Stonebriar Country Club — weddings, corporate, quinceañeras, private parties. Bookings by inquiry.",
  alternates: { canonical: "/dj-frisco" },
  openGraph: {
    title: "Frisco DJ — DJ Danny West",
    description:
      "The Star, Omni PGA, Stonebriar weddings and corporate. Cowboys' official DJ. Bookings by inquiry.",
    url: "/dj-frisco",
    images: ["/og-image.jpg"],
  },
};

export default function FriscoPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData schemas={[cityServiceSchema(city), faqSchema(faq)]} />
      <SiteNav active="book" />
      <CityPage
        city={city}
        region="Frisco, TX · DFW Metroplex"
        eyebrow="Frisco"
        tagline="The Star. Omni PGA. Stonebriar. Country clubs and private estates. Cowboys' official DJ already on your map every season."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
      />
      <Footer />
    </main>
  );
}
