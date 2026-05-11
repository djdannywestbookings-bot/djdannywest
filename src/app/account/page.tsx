import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

export const metadata: Metadata = {
  title: "Member Dashboard",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="bg-night text-cream">
      <SiteNav />
      <section className="relative overflow-hidden bg-night pb-24 pt-20 md:pb-32 md:pt-24">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[15%] -top-[15%] h-[55vh] w-[55vh] rounded-full bg-ember/12 blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              Member · Dashboard
            </div>
          </div>
          <div className="md:col-span-9">
            <h1 className="opsz-display font-display text-[clamp(48px,6vw,96px)] font-light leading-[0.92] tracking-[-0.04em] text-cream">
              <span className="italic">Welcome,</span>
              <br />
              <span className="text-ember">
                {user.user_metadata?.name || user.email?.split("@")[0] || "Member"}.
              </span>
            </h1>
            <p className="mt-8 max-w-xl font-sans text-[16px] leading-[1.65] text-cream/65">
              You&apos;re signed in as{" "}
              <span className="text-cream">{user.email}</span>. The full member
              dashboard — mix request form, custom mix orders, listening
              history — ships in the next milestone alongside Square
              subscriptions.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="border-t-2 border-ember/70 bg-cream/[0.03] p-7">
                <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">— 01</div>
                <div className="opsz-text mt-4 font-display text-[22px] leading-tight text-cream">Browse the library</div>
                <p className="mt-3 font-sans text-[14px] leading-[1.6] text-cream/60">
                  Streaming unlocks once subscriptions ship. Until then, browse
                  the catalog and queue what you want first.
                </p>
                <a href="/mixes/library" className="mt-5 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-cream transition hover:text-ember">
                  Open library →
                </a>
              </div>
              <div className="border-t-2 border-ember/70 bg-cream/[0.03] p-7">
                <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">— 02</div>
                <div className="opsz-text mt-4 font-display text-[22px] leading-tight text-cream">Book a private event</div>
                <p className="mt-3 font-sans text-[14px] leading-[1.6] text-cream/60">
                  Members get a courtesy discount on your first booking.
                </p>
                <a href="/book" className="mt-5 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-cream transition hover:text-ember">
                  Send inquiry →
                </a>
              </div>
            </div>

            <form action={signOut} className="mt-16">
              <button
                type="submit"
                className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/55 transition hover:text-ember"
              >
                ← Sign out
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
