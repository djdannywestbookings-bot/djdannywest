import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { CityPage } from "@/components/city/CityPage";
import { StructuredData } from "@/components/StructuredData";
import { cityServiceSchema, faqSchema } from "@/lib/seo";

const city = "Dallas";

const intro =
  "I'm the official DJ for the Dallas Cowboys Stadium Club every home game, mix-show coordinator on SiriusXM Channel 13 (Pitbull's Globalization), and I've held the booth for clients and venues across the Dallas metro since 2006. If your event is in Dallas, you don't need to fly anyone in — I'm here.";

const doing = [
  {
    label: "Weddings",
    copy: "Cocktail through dance floor. Reads the room, builds the night, hands the mic when it matters.",
  },
  {
    label: "Corporate · Galas",
    copy: "Receptions, awards nights, brand activations. Clean, on-brand, on-time.",
  },
  {
    label: "Clubs · Private",
    copy: "Open format, Latin, hip-hop, house. Bottle service rooms to backyard rooftops.",
  },
];

const rooms = [
  "Dallas Cowboys Stadium Club — official DJ, every home game",
  "American Airlines Center, Dallas",
  "W Hotel Dallas",
  "Gaylord Texan Resort — Grapevine",
  "Concrete Cowboy — Dallas",
  "Golden Boy Entertainment — Dallas",
  "Professional Fight League — Dallas",
  "ESPN Super Bowl — Dallas",
  "HBO Boxing / Top Rank — Dallas",
];

const faq = [
  {
    question: "Do you DJ Dallas weddings?",
    answer:
      "Yes. Weddings are a big part of what I do — cocktail hour through last call, MC support included, dance-floor reads dialed in.",
  },
  {
    question: "Are you really the Dallas Cowboys' DJ?",
    answer:
      "Yes. I've been the official DJ for the Dallas Cowboys Stadium Club every home game since 2016. I work with their entertainment team year-round.",
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
    question: "Who's the best DJ in Dallas for weddings?",
    answer:
      "Ask twenty planners in Dallas that question and you'll get twenty answers — the honest one is: hire the DJ who's actually worked the rooms you care about. I've played weddings at the W Hotel Dallas, the Gaylord Texan, private estates in Highland Park, and the Cowboys Stadium Club. Twenty years reading DFW dance floors. Read the venue reviews and check who the planners you like actually book. Then send me an inquiry and we'll talk.",
  },
  {
    question: "What's the average cost of a wedding DJ in Dallas?",
    answer:
      "DFW wedding DJ pricing spans four honest tiers — roughly $800–$1,500 (starter), $1,500–$3,000 (experienced), $3,000–$6,000 (premium/full-production), and $6,000+ (celebrity/high-profile). I sit in the top two tiers depending on scope. There's a free 10-page guide breaking this down — the DFW Wedding DJ Pricing Guide — that walks through what's actually included at each price point. Get it at /wedding-dj-guide.",
  },
  {
    question: "What Dallas venues have you played?",
    answer:
      "Cowboys Stadium Club (every home game since 2016), American Airlines Center, W Hotel Dallas, Gaylord Texan Resort in Grapevine, Concrete Cowboy, ESPN Super Bowl broadcasts, HBO Boxing / Top Rank events, private estates in Highland Park and Preston Hollow, and dozens of hotels, country clubs, and event venues across the Dallas metro. If you're at a venue I haven't worked, I do a site visit — no charge.",
  },
  {
    question: "Do you DJ Highland Park, Preston Hollow, and Uptown Dallas events?",
    answer:
      "Yes — Highland Park estates and Preston Hollow private residences are a regular part of what I do. Uptown, Design District, Deep Ellum, Bishop Arts — I know the rooms, I know the load-in doors, I know which venues have house sound. Tell me the address and I'll tell you what to expect.",
  },
  {
    question: "Can you DJ a bilingual English + Spanish Dallas wedding?",
    answer:
      "Yes — bicultural DFW weddings are a sweet spot. I'm the mix-show coordinator on SiriusXM Channel 13 (Pitbull's Globalization), I've toured with Pitbull and Enrique Iglesias × Ricky Martin, and I run bilingual sets natively — cumbia into hip-hop into reggaetón into open format, English and Spanish MC as needed. If your event has an abuelita and a groomsman who wants Drake, we're aligned.",
  },
  {
    question: "Do you do open format for Dallas clubs and nightlife?",
    answer:
      "Yes. I've held residencies and guest spots at Dallas nightlife rooms and the international circuit — House of Blues Vegas, Club LIV Manchester, WARP Tokyo, UP & Down NYC. Open format, Latin, hip-hop, house — whichever way the room needs to go, I go.",
  },
  {
    question: "Are you insured for Dallas venues?",
    answer:
      "Yes — I carry professional liability and equipment insurance, and I can send a COI (certificate of insurance) naming your venue as additional insured on request. Most Dallas venues (Gaylord Texan, W Hotel, Adolphus, Four Seasons) require this and I've submitted to all of them before.",
  },
  {
    question: "What makes you different from other DJs in Dallas?",
    answer:
      "Three things. First, the credential is real — Cowboys Stadium Club official DJ, SiriusXM Channel 13, tours with 50 Cent and Pitbull. That means the reading-the-room instinct is trained on stages you'd recognize. Second, you're not being handed off. You inquire, I answer. I plan your night. I show up. No sub-contractor swap. Third, the mix is native open-format across Latin, hip-hop, house, and top 40 — which is what a bicultural DFW crowd actually needs. Anyone can play a Spotify playlist. That's not what you're paying for.",
  },
];

export const metadata: Metadata = {
  title: { absolute: "Best DJ in Dallas — Wedding · Corporate · Club · Private | DJ Danny West" },
  description: `Hire DJ Danny West — official DJ for the Dallas Cowboys Stadium Club, SiriusXM Channel 13. ${intro}`,
  alternates: { canonical: "/dj-dallas" },
  openGraph: {
    title: "Best DJ in Dallas — DJ Danny West",
    description: "Official Dallas Cowboys DJ. Weddings, corporate, club, private. Bookings by inquiry.",
    url: "/dj-dallas",
    images: ["/og-image.jpg"],
  },
};

export default function DallasPage() {
  return (
    <main className="bg-night text-cream">
      <StructuredData
        schemas={[cityServiceSchema(city), faqSchema(faq)]}
      />
      <SiteNav active="book" />
      <CityPage
        city={city}
        region="Dallas, TX · DFW Metroplex"
        eyebrow="Dallas"
        tagline="Weddings, corporate floors, clubs, private events. Based in Arlington, working Dallas every weekend. You talk to me, you book me."
        intro={intro}
        doing={doing}
        rooms={rooms}
        faq={faq}
        currentCityHref="/dj-dallas"
      />
      <Footer />
    </main>
  );
}
