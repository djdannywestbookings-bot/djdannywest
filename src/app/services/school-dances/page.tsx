import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { ServicePage } from "@/components/service/ServicePage";
import { StructuredData } from "@/components/StructuredData";
import { serviceSchema, faqSchema } from "@/lib/seo";

const intro =
  "Proms, homecomings, school dances, and college mixers. Teen and student floors are their own animal — high energy, fast turnaround, and content that has to clear school district guidelines. I've handled it. Clean-edit crate, MC reads dialed for the age group, and the kind of energy that turns a gym into a club for a night.";

const whatYouGet = [
  {
    label: "Clean-edit crate",
    copy: "Every track radio-edited or clean version. School-appropriate. I keep the heat on without crossing the line.",
  },
  {
    label: "Floor energy",
    copy: "Proms, homecomings, sweethearts dances. Top 40, Latin, hip-hop, throwbacks, K-pop, country line dances — whatever the school requests.",
  },
  {
    label: "Lighting + sound that scales",
    copy: "Gyms, ballrooms, hotel banquet rooms. Full PA, dance-floor lighting, fog if your school approves it. Quoted clean for your room.",
  },
];

const proof = [
  "Public + private high school proms across DFW",
  "Homecoming dances — DFW + suburbs",
  "College mixers + Greek events",
  "School district fundraisers + galas",
];

const faq = [
  {
    question: "Do you DJ high school proms in DFW?",
    answer:
      "Yes. Proms, homecomings, winter formals, end-of-year dances across DFW. Public and private. Clean-edit crate, school-approved content, MC reads dialed for the age group.",
  },
  {
    question: "What's your music policy for school events?",
    answer:
      "Clean versions only — no explicit content. Pre-approved playlist if your administration requires it. I work with student councils and event coordinators to build the night.",
  },
  {
    question: "Do you handle requests on-site?",
    answer:
      "Yes. I read the floor in real time and take requests through your event coordinator. If a track gets flagged, I'll swap to something with the same energy that fits the rules.",
  },
  {
    question: "Are you available for college mixers?",
    answer:
      "Yes. Greek life events, university mixers, college sponsorship activations, semester kickoffs. I've worked the format.",
  },
  {
    question: "What's a typical school dance DJ booking?",
    answer:
      "Quoted per event. Hours, venue, lighting/sound scope, and any add-ons (MC time, prom court announcements, photo booth) drive the number. Send your date and venue.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "School Dance DJ DFW — Prom · Homecoming DJ Dallas | DJ Danny West",
  },
  description:
    "School dance DJ for Dallas–Fort Worth. Proms, homecomings, college mixers. Clean-edit crate, school-appropriate MC, full lighting + sound. DJ Danny West. Bookings by inquiry.",
  alternates: { canonical: "/services/school-dances" },
  openGraph: {
    title: "School Dance DJ DFW — DJ Danny West",
    description:
      "Prom + homecoming DJ for DFW. Clean-edit crate, school-approved.",
    url: "/services/school-dances",
    images: ["/og-image.jpg"],
  },
};

export default function SchoolDancesPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[
          serviceSchema({
            name: "School Dance / Prom DJ",
            description:
              "School dance DJ services across DFW — proms, homecomings, college mixers. Clean-edit crate, school-appropriate content.",
            serviceType: "School Dance DJ",
            url: "https://djdannywest.com/services/school-dances",
          }),
          faqSchema(faq),
        ]}
      />
      <SiteNav active="book" />
      <ServicePage
        service="School dances · Proms"
        displayWord="Proms."
        eyebrow="The student floor"
        tagline="Proms, homecomings, college mixers. Clean-edit crate, school-approved content, MC reads dialed for the age group — energy that turns a gym into a club."
        intro={intro}
        whatYouGet={whatYouGet}
        whatYouGetHeading="What you get"
        proof={proof}
        proofHeading="Where I've played"
        faq={faq}
        currentServiceHref="/services/school-dances"
      />
      <Footer />
    </main>
  );
}
