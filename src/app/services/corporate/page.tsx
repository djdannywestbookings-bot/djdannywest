import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ServicePage } from "@/components/service/ServicePage";
import { StructuredData } from "@/components/StructuredData";
import { serviceSchema, faqSchema } from "@/lib/seo";

const intro =
  "Corporate floors aren't club floors. The room is mixed — executives, partners, spouses, plus-ones — and the brand is watching. I've worked Dallas Cowboys game-day Stadium Clubs, ESPN Super Bowl events, HBO/Top Rank fights, and brand activations from Mexico City to Tokyo. I show up clean, mix on-brand, hold the mic when you need it, and never play anything you didn't expect.";

const whatYouGet = [
  {
    label: "On-brand, on-time",
    copy: "Show prep, run-of-show alignment with your producer, pre-approved playlists if needed. No surprises. Setup well before doors.",
  },
  {
    label: "The right read",
    copy: "Award nights, holiday parties, conferences, grand openings, sales kickoffs — each room has a different energy curve. I've worked all of them. I land it.",
  },
  {
    label: "Production that scales",
    copy: "From a 60-person executive dinner to a 2,000-person activation. DJ rig, full PA, dance-floor lighting, branded visuals — scope it for the venue, quote it clean.",
  },
];

const proof = [
  "Dallas Cowboys Stadium Club — official DJ, every home game",
  "ESPN Super Bowl events — Dallas",
  "HBO Boxing / Top Rank — Dallas",
  "Professional Fight League — Dallas",
  "Golden Boy Entertainment — Dallas",
  "Brand activations — Mexico City, London, Tokyo, Manchester",
];

const faq = [
  {
    question: "Do you DJ corporate events in DFW?",
    answer:
      "Yes — corporate is a big part of my calendar. Quarterly meetings, holiday parties, sales kickoffs, conference receptions, awards nights, brand activations, grand openings. Dallas, Fort Worth, Plano, Frisco, Irving — wherever the event lands in DFW.",
  },
  {
    question: "Can you stick to a pre-approved music list?",
    answer:
      "Yes. Send me the do-play and do-not-play list ahead. I respect it. Where the brand wants creative control, you have it. Where the brand wants me to read the floor, I read the floor.",
  },
  {
    question: "Do you have liability insurance?",
    answer:
      "Yes. I carry general liability and can provide a certificate naming your venue or production company as additional insured. Most venues in DFW require this — happy to handle.",
  },
  {
    question: "How does invoicing work for corporate?",
    answer:
      "Standard corporate invoicing — terms quoted per event. Deposit holds the date, balance billed per your AP cycle (NET 30 typical). I accept ACH, wire, and Stripe.",
  },
  {
    question: "Can you provide a microphone for our CEO / hosts?",
    answer:
      "Yes. Wireless handheld + lapel mics for executives, presenters, MCs. Soundcheck before doors. I'll work with your production team on mic cues and timing.",
  },
  {
    question: "Do you have references from corporate clients?",
    answer:
      "Yes. Send your inquiry and I'll share contacts from comparable DFW corporate events on request.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "DFW Corporate DJ — Dallas · Fort Worth Event DJ for Hire | DJ Danny West",
  },
  description:
    "DFW corporate event DJ Danny West — official Dallas Cowboys Stadium Club DJ, ESPN Super Bowl, HBO Top Rank veteran. Holiday parties, sales kickoffs, brand activations, awards nights. Insured. Bookings by inquiry.",
  alternates: { canonical: "/services/corporate" },
  openGraph: {
    title: "DFW Corporate DJ — DJ Danny West",
    description:
      "Corporate event DJ for Dallas–Fort Worth. Official Cowboys DJ. Insured, on-brand, on-time.",
    url: "/services/corporate",
    images: ["/og-image.jpg"],
  },
};

export default function CorporatePage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[
          serviceSchema({
            name: "Corporate Event DJ",
            description:
              "Corporate event DJ services across Dallas–Fort Worth. Holiday parties, sales kickoffs, awards nights, brand activations. Insured, on-brand, on-time.",
            serviceType: "Corporate Event DJ",
            url: "https://djdannywest.com/services/corporate",
          }),
          faqSchema(faq),
        ]}
      />
      <SiteNav active="book" />
      <ServicePage
        service="Corporate · Galas"
        displayWord="Corporate."
        eyebrow="The corporate floor"
        tagline="Award nights, holiday parties, brand activations. Cowboys Stadium Club, Super Bowl, HBO. Insured, on-brand, on-time."
        intro={intro}
        whatYouGet={whatYouGet}
        whatYouGetHeading="What you get"
        proof={proof}
        proofHeading="Rooms I've worked"
        faq={faq}
      />
      <Footer />
    </main>
  );
}
