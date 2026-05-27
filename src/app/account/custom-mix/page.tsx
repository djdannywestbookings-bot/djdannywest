import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { AccountShell } from "@/components/account/AccountShell";
import {
  CustomMixOrderForm,
  type SeriesOption,
} from "@/components/custom-mix/CustomMixOrderForm";
import { createClient } from "@/lib/supabase/server";
import { getStripeConfig } from "@/lib/stripe/client";
import { getAllSeries } from "@/lib/mixes/queries";

export const metadata: Metadata = {
  title: "Custom mix",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type OrderRow = {
  id: string;
  status: string;
  amount_cents: number;
  vibe: string | null;
  target_length_minutes: number | null;
  occasion: string | null;
  created_at: string;
  delivered_at: string | null;
  delivery_mix_url: string | null;
};

function statusLabel(s: string): { label: string; cls: string } {
  switch (s) {
    case "pending_payment":
      return { label: "Awaiting payment", cls: "border-cream/30 text-cream/65" };
    case "paid":
      return { label: "Paid · in queue", cls: "border-cream/50 text-cream" };
    case "in_progress":
      return { label: "Building it now", cls: "border-ember/60 text-ember" };
    case "delivered":
      return { label: "Delivered", cls: "border-cream/60 text-cream" };
    case "refunded":
      return { label: "Refunded", cls: "border-cream/20 text-cream/45" };
    default:
      return { label: s, cls: "border-cream/20 text-cream/55" };
  }
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CustomMixPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/custom-mix");

  const cfg = getStripeConfig();
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || null;
  const stripeReady = !!cfg && !!publishableKey;

  // Pull all series so the form can offer "inspired by" multi-select cards.
  const seriesList = await getAllSeries();
  const seriesOptions: SeriesOption[] = seriesList.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    subtitle: s.subtitle,
    cover_url: s.cover_url,
  }));

  // Load member's past orders (newest first)
  const { data: orders } = await supabase
    .from("custom_mix_orders")
    .select(
      "id, status, amount_cents, vibe, target_length_minutes, occasion, created_at, delivered_at, delivery_mix_url",
    )
    .eq("member_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const rows = (orders ?? []) as OrderRow[];

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
            <p className="mt-6 max-w-2xl font-sans text-[15px] leading-[1.65] text-cream/70">
              Send me 8–15 songs you love. I&apos;ll blend them into a 60–90
              minute mix that flows like a real DJ set — keys, energy,
              transitions, the whole thing. Yours, only yours. Delivered in 7
              days or less.
            </p>
          </header>

          {/* PAST ORDERS — only shown if any exist */}
          {rows.length > 0 ? (
            <section className="mt-12">
              <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
                <div className="mb-2 h-px w-10 bg-ember/70" />
                Your orders
              </div>
              <ul className="mt-5 divide-y divide-cream/10 border-y border-cream/10">
                {rows.map((o) => {
                  const s = statusLabel(o.status);
                  return (
                    <li
                      key={o.id}
                      className="grid grid-cols-12 gap-3 py-5"
                    >
                      <div className="col-span-12 md:col-span-6">
                        <div className="font-display text-[18px] text-cream">
                          {o.occasion || "Custom mix"}
                        </div>
                        <div className="mt-1 font-sans text-[12px] text-cream/55">
                          {o.vibe ? `${o.vibe} · ` : ""}
                          {o.target_length_minutes ? `${o.target_length_minutes} min · ` : ""}
                          ${(o.amount_cents / 100).toFixed(0)}
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-3">
                        <span
                          className={`inline-block border ${s.cls} px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.22em]`}
                        >
                          {s.label}
                        </span>
                        {o.delivery_mix_url ? (
                          <a
                            href={o.delivery_mix_url}
                            target="_blank"
                            rel="noopener"
                            className="ml-3 inline-flex items-center gap-1 font-sans text-[11px] uppercase tracking-[0.22em] text-ember transition hover:text-cream"
                          >
                            Listen / Download →
                          </a>
                        ) : null}
                      </div>
                      <div className="col-span-6 text-right font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45 md:col-span-3">
                        Ordered {fmtDate(o.created_at)}
                        {o.delivered_at ? (
                          <>
                            <br />
                            <span className="text-ember">
                              Delivered {fmtDate(o.delivered_at)}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

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

          {/* ORDER FORM / CHECKOUT */}
          <section className="mt-14">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-2 h-px w-10 bg-ember/70" />
              {rows.length > 0 ? "Order another" : "Order your custom mix"}
            </div>
            <div className="mt-5 border border-cream/15 bg-cream/[0.04] p-6 md:p-8">
              {stripeReady ? (
                <CustomMixOrderForm
                  publishableKey={publishableKey}
                  seriesOptions={seriesOptions}
                />
              ) : (
                <div className="font-sans text-[14px] text-cream/65">
                  Custom mix ordering is currently offline. Send a note via
                  {" "}
                  <a
                    href="/account/request-mix"
                    className="text-ember underline decoration-ember/40 underline-offset-[5px] transition hover:text-cream"
                  >
                    /account/request-mix
                  </a>
                  {" "}
                  and I&apos;ll reply personally.
                </div>
              )}
            </div>
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
