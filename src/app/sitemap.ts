import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import mixesJson from "@/data/mixes.json";
import type { Mix } from "@/components/mixes/MixCard";

const mixes = mixesJson as Mix[];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${site.url}/mixes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/dj-dallas`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/dj-fort-worth`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
  ];
  const mixRoutes: MetadataRoute.Sitemap = mixes.map((m) => ({
    url: `${site.url}/mixes/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticRoutes, ...mixRoutes];
}
