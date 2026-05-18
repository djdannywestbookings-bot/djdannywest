import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { CityPage } from "@/components/city/CityPage";
import { StructuredData } from "@/components/StructuredData";
import { cityServiceSchema, faqSchema } from "@/lib/seo";

const city = "Arlington";

const intro =
  "I live in Arlington. I work out of Arlington. The official Dallas Cowboys Stadium Club DJ — that's me, at AT&T Stadium, every home game. If your wedding, corporate event, or party is in Arlington, you're hiring the local guy who happens to also be the team's DJ. No travel fee. No out-of-town markup. Same calendar as the Cowboys.";

const doing = [
  {
    label: "AT&T Stadium · Globe Life",
    copy: "Dallas Cowboys Stadium Club every home game. Texas Rangers events. Wedding receptions and corporate floors at both stadium club spaces.",
  },
  {
    label: "Weddings",
    copy: "Live by Loews, Sheraton Arlington, Texas Live!, private estates across Arlington. Ceremony through last call.",
  },
  {
    label: "Private · Quinces",
    copy: "Bilingual Latin DJ, vals + surprise dance handled. Backyard birthdays, anniversaries, themed nights.",
  },
];

const rooms = [
  "Dallas Cowboys Stadium Club — AT&T Stadium",
  "Globe Life Field — Texas Rangers",
  "Live! by Loews — Arlington",
  "Sheraton Arlington Hotel",
  "Texas Live! — Arlington",
  "Esports Stadium Arlington",
  "Arlington Convention Center",
  "Top Golf Arlington corporate events",
];

const faq = [
  {
    question: "Are you actually based in Arlington?",
    answer:
      "Yes. Live here, work out of here, and I'm the official DJ for the Dallas Cowboys Stadium Club at AT&T Stadium every home game. If your event is in Arlington, you're hiring the local guy.",
  },
  {
    question: "Do you charge a travel fee for Arlington events?",
    answer:
      "No travel fee for Arlington. I'm local. The savings go into the quote.",
  },
  {
    question: "Have you worked AT&T Stadium events?",
    answer:
      "Every home game since 2016 — the Stadium Club. I also DJ private events held at AT&T Stadium and at Live! by Loews.",
  },
  {
    question: "Do you DJ Arlington weddings?",
    answer:
      "Yes. Live! by Loews, Sheraton, Texas Live!, private estates — Arlington weddings are a regular part of my Saturday calendar.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "Arlington DJ — Cowboys Stadium Club · Wedding · Corporate | DJ Danny West",
  },
  description:
    "Arlington DJ for hire — DJ Danny West, official Dallas Cowboys Stadium Club DJ at AT&T Stadium. Live! by Loews, Sheraton, Texas Live! — weddings, corporate, quinceañeras. Local — no travel fee. Bookings by inquiry.",
  alternates: { canonical: "/dj-arlington" },
  openGraph: {
    title: "Arlington DJ — DJ Danny West",
    description:
      "The local Cowboys DJ. Arlington weddings, corporate, private parties. No travel fee.",
    url: "/dj-arlington",
    images: ["/og-image.jpg"],
  },
};

export default function ArlingtonPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData schemas={[cityServiceSchema(city), faqSchema(faq)]} />
      <SiteNav active="book" />
      <CityPage
        city={city}
        region="Arlington, TX · DFW Metroplex"
        eyebrow="Arlington"
        tagline="Cowboys' official DJ at AT&T Stadium. Live! by Loews, Sheraton, Texas Live!, private estates. Local — no travel fee."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
        currentCityHref="/dj-arlington"
      />
      <Footer />
    </main>
  );
}
