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
    question: "Do you DJ Fort Worth weddings?",
    answer:
      "Yes. I'm based in Arlington, 25 minutes from downtown Fort Worth. Weddings are a regular part of what I do — full reception, cocktail hour, ceremony coverage on request.",
  },
  {
    question: "Why hire you over a local Fort Worth DJ?",
    answer:
      "Same metro, bigger résumé. I'm the official DJ for the Dallas Cowboys Stadium Club, mix-show coordinator on SiriusXM, and I've toured with 50 Cent, Pitbull, and Enrique Iglesias. Touring-level DJ at a local-DJ travel cost.",
  },
  {
    question: "Will you travel out to Westlake / Aledo / Mansfield / Granbury?",
    answer:
      "Yes — I cover the entire Fort Worth metro. Travel beyond about 30 miles from Arlington gets a small travel addition, scoped per inquiry.",
  },
  {
    question: "Do you bring sound and lighting?",
    answer:
      "I bring my DJ equipment — decks, mixer, headphones, microphone — whichever setup sounds best for the room. Full PA and lighting can be quoted separately depending on venue size and guest count. Inquire and we'll scope it.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "Earlier is better. Most Friday and Saturday clients book me a year out — I'm already booked into next March. If I'm free, I'm yours; but dates lock in fast. Send your inquiry and once we're aligned a deposit holds the date. There's no such thing as too early.",
  },
  {
    question: "Who's the best DJ in Fort Worth?",
    answer:
      "The honest answer: the one with the strongest résumé who's actually worked the rooms you care about. My credential is real — official DJ for the Dallas Cowboys Stadium Club (AT&T Stadium is Tarrant County — my home turf), mix-show coordinator on SiriusXM Channel 13, tours with 50 Cent and Pitbull. Twenty years working DFW rooms. Read the reviews, check who your venue and planner actually recommend, then inquire and we'll see if the date lines up.",
  },
  {
    question: "What's the average cost of a wedding DJ in Fort Worth?",
    answer:
      "Fort Worth wedding DJ pricing runs the same four tiers as the broader DFW market — roughly $800–$1,500 (starter), $1,500–$3,000 (experienced), $3,000–$6,000 (premium/full production), $6,000+ (celebrity/high profile). I sit in the top two tiers depending on scope. The free 10-page DFW Wedding DJ Pricing Guide at /wedding-dj-guide breaks down what's actually included at each price point.",
  },
  {
    question: "What Fort Worth venues have you played?",
    answer:
      "AT&T Stadium (Cowboys home games — every one since 2016), Sundance Square events, Westlake estate weddings, Aledo and Granbury private parties, Gaylord Texan in Grapevine (DFW corridor), Professional Fight League DFW events, and dozens of Fort Worth country clubs, hotel ballrooms, and private residences. If your venue isn't on the list, I do a site visit — no charge.",
  },
  {
    question: "Can you DJ a bilingual English + Spanish Fort Worth event?",
    answer:
      "Yes — bicultural DFW weddings and quinceañeras are a sweet spot. I'm the mix-show coordinator on SiriusXM Channel 13 (Pitbull's Globalization), toured with Pitbull and Enrique Iglesias × Ricky Martin, and I mix cumbia, reggaetón, hip-hop, and open format natively. English and Spanish MC available as needed.",
  },
  {
    question: "Do you DJ Fort Worth corporate events and galas?",
    answer:
      "Yes. Corporate galas, product launches, awards nights, brand activations — I've worked ESPN Super Bowl broadcasts, HBO Boxing, Red Bull 3Style, and dozens of DFW corporate rooms. Professional, on-brand, on-time. Send the brief and I'll send a quote.",
  },
  {
    question: "Are you insured for Fort Worth venues?",
    answer:
      "Yes. I carry professional liability and equipment insurance and can send a COI naming your Fort Worth venue as additional insured. Most major Fort Worth and Tarrant County venues require this — I've submitted to all of them before.",
  },
  {
    question: "What makes you different from other Fort Worth DJs?",
    answer:
      "Three things. The credential is real — Cowboys Stadium Club official DJ (AT&T Stadium sits in Tarrant County, so this IS my home venue), SiriusXM Channel 13, world tours. That's a résumé most Fort Worth DJs can't match. You're not being handed off — you inquire, I answer, I plan your night, I show up. And the mix is native open-format across Latin, hip-hop, house, and top 40 — what a bicultural Fort Worth crowd actually needs.",
  },
];

export const metadata: Metadata = {
  title: { absolute: "Best DJ in Fort Worth — Wedding · Corporate · Club · Private | DJ Danny West" },
  description: `Hire DJ Danny West for Fort Worth events. Dallas Cowboys' official Stadium Club DJ. SiriusXM Channel 13. Bookings by inquiry — make an offer.`,
  alternates: { canonical: "/dj-fort-worth" },
  openGraph: {
    title: "Best DJ in Fort Worth — DJ Danny West",
    description: "Touring-level DJ, 25 minutes from downtown Fort Worth. Bookings by inquiry.",
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
        eyebrow="Fort Worth"
        tagline="Touring-level DJ, 25 minutes from downtown. Weddings, corporate, private, club. Based in Arlington — Fort Worth is home turf. Bookings by inquiry."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
        currentCityHref="/dj-fort-worth"
      />
      <Footer />
    </main>
  );
}
