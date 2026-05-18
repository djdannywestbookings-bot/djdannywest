import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ServicePage } from "@/components/service/ServicePage";
import { StructuredData } from "@/components/StructuredData";
import { serviceSchema, faqSchema } from "@/lib/seo";

const intro =
  "Sweet 16s, milestone birthdays — 30, 40, 50, 60 — and birthday club takeovers. Birthdays are personal, and the read is everything: this is the music of someone's life. Send me the playlist they've been making since college, the songs from their wedding, the throwbacks they cry to, and I'll build the night. Bilingual if it's that kind of party. Open-format always.";

const whatYouGet = [
  {
    label: "A night built around the person",
    copy: "Pre-event playlist consult. Their wedding song, their college anthem, their dad's go-to, their kid's TikTok hit — all in. Open-format energy, personal feel.",
  },
  {
    label: "Sweet 16s + milestones",
    copy: "Sweet 16 entrance, surprise dance, candle ceremony. Milestone parties with toasts, slideshow music, and the right pacing.",
  },
  {
    label: "MC + production",
    copy: "Wireless mics for toasts. Lighting tuned for the room. Optional photo booth, uplighting, dance floor wash. Quoted clean for your space.",
  },
];

const proof = [
  "Private estates — DFW + Highland Park + Westlake",
  "Country clubs — Plano, Frisco, Southlake",
  "Hotel ballrooms — Dallas, Fort Worth",
  "Backyard + rooftop venues across DFW",
];

const faq = [
  {
    question: "Do you DJ birthday parties in DFW?",
    answer:
      "Yes — Sweet 16s, milestone birthdays (30, 40, 50, 60), surprise parties, birthday club takeovers. Dallas, Fort Worth, Plano, Frisco, Arlington, Irving, McKinney, Southlake.",
  },
  {
    question: "Can I send you my Spotify or playlist as a brief?",
    answer:
      "Please do. I build the night around it. Your must-plays hit, your do-not-plays are respected, and I fill the rest with the right energy curve for the crowd.",
  },
  {
    question: "How long do you play for a birthday party?",
    answer:
      "Most bookings are 3–5 hours of active DJing. Optional dinner playlist before, optional after-hours extension. Quoted per the hour and scope.",
  },
  {
    question: "Do you do Sweet 16s in Spanish?",
    answer:
      "Yes — fully bilingual. Reggaeton, banda, cumbia, merengue, salsa, bachata, alongside English-language hip-hop and top 40. MC duties in English, Spanish, or both.",
  },
  {
    question: "Can you handle the surprise reveal moment?",
    answer:
      "Yes. Tell me the cue, the song, the lighting move. I work it with your coordinator. Confetti drop, intro reel, video on screens — I align with whoever's handling production.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "Birthday DJ DFW — Sweet 16 · Milestone Birthday DJ Dallas | DJ Danny West",
  },
  description:
    "Birthday party DJ for Dallas–Fort Worth. Sweet 16s, milestone birthdays, surprise parties, club takeovers. Bilingual, open-format, MC included. DJ Danny West. Bookings by inquiry.",
  alternates: { canonical: "/services/birthdays" },
  openGraph: {
    title: "Birthday DJ DFW — DJ Danny West",
    description:
      "Sweet 16s, milestones, surprise parties. DFW birthday DJ. Bookings by inquiry.",
    url: "/services/birthdays",
    images: ["/og-image.jpg"],
  },
};

export default function BirthdaysPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[
          serviceSchema({
            name: "Birthday Party DJ",
            description:
              "Birthday party DJ services across DFW. Sweet 16s, milestone birthdays, surprise parties, club takeovers. Bilingual + open-format.",
            serviceType: "Birthday Party DJ",
            url: "https://djdannywest.com/services/birthdays",
          }),
          faqSchema(faq),
        ]}
      />
      <SiteNav active="book" />
      <ServicePage
        service="Birthdays"
        displayWord="Birthdays."
        eyebrow="The birthday"
        tagline="Sweet 16s, milestone birthdays, surprise parties, club takeovers. A night built around the songs of someone's life."
        intro={intro}
        whatYouGet={whatYouGet}
        whatYouGetHeading="What you get"
        proof={proof}
        proofHeading="Where I've played"
        faq={faq}
      />
      <Footer />
    </main>
  );
}
