import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { BookHero } from "@/components/book/BookHero";
import { BookForm } from "@/components/book/BookForm";

export const metadata: Metadata = {
  title: "Book Danny West — From $1,500",
  description:
    "Book DJ Danny West for your wedding, corporate event, club, or private party. Bookings start at $1,500. Custom quotes — I respond within 24 hours.",
};

export default function BookPage() {
  return (
    <main className="bg-night text-cream">
      <SiteNav active="book" />
      <BookHero />

      <section className="mx-auto max-w-[1100px] px-6 pb-32 pt-20 md:px-12 md:pb-40 md:pt-24">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              No. 05 — The Inquiry
            </div>
          </div>
          <div className="md:col-span-9">
            <h2 className="opsz-section font-display text-[36px] font-light leading-[0.95] tracking-[-0.025em] text-cream md:text-[44px]">
              <span className="italic">Tell me</span> about your event.
            </h2>
          </div>
        </div>

        <BookForm />
      </section>

      <Footer />
    </main>
  );
}
