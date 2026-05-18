import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ServicePage } from "@/components/service/ServicePage";
import { StructuredData } from "@/components/StructuredData";
import { serviceSchema, faqSchema } from "@/lib/seo";

const intro =
  "Backyard rooftops, birthday parties, anniversary dinners, pool parties, holiday house parties — the unofficial floors I love working. No corporate run-of-show, no wedding timeline. Just the energy of a great host and a room that wants to dance. Tell me the vibe, the crowd, and the playlist you've been building all year — I'll bring everything else.";

const whatYouGet = [
  {
    label: "Whatever the vibe is",
    copy: "Latin night, dive-bar throwback, Y2K hits, dad-rock summer cookout, dinner-party house — your party, your read. I bring the crate and the energy curve.",
  },
  {
    label: "Setup that works in your space",
    copy: "House parties, rooftops, backyards, ranch venues, private clubs. I scope the power, the speaker placement, the dance-floor zone before the day so it's plug-in and play.",
  },
  {
    label: "MC on demand",
    copy: "Birthday toasts, host announcements, surprise moments. Mic handy when you need it, invisible when you don't.",
  },
];

const proof = [
  "Private estates — Highland Park, Westlake, Southlake, Frisco",
  "Resort World — Bimini, Bahamas",
  "Saddle Ranch — Universal City",
  "Birthday + anniversary parties — DFW",
  "Holiday house parties — Dallas + Fort Worth",
];

const faq = [
  {
    question: "Do you DJ private house parties in DFW?",
    answer:
      "Yes — backyard rooftops, anniversary dinners, birthday parties, pool parties, holiday parties. If your home or venue has power and space for a DJ rig, I can work it.",
  },
  {
    question: "What if my space doesn't have great sound?",
    answer:
      "I scope your venue before the day. Most homes work with my rig. Rooftops or larger backyards may need additional speakers — quoted clean before the event.",
  },
  {
    question: "Do you do themed nights — Latin, country, hip-hop, throwback?",
    answer:
      "Yes. Latin nights, country line-dance nights, hip-hop birthday parties, Y2K-only throwbacks, house dinner parties — tell me the theme and I'll mix to it. Open-format is my lane; themed nights are sharper still.",
  },
  {
    question: "How long do you play for a private party?",
    answer:
      "Most private bookings are 3–5 hours of active DJing. Optional dinner playlist before, optional after-hours. Quoted by the hour and the scope.",
  },
  {
    question: "Can I send you a Spotify playlist as a reference?",
    answer:
      "Yes — please do. I'll build the night around it. Your must-plays land, your do-not-plays are respected, and I fill in the rest with the right energy curve.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "Private Party DJ DFW — Birthday · House · Rooftop DJ Dallas | DJ Danny West",
  },
  description:
    "Private party DJ for Dallas–Fort Worth. Birthdays, anniversaries, rooftops, backyards, holiday parties. Open-format, themed nights, MC on demand. Bookings by inquiry.",
  alternates: { canonical: "/services/private-parties" },
  openGraph: {
    title: "Private Party DJ DFW — DJ Danny West",
    description:
      "House parties, rooftops, birthdays, anniversaries. DFW private DJ. Bookings by inquiry.",
    url: "/services/private-parties",
    images: ["/og-image.jpg"],
  },
};

export default function PrivatePartiesPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[
          serviceSchema({
            name: "Private Party DJ",
            description:
              "Private party DJ services across Dallas–Fort Worth. Birthdays, anniversaries, house parties, rooftops, holiday parties.",
            serviceType: "Private Party DJ",
            url: "https://djdannywest.com/services/private-parties",
          }),
          faqSchema(faq),
        ]}
      />
      <SiteNav active="book" />
      <ServicePage
        service="Private parties"
        displayWord="Private."
        eyebrow="The house party"
        tagline="Backyards, rooftops, birthdays, anniversaries. Whatever the vibe is — Latin night, throwback, dinner-party house — I bring the crate and the energy."
        intro={intro}
        whatYouGet={whatYouGet}
        whatYouGetHeading="What you get"
        proof={proof}
        proofHeading="Where I've played"
        faq={faq}
        currentServiceHref="/services/private-parties"
      />
      <Footer />
    </main>
  );
}
