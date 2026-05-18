import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { CityPage } from "@/components/city/CityPage";
import { StructuredData } from "@/components/StructuredData";
import { cityServiceSchema, faqSchema } from "@/lib/seo";

const city = "Dallas";

const intro =
  "I'm the official DJ for the Dallas Cowboys Stadium Club every home game, mix-show coordinator on SiriusXM Channel 13 (Pitbull's Globalization), and I've held the booth for clients and venues across the Dallas metro since 2006. If your event is in Dallas, you don't need to fly anyone in — I'm here.";

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
    question: "Do you DJ Dallas weddings?",
    answer:
      "Yes. Weddings are a big part of what I do — cocktail hour through last call, MC support included, dance-floor reads dialed in.",
  },
  {
    question: "Are you really the Dallas Cowboys' DJ?",
    answer:
      "Yes. I've been the official DJ for the Dallas Cowboys Stadium Club every home game since 2016. I work with their entertainment team year-round.",
  },
  {
    question: "Do you bring sound and lighting?",
    answer:
      "I bring my DJ equipment — decks, mixer, headphones, microphone — whichever setup sounds best for the room. Full PA and lighting can be quoted separately depending on venue size and guest count. Inquire and we'll scope it.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "Earlier is better. Most Friday and Saturday clients book me a year out — I'm already booked into next March. If I'm free, I'm yours; but dates lock in fast. Send your inquiry and once we're aligned a deposit holds the date. There's no such thing as too early.",
  },
];

export const metadata: Metadata = {
  title: { absolute: "Best DJ in Dallas — Wedding · Corporate · Club · Private | DJ Danny West" },
  description: `Hire DJ Danny West — official DJ for the Dallas Cowboys Stadium Club, SiriusXM Channel 13. ${intro}`,
  alternates: { canonical: "/dj-dallas" },
  openGraph: {
    title: "Best DJ in Dallas — DJ Danny West",
    description: "Official Dallas Cowboys DJ. Weddings, corporate, club, private. Bookings by inquiry.",
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
        eyebrow="Dallas"
        tagline="Weddings, corporate floors, clubs, private events. Based in Arlington, working Dallas every weekend. You talk to me, you book me."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
      />
      <Footer />
    </main>
  );
}
