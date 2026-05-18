import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { CityPage } from "@/components/city/CityPage";
import { StructuredData } from "@/components/StructuredData";
import { cityServiceSchema, faqSchema } from "@/lib/seo";

const city = "McKinney";

const intro =
  "McKinney weddings — Stone Crest, Adriatica Village, The Brik, Tribute Ranch — and the historic downtown square scene. Country clubs, private estates across Collin County, corporate floors as Collin County's tech footprint expands. Official Dallas Cowboys Stadium Club DJ. The DJ Dallas books for its highest-stakes nights, also working McKinney every weekend.";

const doing = [
  {
    label: "Weddings",
    copy: "Stone Crest, Adriatica Village, The Brik, Tribute Ranch, private estates. Ceremony through last call.",
  },
  {
    label: "Country clubs · Galas",
    copy: "Stonebridge Ranch, Eldorado Country Club, Heritage Ranch. Wedding receptions, fundraisers, awards nights.",
  },
  {
    label: "Private · Quinces",
    copy: "Bilingual Latin DJ. Backyard parties, birthdays, anniversaries across Collin County.",
  },
];

const rooms = [
  "Stone Crest Venue — McKinney",
  "Adriatica Village — McKinney",
  "The Brik — McKinney",
  "Tribute Ranch — McKinney",
  "Stonebridge Ranch Country Club — McKinney",
  "Eldorado Country Club — McKinney",
  "Heritage Ranch — McKinney",
  "Sheraton McKinney",
];

const faq = [
  {
    question: "Are you a McKinney DJ?",
    answer:
      "Yes. I'm based in Arlington and work McKinney regularly. Stone Crest, Adriatica, The Brik, country clubs across Collin County. Same DJ Dallas books, no out-of-town markup.",
  },
  {
    question: "Do you DJ Stone Crest Venue weddings?",
    answer:
      "Yes — Stone Crest is a regular venue on my wedding calendar. I know the room, the load-in, and what works in the space.",
  },
  {
    question: "Do you DJ weddings at Adriatica Village?",
    answer:
      "Yes. The chapel, the courtyard, the reception spaces — I work Adriatica weddings throughout the year.",
  },
  {
    question: "How early should I book a McKinney wedding DJ?",
    answer:
      "9–14 months for Saturday weddings, especially spring and fall. Get your date on the calendar early.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "McKinney DJ — Stone Crest · Adriatica · Wedding DJ McKinney TX | DJ Danny West",
  },
  description:
    "McKinney DJ for hire — DJ Danny West, official Dallas Cowboys Stadium Club DJ. Stone Crest, Adriatica Village, The Brik, country clubs — weddings, corporate, quinceañeras. Bookings by inquiry.",
  alternates: { canonical: "/dj-mckinney" },
  openGraph: {
    title: "McKinney DJ — DJ Danny West",
    description:
      "Stone Crest, Adriatica Village, The Brik weddings. Cowboys' official DJ. Bookings by inquiry.",
    url: "/dj-mckinney",
    images: ["/og-image.jpg"],
  },
};

export default function McKinneyPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData schemas={[cityServiceSchema(city), faqSchema(faq)]} />
      <SiteNav active="book" />
      <CityPage
        city={city}
        region="McKinney, TX · Collin County · DFW"
        eyebrow="McKinney"
        tagline="Stone Crest, Adriatica Village, The Brik, Tribute Ranch. Country clubs and private estates across Collin County."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
      />
      <Footer />
    </main>
  );
}
