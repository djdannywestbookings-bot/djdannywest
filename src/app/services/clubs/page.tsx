import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ServicePage } from "@/components/service/ServicePage";
import { StructuredData } from "@/components/StructuredData";
import { serviceSchema, faqSchema } from "@/lib/seo";

const intro =
  "Club floors are where I got my reps in — Manchester, London, Tokyo, Bimini, Las Vegas, Mexico City, Dallas. Open-format, Latin nights, hip-hop, EDM crossovers — whatever the room is calling for, I deliver it. If you're a venue or promoter looking to book a night that actually fills the floor, you're in the right place.";

const whatYouGet = [
  {
    label: "Open-format that reads",
    copy: "Latin, hip-hop, top 40, house, throwbacks, EDM — I switch lanes when the floor asks for it. Not a playlist DJ.",
  },
  {
    label: "Touring-grade gear + reads",
    copy: "Twenty years in front of crowds. I've held floors at 200-cap dives and 2,000-cap arenas. Same posture either way.",
  },
  {
    label: "Promo support",
    copy: "Pre-flight social pushes from my channels and SiriusXM Channel 13 platform if it's the right fit. Talk to me — we'll align.",
  },
];

const proof = [
  "Club LIV — Manchester",
  "Tup Tup Palace — Newcastle",
  "UP & Down — NYC",
  "WARP — Tokyo",
  "Piccadilly — Osaka",
  "Terraza Catedral — Mexico City",
  "Saddle Ranch — Universal City",
  "Resort World — Bimini",
  "House of Blues — Las Vegas",
];

const faq = [
  {
    question: "Are you available for club bookings in DFW?",
    answer:
      "Yes — DFW dates, takeovers, and one-offs. Send your venue, the date, and your guest projection and we'll talk.",
  },
  {
    question: "Do you DJ Latin nights?",
    answer:
      "Yes. Reggaeton, banda, cumbia, merengue, salsa, bachata, plus the open-format and hip-hop crossovers Latin floors love. I run the SiriusXM Channel 13 Pitbull's Globalization mix show — Latin floors are my lane.",
  },
  {
    question: "Will you travel for a club booking?",
    answer:
      "Yes — domestic and international. I've worked floors from Manchester to Tokyo to Bimini. Quoted with travel.",
  },
  {
    question: "Do you have promo support?",
    answer:
      "I'll push the booking from my Instagram, TikTok, and where appropriate, mention through the SiriusXM Channel 13 platform. Send your flyer assets and event link.",
  },
  {
    question: "Do you bring your own equipment?",
    answer:
      "I travel with headphones, controllers, and a music drive. Most clubs provide a house rig — confirm what's on-site and I'll work with it. For custom asks (specific mixer, redundant decks) we'll talk.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "Club DJ for Hire — DFW · Worldwide Open-Format DJ | DJ Danny West",
  },
  description:
    "Book DJ Danny West for your club night — DFW or worldwide. Twenty years of open-format, Latin, hip-hop, EDM floors. Club LIV Manchester, WARP Tokyo, Saddle Ranch, Bimini. Bookings by inquiry.",
  alternates: { canonical: "/services/clubs" },
  openGraph: {
    title: "Club DJ — DJ Danny West",
    description:
      "Open-format club DJ. DFW + worldwide bookings. Twenty years of floors.",
    url: "/services/clubs",
    images: ["/og-image.jpg"],
  },
};

export default function ClubsPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[
          serviceSchema({
            name: "Club DJ",
            description:
              "Open-format club DJ for hire across DFW and worldwide. Latin nights, hip-hop, top 40, EDM crossovers. Touring credibility.",
            serviceType: "Club DJ",
            url: "https://djdannywest.com/services/clubs",
            areaServed: ["Dallas, Texas", "Fort Worth, Texas", "Worldwide"],
          }),
          faqSchema(faq),
        ]}
      />
      <SiteNav active="book" />
      <ServicePage
        service="Club · Nightlife"
        displayWord="Clubs."
        eyebrow="The club night"
        tagline="Open-format that reads the floor. Latin, hip-hop, EDM crossovers, throwbacks. Twenty years from Manchester to Tokyo to Bimini."
        intro={intro}
        whatYouGet={whatYouGet}
        whatYouGetHeading="What you get"
        proof={proof}
        proofHeading="Floors I've held"
        faq={faq}
      />
      <Footer />
    </main>
  );
}
