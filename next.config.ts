import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  /**
   * Exact-match SEO redirects. `/best-dj-in-dallas` and
   * `/best-dj-in-fort-worth` are high-intent URL slots — cheap to grab, and
   * they consolidate any legacy backlinks pointing at those slugs onto the
   * canonical city pages. 301 (permanent) tells Google to pass full authority
   * to the destination.
   */
  async redirects() {
    return [
      {
        source: "/best-dj-in-dallas",
        destination: "/dj-dallas",
        permanent: true,
      },
      {
        source: "/best-dj-in-fort-worth",
        destination: "/dj-fort-worth",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
