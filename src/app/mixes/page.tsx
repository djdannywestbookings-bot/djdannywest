import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { MixesPitch } from "@/components/mixes/MixesPitch";

export const metadata: Metadata = {
  title: "Exclusive DJ Danny West Mixes — Subscribe",
  description:
    "Live-recorded DJ sets across every genre, every vibe. A non-stop party in your headphones. New mixes every week. Lossless audio. Subscribers only — $20/month.",
};

export default function MixesPage() {
  return (
    <main className="bg-night text-cream">
      <SiteNav active="mixes" />
      <MixesPitch />
      <Footer />
    </main>
  );
}
