import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { MixesPitch } from "@/components/mixes/MixesPitch";

export const metadata: Metadata = {
  title: "Subscribe — Mixes by DJ Danny West",
  description:
    "Full archive of mixes from DJ Danny West — sets recorded for SiriusXM, residencies, weddings, and rooms you couldn't be in. New mixes released weekly. Subscribers only — $20/month.",
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
