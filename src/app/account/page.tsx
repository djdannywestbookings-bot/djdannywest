import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { AccountShell } from "@/components/account/AccountShell";
import { createClient } from "@/lib/supabase/server";
import {
  getLatestMix,
  getSeriesWithLatestMix,
  type DbMix,
  type DbSeries,
} from "@/lib/mixes/queries";

export const metadata: Metadata = {
  title: "Member Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const NEW_WINDOW_DAYS = 14;

function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const day = 1000 * 60 * 60 * 24;
  if (diffMs < day) return "today";
  const days = Math.floor(diffMs / day);
  if (days < 14) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 8) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

function isNew(iso: string | null): boolean {
  if (!iso) return false;
  return Date.now() - new Date(iso).getTime() < NEW_WINDOW_DAYS * 86400000;
}

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [latest, seriesWithLatest] = await Promise.all([
    getLatestMix(),
    getSeriesWithLatestMix(),
  ]);

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
          active="dashboard"
          displayName={displayName}
          email={user.email ?? ""}
        >
          {/* WELCOME */}
          <header>
            <h1 className="opsz-display font-display text-[clamp(40px,5vw,72px)] font-light leading-[0.95] tracking-[-0.03em] text-cream">
              <span className="italic">Welcome back,</span>
              <br />
              <span className="text-ember">{displayName}.</span>
            </h1>
          </header>

          {/* WHAT YOU CAN DO — pinned high so it stays a sales opportunity */}
          <section className="mt-12">
            <SectionLabel>What you can do</SectionLabel>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ActionCard
                label="Free · 1 per month"
                title="Request a mix"
                body="Tell me what you want next — vibe, occasion, a reference playlist. I'll let you know when it's live. Queue-based."
                cta="Submit a request"
                href="/account/request-mix"
                tone="cream"
                badge="Included"
              />
              <ActionCard
                label="One-time · 7-day turnaround"
                title="Custom mix"
                body="Send 8–15 songs. I build you a 60–90 minute mix that flows like a real DJ set. Wedding pre-party, gym, road trip — yours, yours only."
                cta="Order — $100"
                href="/account/custom-mix"
                tone="ember"
                badge="$100"
              />
            </div>
          </section>

          {/* JUST DROPPED */}
          {latest ? (
            <section className="mt-16">
              <SectionLabel>Just dropped</SectionLabel>
              <JustDroppedCard mix={latest} />
            </section>
          ) : null}

          {/* YOUR SERIES */}
          {seriesWithLatest.length > 0 ? (
            <section className="mt-16">
              <SectionLabel>Your series</SectionLabel>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {seriesWithLatest.map(({ series, latest }) => (
                  <SeriesShelfCard
                    key={series.id}
                    series={series}
                    latest={latest}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </AccountShell>
      </div>
      <Footer />
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
      <div className="mb-2 h-px w-10 bg-ember/70" />
      {children}
    </div>
  );
}

function JustDroppedCard({ mix }: { mix: DbMix }) {
  const newFlag = isNew(mix.published_at);
  return (
    <a
      href={`/mixes/${mix.slug}`}
      className="group grid grid-cols-1 gap-6 overflow-hidden border border-line bg-cream/[0.04] transition hover:border-cream/40 md:grid-cols-[260px_1fr]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-night-soft md:aspect-auto">
        {mix.cover_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={mix.cover_url}
            alt={`${mix.title} cover`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-[48px] text-cream/20">
            ♫
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
        <div>
          <div className="flex items-center gap-3">
            {newFlag ? (
              <span className="inline-flex items-center gap-1.5 bg-ember px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.28em] text-night">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-night" />
                New
              </span>
            ) : null}
            <span className="font-sans text-[11px] uppercase tracking-[0.32em] text-cream/45">
              {timeAgo(mix.published_at)}
            </span>
          </div>
          <h2 className="mt-5 font-display text-[clamp(28px,3.5vw,44px)] font-light leading-[1.0] tracking-[-0.02em] text-cream">
            {mix.title}
          </h2>
          {mix.subtitle ? (
            <p className="mt-2 font-sans text-[14px] leading-snug text-cream/55">
              {mix.subtitle}
            </p>
          ) : null}
        </div>
        <div className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-ember transition group-hover:text-cream">
          Listen now
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </a>
  );
}

function SeriesShelfCard({
  series,
  latest,
}: {
  series: DbSeries;
  latest: DbMix | null;
}) {
  const newFlag = latest && isNew(latest.published_at);
  return (
    <a
      href={`/mixes/series/${series.slug}`}
      className="group flex flex-col gap-4 border border-line bg-cream/[0.03] p-5 transition hover:border-cream/40"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-night-soft">
        {series.cover_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={series.cover_url}
            alt={`${series.title} cover`}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-[40px] text-cream/15">
            ♫
          </div>
        )}
        {newFlag ? (
          <span className="absolute right-3 top-3 bg-ember px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.28em] text-night">
            New
          </span>
        ) : null}
      </div>
      <div>
        <h3 className="font-display text-[20px] font-light leading-tight tracking-[-0.005em] text-cream">
          {series.title}
        </h3>
        {latest ? (
          <p className="mt-2 font-sans text-[12px] leading-snug text-cream/55">
            Latest:{" "}
            <span className="text-cream/80">
              {latest.volume ? `Vol ${String(latest.volume).padStart(2, "0")}` : latest.title}
            </span>
            <br />
            <span className="text-cream/40">{timeAgo(latest.published_at)}</span>
          </p>
        ) : (
          <p className="mt-2 font-sans text-[12px] leading-snug text-cream/40">
            New volumes coming soon.
          </p>
        )}
      </div>
    </a>
  );
}

function ActionCard({
  label,
  title,
  body,
  cta,
  href,
  tone,
  badge,
}: {
  label: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  tone: "cream" | "ember";
  badge?: string;
}) {
  // Two distinct treatments so the cards visually contrast each other AND
  // the dark page surface. Both have:
  //   - a thick top accent bar (cream or ember)
  //   - a brighter card body (cream tint or ember glow) so they pop
  //   - a corner badge for premium pricing
  //   - a hover lift + glow ring for tactile feel
  if (tone === "ember") {
    return (
      <a
        href={href}
        className="group relative block overflow-hidden border border-ember/70 bg-[radial-gradient(ellipse_at_top_left,_rgba(229,185,122,0.22),_rgba(10,9,7,0.0)_60%)] bg-night/80 p-8 shadow-[0_0_0_1px_rgba(229,185,122,0.05),0_30px_80px_-30px_rgba(229,185,122,0.25)] transition-all duration-500 hover:-translate-y-1 hover:border-ember hover:shadow-[0_0_0_1px_rgba(229,185,122,0.15),0_40px_100px_-30px_rgba(229,185,122,0.45)]"
      >
        {/* Top accent bar */}
        <span className="absolute inset-x-0 top-0 h-[3px] bg-ember" />
        {/* Corner badge */}
        {badge ? (
          <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 border border-ember/60 bg-night/80 px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.28em] text-ember backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
            {badge}
          </span>
        ) : null}
        <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
          {label}
        </div>
        <h3 className="mt-4 font-display text-[32px] font-light leading-[1.0] tracking-[-0.015em] text-cream md:text-[40px]">
          {title}
        </h3>
        <p className="mt-4 max-w-md font-sans text-[14px] leading-[1.65] text-cream/75 md:text-[15px]">
          {body}
        </p>
        <div className="mt-6 inline-flex items-center gap-3 bg-ember px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition group-hover:bg-cream">
          {cta}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </a>
    );
  }
  return (
    <a
      href={href}
      className="group relative block overflow-hidden border border-cream/15 bg-[linear-gradient(180deg,_rgba(245,241,234,0.08)_0%,_rgba(245,241,234,0.03)_100%)] p-8 shadow-[0_0_0_1px_rgba(245,241,234,0.03),0_20px_60px_-30px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-1 hover:border-cream/45 hover:bg-[linear-gradient(180deg,_rgba(245,241,234,0.12)_0%,_rgba(245,241,234,0.05)_100%)]"
    >
      {/* Top accent bar */}
      <span className="absolute inset-x-0 top-0 h-[3px] bg-cream/70" />
      {/* Corner badge */}
      {badge ? (
        <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 border border-cream/30 bg-night/60 px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.28em] text-cream/85 backdrop-blur-sm">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cream/85" />
          {badge}
        </span>
      ) : null}
      <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/65">
        {label}
      </div>
      <h3 className="mt-4 font-display text-[32px] font-light leading-[1.0] tracking-[-0.015em] text-cream md:text-[40px]">
        {title}
      </h3>
      <p className="mt-4 max-w-md font-sans text-[14px] leading-[1.65] text-cream/70 md:text-[15px]">
        {body}
      </p>
      <div className="mt-6 inline-flex items-center gap-3 border border-cream/40 bg-cream/[0.04] px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-cream transition group-hover:border-cream group-hover:bg-cream group-hover:text-night">
        {cta}
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </a>
  );
}
