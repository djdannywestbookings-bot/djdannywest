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

          {/* JUST DROPPED */}
          {latest ? (
            <section className="mt-14">
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

          {/* WHAT YOU CAN DO */}
          <section className="mt-16">
            <SectionLabel>What you can do</SectionLabel>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ActionCard
                label="Free · 1 per month"
                title="Request a mix"
                body="Tell me what you want next — vibe, occasion, a reference playlist. I'll let you know when it's live. Queue-based."
                cta="Submit a request →"
                href="/account/request-mix"
                tone="cream"
              />
              <ActionCard
                label="One-time · $100 · 7-day turnaround"
                title="Custom mix"
                body="Send 8–15 songs. I build you a 60–90 minute mix that flows like a real DJ set. Wedding pre-party, gym, road trip — yours, yours only."
                cta="Order a custom mix →"
                href="/account/custom-mix"
                tone="ember"
              />
            </div>
          </section>
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
}: {
  label: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  tone: "cream" | "ember";
}) {
  const accent =
    tone === "ember"
      ? "border-ember/60 bg-gradient-to-br from-ember/[0.06] to-transparent"
      : "border-line bg-cream/[0.04]";
  return (
    <a
      href={href}
      className={`group block border ${accent} p-6 transition hover:border-cream/40`}
    >
      <div
        className={`font-sans text-[10px] uppercase tracking-[0.28em] ${
          tone === "ember" ? "text-ember" : "text-cream/55"
        }`}
      >
        {label}
      </div>
      <h3 className="mt-3 font-display text-[26px] font-light leading-tight tracking-[-0.01em] text-cream md:text-[30px]">
        {title}
      </h3>
      <p className="mt-3 font-sans text-[14px] leading-[1.6] text-cream/65">
        {body}
      </p>
      <div className="mt-5 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-cream transition group-hover:text-ember">
        {cta}
      </div>
    </a>
  );
}
