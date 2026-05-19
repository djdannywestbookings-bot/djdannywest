import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { AccountShell } from "@/components/account/AccountShell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Custom mix",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Placeholder for the $100 custom-mix product page.
 *
 * Round 2 will replace this with:
 *   - 8–15 song input rows (Spotify URL or freeform "title — artist")
 *   - Mood / vibe dropdown, target length, occasion, do-not-do
 *   - Stripe one-time checkout ($100)
 *   - On success: row in custom_mix_orders, admin email, member dashboard tracker
 *   - Admin /admin/custom-mixes queue + deliver action
 *
 * For now we render the product description + a notify-me CTA so the
 * sidebar link works and the offering is publicly visible.
 */
export default async function CustomMixPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/custom-mix");

  const displayName =
    (user.user_metadata?.name as string | undefined) ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Member";

  return (
    <main className="bg-night text-cream">
      <SiteNav />
      <div className="relative overflow-hidden bg-night">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <AccountShell
          active="custom"
          displayName={displayName}
          email={user.email ?? ""}
        >
          <header>
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
              <div className="mb-2 h-px w-10 bg-ember/70" />
              Custom mix · $100 · 7-day turnaround
            </div>
            <h1 className="mt-4 font-display text-[clamp(40px,5vw,72px)] font-light leading-[0.95] tracking-[-0.03em] text-cream">
              Your songs.{" "}
              <span className="italic text-ember">A real DJ mix.</span>
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-[16px] leading-[1.65] text-cream/75">
              Send me 8–15 songs you love. I&apos;ll blend them into a 60–90
              minute mix that flows like a real DJ set — keys, energy,
              transitions, the whole thing. For your wedding pre-party, your
              gym, your dad&apos;s 60th, your road trip. Yours, only yours.
            </p>
          </header>

          {/* WHAT YOU GET */}
          <section className="mt-12">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-2 h-px w-10 bg-ember/70" />
              What you get
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Feature
                eyebrow="60–90 minutes"
                title="Real DJ mix"
                body="Not a Spotify playlist. Properly mixed — keys, transitions, energy curve. Built like a club set."
              />
              <Feature
                eyebrow="7-day turnaround"
                title="On your calendar"
                body="From order to delivery in a week or less. Most are done in 4–5 days. You get an ETA when I start."
              />
              <Feature
                eyebrow="Download + stream"
                title="Yours forever"
                body="High-quality MP3 you can download + a private streaming link you can share with people at your event."
              />
            </div>
          </section>

          {/* COMING SOON CTA */}
          <section className="mt-12 border border-ember/40 bg-gradient-to-br from-ember/[0.08] to-transparent p-7 md:p-10">
            <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-ember">
              Ordering opens this week
            </div>
            <h2 className="mt-3 font-display text-[28px] font-light leading-tight tracking-[-0.01em] text-cream md:text-[36px]">
              Want to be first in line?
            </h2>
            <p className="mt-3 max-w-xl font-sans text-[14px] leading-[1.6] text-cream/65">
              Drop a note via the request-a-mix form — mention it&apos;s for a
              custom mix and I&apos;ll personally reach out the moment ordering
              goes live. Or just check back here in a few days.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href="/account/request-mix"
                className="group inline-flex items-center gap-2 bg-ember px-7 py-3.5 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-cream"
              >
                Reach out via request form
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="/account"
                className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
              >
                Back to dashboard
              </a>
            </div>
          </section>

          {/* THE PROCESS */}
          <section className="mt-14">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-2 h-px w-10 bg-ember/70" />
              How it&apos;ll work
            </div>
            <ol className="mt-5 space-y-5 border-y border-cream/10 py-5">
              {[
                {
                  n: "01",
                  t: "You order + send your songs",
                  b: "Stripe checkout ($100). On the same page you drop 8–15 song titles or Spotify links, plus the vibe and length you want.",
                },
                {
                  n: "02",
                  t: "I confirm + start building",
                  b: "Within 24 hours I email you confirming the brief is clear and giving you a delivery ETA.",
                },
                {
                  n: "03",
                  t: "I deliver inside 7 days",
                  b: "MP3 download + private streaming link in your member dashboard + email. You own the mix.",
                },
              ].map((step) => (
                <li key={step.n} className="grid grid-cols-12 gap-4">
                  <div className="col-span-2 font-sans text-[11px] uppercase tracking-[0.32em] text-ember md:col-span-1">
                    {step.n}
                  </div>
                  <div className="col-span-10 md:col-span-11">
                    <div className="font-display text-[19px] text-cream">
                      {step.t}
                    </div>
                    <div className="mt-1 font-sans text-[13px] leading-[1.6] text-cream/60">
                      {step.b}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </AccountShell>
      </div>
      <Footer />
    </main>
  );
}

function Feature({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-line bg-cream/[0.04] p-5">
      <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-ember">
        {eyebrow}
      </div>
      <div className="mt-3 font-display text-[20px] font-light text-cream">
        {title}
      </div>
      <p className="mt-2 font-sans text-[13px] leading-[1.55] text-cream/60">
        {body}
      </p>
    </div>
  );
}
