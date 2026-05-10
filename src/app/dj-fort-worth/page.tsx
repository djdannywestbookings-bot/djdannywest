import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { CityPage } from "@/components/city/CityPage";
import { StructuredData } from "@/components/StructuredData";
import { cityServiceSchema, faqSchema } from "@/lib/seo";

const city = "Fort Worth";

const intro =
  "I live in Arlington — between Dallas and Fort Worth — which means Fort Worth is a 25-minute drive, not a flight. I've held the booth for the Dallas Cowboys at AT&T Stadium (Tarrant County), spun for SiriusXM Channel 13 (Pitbull's Globalization), and toured with 50 Cent, Pitbull, Enrique Iglesias, and Ricky Martin. If your event is in Fort Worth, Westlake, Sundance Square, or anywhere west of the Trinity, I'm there.";

const doing = [
  {
    label: "Weddings",
    copy: "Cocktail hour through last dance. From estates in Westlake to ballrooms downtown.",
  },
  {
    label: "Corporate · Private",
    copy: "Brand activations, awards nights, executive parties, family galas. Clean, professional, on-message.",
  },
  {
    label: "Clubs · Lounges",
    copy: "Open format, Latin, hip-hop, house. Whatever the room needs — I read it before you do.",
  },
];

const rooms = [
  "AT&T Stadium — Arlington (Cowboys home games)",
  "Sundance Square area — downtown Fort Worth",
  "Westlake estates — private events",
  "Gaylord Texan Resort — Grapevine (DFW corridor)",
  "Concrete Cowboy — Dallas (frequent crossover crowd)",
  "Professional Fight League — DFW events",
  "Golden Boy Entertainment — DFW events",
];

const faq = [
  {
    question: "How much does it cost to hire DJ Danny West in Fort Worth?",
    answer:
      "Bookings start at $1,500. Final price varies by event length, venue, and production needs. Send your event details through the booking form — I respond personally within 24 hours.",
  },
  {
    question: "Do you DJ Fort Worth weddings?",
    answer:
      "Yes. I'm based in Arlington, 25 minutes from downtown Fort Worth. Weddings are a regular part of what I do — full reception, cocktail hour, ceremony coverage on request.",
  },
  {
    question: "Why hire you over a local Fort Worth DJ?",
    answer:
      "Same metro, bigger résumé. I'm the official DJ for the Dallas Cowboys Stadium Club, mix-show coordinator on SiriusXM, and I've toured with 50 Cent, Pitbull, and Enrique Iglesias. You get a touring-level DJ at a local-DJ travel cost.",
  },
  {
    question: "Will you travel out to Westlake / Aledo / Mansfield / Granbury?",
    answer:
      "Yes — I cover the entire Fort Worth metro. Travel beyond ~30 miles from Arlington gets a small travel addition, scoped on the quote.",
  },
  {
    question: "Do you bring sound and lighting?",
    answer:
      "I bring DJ gear (controllers, decks, headphones, monitors). Full PA and lighting can be added on the quote. Many venues have house systems I plug into directly.",
  },
];

export const metadata: Metadata = {
  title: "Best DJ in Fort Worth — Wedding · Corporate · Club · Private | DJ Danny West",
  description: `Hire DJ Danny West for Fort Worth events. Dallas Cowboys' official Stadium Club DJ. SiriusXM Channel 13. Bookings from $1,500.`,
  alternates: { canonical: "/dj-fort-worth" },
  openGraph: {
    title: "Best DJ in Fort Worth — DJ Danny West",
    description: "Touring-level DJ, 25 minutes from downtown Fort Worth. Bookings from $1,500.",
    url: "/dj-fort-worth",
    images: ["/og-image.jpg"],
  },
};

export default function FortWorthPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[cityServiceSchema(city), faqSchema(faq)]}
      />
      <SiteNav active="book" />
      <CityPage
        city={city}
        region="Fort Worth, TX · Tarrant County"
        eyebrow="No. 07 — Fort Worth"
        tagline="Touring-level DJ, 25 minutes from downtown. Weddings, corporate, private, club. Based in Arlington — Fort Worth is home turf."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
      />
      <Footer />
    </main>
  );
}
