import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import mixesJson from "@/data/mixes.json";
import type { Mix } from "@/components/mixes/MixCard";

const mixes = mixesJson as Mix[];

const CITY_SLUGS = [
  "dj-dallas",
  "dj-fort-worth",
  "dj-arlington",
  "dj-plano",
  "dj-frisco",
  "dj-irving",
  "dj-mckinney",
  "dj-southlake",
];

const SERVICE_SLUGS = [
  "services/weddings",
  "services/quinceaneras",
  "services/corporate",
  "services/private-parties",
  "services/clubs",
  "services/school-dances",
  "services/birthdays",
];

const TOP_PAGES = ["faq"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${site.url}/mixes`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${site.url}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/merchandise`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
  const cityRoutes: MetadataRoute.Sitemap = CITY_SLUGS.map((slug) => ({
    url: `${site.url}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.92,
  }));
  const serviceRoutes: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${site.url}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));
  const topRoutes: MetadataRoute.Sitemap = TOP_PAGES.map((slug) => ({
    url: `${site.url}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));
  // Mix detail pages stay indexable so cards crawled from elsewhere still resolve;
  // the /mixes/library catalog itself is noindex (member-facing browsing only).
  const mixRoutes: MetadataRoute.Sitemap = mixes.map((m) => ({
    url: `${site.url}/mixes/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticRoutes, ...cityRoutes, ...serviceRoutes, ...topRoutes, ...mixRoutes];
}
