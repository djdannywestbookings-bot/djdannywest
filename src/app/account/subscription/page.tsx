import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { CancelButton } from "@/components/subscribe/CancelButton";

export const metadata: Metadata = {
  title: "Your subscription",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function fmtDate(s: string | null): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return s;
  }
}

function fmtMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function AccountSubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/subscription");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select(
      "id, status, amount_cents, currency, cadence, started_at, current_period_end, canceled_at, created_at",
    )
    .eq("member_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: comps } = await supabase
    .from("comp_grants")
    .select("id, reason, expires_at, created_at")
    .eq("member_id", user.id)
    .is("revoked_at", null)
    .order("created_at", { ascending: false });

  const hasComp = comps && comps.length > 0;
  const isActiveSub = sub?.status === "ACTIVE";

  return (
    <main className="bg-night text-cream">
      <SiteNav />
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-20 md:pt-24">
        <Link
          href="/account"
          className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
        >
          ← Member dashboard
        </Link>

        <p className="mt-6 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
          — Your subscription
        </p>
        <h1 className="mt-3 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[72px]">
          The <span className="italic text-ember">membership.</span>
        </h1>

        <div className="mt-12 space-y-8">
          {/* Active subscription */}
          {isActiveSub && sub && (
            <div className="border-t-2 border-ember/70 bg-cream/[0.03] p-7">
              <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-ember">
                ✓ Active
              </div>
              <div className="mt-3 font-serif text-[28px] tracking-[-0.01em] text-cream">
                {fmtMoney(sub.amount_cents, sub.currency)} / {sub.cadence.toLowerCase()}
              </div>
              <dl className="mt-6 space-y-3 font-sans text-[13px]">
                <Row label="Status" value={sub.status} />
                <Row label="Started" value={fmtDate(sub.started_at)} />
                <Row label="Current period ends" value={fmtDate(sub.current_period_end)} />
                {sub.canceled_at && (
                  <Row label="Canceled" value={fmtDate(sub.canceled_at)} />
                )}
              </dl>
              <div className="mt-8 border-t border-line/60 pt-6">
                <CancelButton />
              </div>
            </div>
          )}

          {/* Active comp */}
          {!isActiveSub && hasComp && (
            <div className="border-t-2 border-cream/70 bg-cream/[0.03] p-7">
              <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/85">
                ✓ Comp access
              </div>
              <div className="mt-3 font-serif text-[24px] tracking-[-0.01em] text-cream">
                You&apos;ve got free access — courtesy of Danny.
              </div>
              {(comps ?? []).map((c) => (
                <dl key={c.id} className="mt-6 space-y-2 font-sans text-[13px]">
                  <Row label="Reason" value={c.reason} />
                  <Row label="Granted" value={fmtDate(c.created_at)} />
                  <Row
                    label="Expires"
                    value={c.expires_at ? fmtDate(c.expires_at) : "Open-ended"}
                  />
                </dl>
              ))}
            </div>
          )}

          {/* No active access — show subscribe CTA */}
          {!isActiveSub && !hasComp && (
            <div className="border border-dashed border-cream/25 p-7">
              <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/65">
                — Not subscribed yet
              </div>
              <div className="mt-3 font-serif text-[28px] tracking-[-0.01em] text-cream">
                Streaming locks until you&apos;re a member.
              </div>
              <p className="mt-3 font-sans text-[14px] leading-relaxed text-cream/65">
                $20/month. Cancel any time. New mixes uploaded weekly.
              </p>
              <Link
                href="/subscribe"
                className="mt-6 inline-flex bg-cream px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
              >
                Subscribe →
              </Link>
            </div>
          )}

          {/* Past sub (canceled) */}
          {sub && sub.status !== "ACTIVE" && !hasComp && (
            <div className="border border-line bg-cream/[0.02] p-7 opacity-80">
              <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/55">
                Most recent subscription · {sub.status}
              </div>
              <dl className="mt-4 space-y-2 font-sans text-[13px]">
                <Row label="Status" value={sub.status} />
                <Row label="Started" value={fmtDate(sub.started_at)} />
                {sub.canceled_at && (
                  <Row label="Canceled" value={fmtDate(sub.canceled_at)} />
                )}
              </dl>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line/60 pb-2 last:border-0">
      <dt className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/45">
        {label}
      </dt>
      <dd className="font-sans text-[13px] text-cream/85">{value}</dd>
    </div>
  );
}
