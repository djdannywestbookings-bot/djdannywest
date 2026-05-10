/**
 * Site-wide constants. Single source of truth for SEO + structured data + footer.
 * Edit values here and they propagate everywhere.
 */
export const site = {
  name: "DJ Danny West",
  shortName: "Danny West",
  url: "https://djdannywest.com",
  description:
    "DJ Danny West — Dallas / Fort Worth DJ. Official DJ for the Dallas Cowboys and SiriusXM Channel 13 Pitbull's Globalization. Bookings start at $1,500 for weddings, corporate events, clubs, and private parties.",
  tagline: "Sets that move rooms.",
  city: "Arlington",
  region: "TX",
  country: "US",
  // Areas Danny actively serves — used for SEO + areaServed schema.
  areaServed: [
    "Dallas, Texas",
    "Fort Worth, Texas",
    "Arlington, Texas",
    "DFW Metroplex",
    "Worldwide",
  ],
  email: "djdannywestbookings@gmail.com",
  phone: "+1-817-308-6615",
  // Used as the priceRange marker on LocalBusiness schema.
  priceRange: "$$$",
  // Known places Danny has played (used in schema + city pages).
  notableVenues: [
    "Dallas Cowboys Stadium Club",
    "American Airlines Center, Dallas",
    "W Hotel Dallas",
    "Gaylord Texan Resort",
    "House of Blues Las Vegas",
    "Club LIV Manchester",
    "WARP Tokyo",
    "Resort World Bimini",
    "SXSW Austin",
  ],
  // Tour highlights for schema + cite-able authority.
  notableTours: [
    "50 Cent — Final Lap Tour (2023)",
    "Pitbull — Can't Stop Us Now Tour (2022, 2023)",
    "Enrique Iglesias × Ricky Martin Tour (2021)",
    "Red Bull 3Style — Santiago, Chile (2018)",
  ],
};
