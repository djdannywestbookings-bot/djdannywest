import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ServicePage } from "@/components/service/ServicePage";
import { StructuredData } from "@/components/StructuredData";
import { serviceSchema, faqSchema } from "@/lib/seo";

const intro =
  "Quinces are not weddings. The energy, the family dynamic, the music — different rules. I run the SiriusXM Channel 13 mix show with Pitbull and I've worked rooms across Texas, Mexico, and Latin America. Latin music isn't a section in my crate — it's the whole crate. Your quince gets the full DJ I am, in two languages, with the cultural reads to match.";

const whatYouGet = [
  {
    label: "Bilingual, bicultural fluency",
    copy: "Reggaeton, banda, cumbia, merengue, salsa, bachata, hip-hop, top 40 — and the read to know when each one lands. MC duties handled in English, Spanish, or both.",
  },
  {
    label: "The vals, the surprise dance, the rest",
    copy: "Choreographed waltzes, surprise dances, padrinos toasts, court entrances — I've MC'd dozens. Cues with your coordinator down to the second.",
  },
  {
    label: "Family-first energy",
    copy: "Grandparents on the dance floor. Tías taking over the mic. Cousins out until midnight. I read the room — not just the birthday girl — and keep all three generations in.",
  },
];

const proof = [
  "SiriusXM Channel 13 — Pitbull's Globalization (mix show)",
  "Pitbull — Can't Stop Us Now Tour (2022, 2023)",
  "Enrique Iglesias × Ricky Martin Tour (2021)",
  "Latin Life Festival — London",
  "Terraza Catedral — Mexico City",
  "Private quinces — DFW, Houston, San Antonio",
];

const faq = [
  {
    question: "Do you DJ quinceañeras in Spanish?",
    answer:
      "Yes — fully bilingual. MC duties in English, Spanish, or both. The music crate is built for Latin floors: reggaeton, banda, cumbia, merengue, salsa, bachata, alongside English-language hip-hop and top 40 your court will request.",
  },
  {
    question: "Have you DJed a vals before?",
    answer:
      "Many. I have the standard repertoire and I'll work from whatever song the choreographer picked. I cue with your coordinator so the entrance, vals, surprise dance, padrinos, and toasts all hit on time.",
  },
  {
    question: "How long does a quinceañera DJ stay?",
    answer:
      "Most quinces I cover 5–7 hours of reception. I'm happy to also handle reception entrance music after the mass, dinner playlist, and the full dance floor — whichever scope makes sense for your run-of-show.",
  },
  {
    question: "How much is a DFW quinceañera DJ?",
    answer:
      "Quoted per event. Hours, travel, gear scope, and any add-ons (uplighting, photo booth, additional MC time) drive the number. Send your date and venue and I'll send a clean quote.",
  },
  {
    question: "Can guests request songs?",
    answer:
      "Yes. Pre-list your must-plays and do-not-plays. Day-of, guests can request through me or your coordinator. I read the floor and keep the energy on the right side of the line.",
  },
  {
    question: "Do you have lighting and a sound system?",
    answer:
      "I bring my DJ rig. Full PA, uplighting, and dance-floor lighting can be added depending on your venue size and look. Send the venue and I'll scope it.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "DFW Quinceañera DJ — Bilingual Latin DJ Dallas · Fort Worth | DJ Danny West",
  },
  description:
    "DFW quinceañera DJ Danny West — SiriusXM Channel 13 Pitbull's Globalization mix show coordinator. Fully bilingual MC, Latin + open-format crate, vals + surprise dance handled. Bookings by inquiry.",
  alternates: { canonical: "/services/quinceaneras" },
  openGraph: {
    title: "DFW Quinceañera DJ — DJ Danny West",
    description:
      "Bilingual quinceañera DJ for Dallas–Fort Worth. SiriusXM Latin mix-show coordinator. Bookings by inquiry.",
    url: "/services/quinceaneras",
    images: ["/og-image.jpg"],
  },
};

export default function QuinceanerasPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[
          serviceSchema({
            name: "Quinceañera DJ",
            description:
              "Bilingual quinceañera DJ services across Dallas–Fort Worth. Vals, surprise dance, full reception. Latin + open-format crate.",
            serviceType: "Quinceañera DJ",
            url: "https://djdannywest.com/services/quinceaneras",
          }),
          faqSchema(faq),
        ]}
      />
      <SiteNav active="book" />
      <ServicePage
        service="Quinceañera DJ"
        displayWord="Quinces."
        eyebrow="The quinceañera"
        tagline="Bilingual, bicultural, fluent in the music your family actually requests. SiriusXM Latin mix-show coordinator — your fifteen is in the right hands."
        intro={intro}
        whatYouGet={whatYouGet}
        whatYouGetHeading="What you get"
        proof={proof}
        proofHeading="The credibility"
        faq={faq}
      />
      <Footer />
    </main>
  );
}
