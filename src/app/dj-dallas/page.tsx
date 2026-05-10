import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { CityPage } from "@/components/city/CityPage";
import { StructuredData } from "@/components/StructuredData";
import { cityServiceSchema, faqSchema } from "@/lib/seo";

const city = "Dallas";

const intro =
  'I\'m the official DJ for the Dallas Cowboys Stadium Club every home game, mix-show coordinator on SiriusXM Channel 13 (Pitbull\'s Globalization), and I\'ve held the booth for clients and venues across the Dallas metro since 2006. If your event is in Dallas, you don\'t need to fly anyone in — I\'m here.';

const doing = [
  {
    label: "Weddings",
    copy: "Cocktail through dance floor. Reads the room, builds the night, hands the mic when it matters.",
  },
  {
    label: "Corporate · Galas",
    copy: "Receptions, awards nights, brand activations. Clean, on-brand, on-time.",
  },
  {
    label: "Clubs · Private",
    copy: "Open format, Latin, hip-hop, house. Bottle service rooms to backyard rooftops.",
  },
];

const rooms = [
  "Dallas Cowboys Stadium Club — official DJ, every home game",
  "American Airlines Center, Dallas",
  "W Hotel Dallas",
  "Gaylord Texan Resort — Grapevine",
  "Concrete Cowboy — Dallas",
  "Golden Boy Entertainment — Dallas",
  "Professional Fight League — Dallas",
  "ESPN Super Bowl — Dallas",
  "HBO Boxing / Top Rank — Dallas",
];

const faq = [
  {
    question: "How much does it cost to hire DJ Danny West in Dallas?",
    answer:
      "Bookings start at $1,500. Final price depends on event length, location, production needs, and date. Send the details through the booking form and I'll respond personally within 24 hours.",
  },
  {
    question: "Do you DJ Dallas weddings?",
    answer:
      "Yes — weddings are a big part of what I do. Cocktail hour through last call, MC support included, dance-floor reads dialed in.",
  },
  {
    question: "Are you really the Dallas Cowboys' DJ?",
    answer:
      "Yes — I've been the official DJ for the Dallas Cowboys Stadium Club every home game since 2016. I work with their entertainment team year-round.",
  },
  {
    question: "Do you bring sound and lighting?",
    answer:
      "I bring DJ gear (controllers, decks, headphones, monitors). Full PA and lighting can be quoted separately depending on venue. Many Dallas venues already have house systems I plug into.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "Earlier is better — Saturdays in the Dallas wedding season (March–June, September–November) book out months in advance. For corporate events 4–8 weeks lead time is typical. Last-minute is sometimes possible — ask.",
  },
];

export const metadata: Metadata = {
  title: "Best DJ in Dallas — Wedding · Corporate · Club · Private | DJ Danny West",
  description: `Hire DJ Danny West — official DJ for the Dallas Cowboys Stadium Club, SiriusXM Channel 13. ${intro}`,
  alternates: { canonical: "/dj-dallas" },
  openGraph: {
    title: "Best DJ in Dallas — DJ Danny West",
    description: "Official Dallas Cowboys DJ. Bookings from $1,500. Weddings, corporate, club, private.",
    url: "/dj-dallas",
    images: ["/og-image.jpg"],
  },
};

export default function DallasPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[cityServiceSchema(city), faqSchema(faq)]}
      />
      <SiteNav active="book" />
      <CityPage
        city={city}
        region="Dallas, TX · DFW Metroplex"
        eyebrow="No. 06 — Dallas"
        tagline="Weddings, corporate floors, clubs, private events. Based in Arlington, working Dallas every weekend. Bookings start at $1,500 — you talk to me, you book me."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
      />
      <Footer />
    </main>
  );
}
