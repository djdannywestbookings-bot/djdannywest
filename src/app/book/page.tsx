import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { BookHero } from "@/components/book/BookHero";
import { BookForm } from "@/components/book/BookForm";

export const metadata: Metadata = {
  title: "Book a DFW DJ — Wedding · Corporate · Quinceañera Inquiry",
  description:
    "Book DJ Danny West for your Dallas–Fort Worth wedding, corporate event, quinceañera, or private party. Official Dallas Cowboys Stadium Club DJ. Bookings by inquiry — describe your event and I respond personally within 24 hours.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <main className="bg-night text-cream">
      <SiteNav active="book" />
      <BookHero />

      <section className="mx-auto max-w-[1100px] px-6 pb-32 pt-20 md:px-12 md:pb-40 md:pt-24">
        <div className="mb-12">
          <h2 className="opsz-section font-display text-[36px] font-light leading-[0.95] tracking-[-0.025em] text-cream md:text-[44px]">
            <span className="italic">Tell me</span> about your event.
          </h2>
        </div>

        <BookForm />
      </section>

      <Footer />
    </main>
  );
}
