import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ServicePage } from "@/components/service/ServicePage";
import { StructuredData } from "@/components/StructuredData";
import { serviceSchema, faqSchema } from "@/lib/seo";

const intro =
  "Your wedding only happens once. I've spent twenty years reading dance floors — from the Dallas Cowboys Stadium Club to W Hotel ballrooms to backyard receptions — and the difference between a good night and a great one is the DJ. I show up early, scout the room, work the timeline with your planner, and own the floor from cocktail hour through the last song.";

const whatYouGet = [
  {
    label: "A full-event partner",
    copy: "Ceremony, cocktail hour, dinner, dance floor — one DJ, one feel, all night. MC support included.",
  },
  {
    label: "Music you actually want",
    copy: "A request system before the day. Vibe consult, do-not-play list, must-plays for the first dance, parent dances, the special people. I build the night around your story.",
  },
  {
    label: "Production that works",
    copy: "Wireless mic for toasts. Lights tuned to the room. Backup gear on site. Setup well before guests arrive — no scramble.",
  },
];

const proof = [
  "Dallas Cowboys Stadium Club weddings — Dallas",
  "Gaylord Texan Resort — Grapevine",
  "W Hotel — Dallas",
  "American Airlines Center events — Dallas",
  "House of Blues — Dallas",
  "Private estates — Highland Park, Westlake, Southlake",
  "Destination receptions — Bimini, London, Mexico City",
];

const faq = [
  {
    question: "How much does a DFW wedding DJ cost?",
    answer:
      "Wedding bookings are quoted per event based on ceremony + reception coverage, hours, travel, and any add-ons (lighting, additional speakers, photo booth, etc.). Most DFW weddings land in a similar range to top-tier vendors in the market. Send your date and venue and I'll send a clean quote within 24 hours.",
  },
  {
    question: "How early should I book a wedding DJ in DFW?",
    answer:
      "9–14 months out is typical for Saturday weddings, especially May, June, September, October, November. I'm currently booking dates into next year. If your date is firm, get on the calendar — dates lock fast.",
  },
  {
    question: "Do you provide a microphone and ceremony music?",
    answer:
      "Yes. Wireless lapel + handheld mic for the officiant, vows, toasts. Ceremony processional / recessional handled. I work with your planner on cues so the timing is dialed.",
  },
  {
    question: "Can my guests request songs?",
    answer:
      "Yes — through the dance floor, via your day-of coordinator, or pre-submitted by you. I read the floor in real time. If a request kills momentum, I'll skip it and find a smarter substitute.",
  },
  {
    question: "Do you do Latin, hip-hop, country, and open-format weddings?",
    answer:
      "Yes to all of it. Open-format is the lane I live in — Latin, hip-hop, country, top 40, house, oldies, EDM. Bi-cultural weddings are a sweet spot. Tell me the room and I'll mix to it.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "DFW Wedding DJ — Dallas · Fort Worth · Plano · Frisco | DJ Danny West",
  },
  description:
    "DFW wedding DJ Danny West — official DJ for the Dallas Cowboys, twenty years working Dallas, Fort Worth, and across Texas. Weddings, receptions, ceremonies. Open-format, bilingual, MC support included. Bookings by inquiry.",
  alternates: { canonical: "/services/weddings" },
  openGraph: {
    title: "DFW Wedding DJ — DJ Danny West",
    description:
      "DFW's official Dallas Cowboys DJ for your wedding. Ceremony through last call. Bookings by inquiry.",
    url: "/services/weddings",
    images: ["/og-image.jpg"],
  },
};

export default function WeddingsPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[
          serviceSchema({
            name: "Wedding DJ",
            description:
              "Wedding DJ services across Dallas–Fort Worth. Ceremony, cocktail, reception, dance floor. MC support included.",
            serviceType: "Wedding DJ",
            url: "https://djdannywest.com/services/weddings",
          }),
          faqSchema(faq),
        ]}
      />
      <SiteNav active="book" />
      <ServicePage
        service="Wedding DJ"
        displayWord="Weddings."
        eyebrow="The wedding"
        tagline="Ceremony to last call. Open-format reads, MC support, lighting tuned to your room. Twenty years working Dallas–Fort Worth weddings — yours is in steady hands."
        intro={intro}
        whatYouGet={whatYouGet}
        whatYouGetHeading="What you get"
        proof={proof}
        proofHeading="Rooms I know"
        faq={faq}
        currentServiceHref="/services/weddings"
      />
      <Footer />
    </main>
  );
}
