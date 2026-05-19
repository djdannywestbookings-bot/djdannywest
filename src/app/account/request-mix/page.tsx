import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { AccountShell } from "@/components/account/AccountShell";
import { createClient } from "@/lib/supabase/server";
import { submitMixRequest } from "./actions";

export const metadata: Metadata = {
  title: "Request a mix",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const LABEL = "font-sans text-[10px] uppercase tracking-[0.32em] text-cream/65";
const INPUT =
  "w-full border-0 border-b border-cream/15 bg-transparent py-3 font-sans text-[15px] text-cream placeholder:text-cream/35 focus:border-ember focus:outline-none focus:ring-0 transition";

export default async function RequestMixPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/request-mix");

  const { data: requests } = await supabase
    .from("mix_requests")
    .select("id, title, status, created_at, fulfilled_mix_id, admin_response")
    .eq("member_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

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
          active="request"
          displayName={displayName}
          email={user.email ?? ""}
        >
          {/* HEADER */}
          <header>
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-2 h-px w-10 bg-ember/70" />
              Request a mix · Free · 1 per month
            </div>
            <h1 className="mt-4 font-display text-[clamp(40px,5vw,72px)] font-light leading-[0.95] tracking-[-0.03em] text-cream">
              Tell me <span className="italic text-ember">what to make.</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-[15px] leading-relaxed text-cream/70">
              Drop the vibe, the occasion, a reference playlist — anything that
              helps me know what you want to hear next. One request per month so
              the queue stays honest. You&apos;ll get an email when it&apos;s live.
            </p>
          </header>

          {/* FORM CARD — brighter, ember-edge, clearly a workspace */}
          <section className="mt-10 border border-cream/15 bg-cream/[0.05] p-7 md:p-9">
            <div className="mb-5 inline-flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-ember" />
              <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                New request
              </span>
            </div>
            <form action={submitMixRequest} className="space-y-8">
              <div>
                <label htmlFor="title" className={LABEL}>
                  Title or theme (optional)
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="A summer rooftop set"
                  className={INPUT}
                />
              </div>

              <div>
                <label htmlFor="mood_tags" className={LABEL}>
                  Mood / genre tags (comma separated)
                </label>
                <input
                  id="mood_tags"
                  name="mood_tags"
                  type="text"
                  placeholder="latin, peak time, sunset"
                  className={INPUT}
                />
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-7">
                  <label htmlFor="occasion" className={LABEL}>
                    Occasion
                  </label>
                  <input
                    id="occasion"
                    name="occasion"
                    type="text"
                    placeholder="Workout / dinner party / road trip / wedding"
                    className={INPUT}
                  />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <label htmlFor="desired_length_minutes" className={LABEL}>
                    Desired length (minutes)
                  </label>
                  <input
                    id="desired_length_minutes"
                    name="desired_length_minutes"
                    type="number"
                    min={15}
                    max={240}
                    step={15}
                    placeholder="60"
                    className={INPUT}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="spotify_playlist_url" className={LABEL}>
                  Spotify playlist (optional reference)
                </label>
                <input
                  id="spotify_playlist_url"
                  name="spotify_playlist_url"
                  type="url"
                  placeholder="https://open.spotify.com/playlist/..."
                  className={INPUT}
                />
              </div>

              <div>
                <label htmlFor="notes" className={LABEL}>
                  Anything else
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="I love the vibe of Sunset 003 — something in that lane but with more 80s."
                  className="w-full border border-cream/15 bg-night/40 p-3 font-sans text-[14px] text-cream placeholder:text-cream/35 focus:border-ember focus:outline-none transition"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 bg-ember px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-cream"
                >
                  Submit request
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </form>
          </section>

          {/* PAST REQUESTS — high-contrast list */}
          {requests && requests.length > 0 ? (
            <section className="mt-14">
              <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
                <div className="mb-2 h-px w-10 bg-ember/70" />
                Your requests
              </div>
              <div className="mt-5 divide-y divide-cream/10 border-y border-cream/10">
                {requests.map((r) => (
                  <div key={r.id} className="grid grid-cols-12 gap-4 py-5">
                    <div className="col-span-12 md:col-span-7">
                      <div className="font-display text-[18px] text-cream">
                        {r.title || "Untitled request"}
                      </div>
                      {r.admin_response ? (
                        <div className="mt-1 font-sans text-[12px] italic text-cream/65">
                          Danny: {r.admin_response}
                        </div>
                      ) : null}
                    </div>
                    <div className="col-span-6 md:col-span-3 font-sans">
                      <StatusPill status={r.status} />
                    </div>
                    <div className="col-span-6 md:col-span-2 text-right font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
                      {new Date(r.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* CROSS-SELL TO CUSTOM MIX */}
          <section className="mt-14 border border-ember/30 bg-gradient-to-br from-ember/[0.08] to-transparent p-7 md:p-9">
            <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-ember">
              Need it faster · Want it built around your songs
            </div>
            <h2 className="mt-3 font-display text-[28px] font-light leading-tight tracking-[-0.01em] text-cream md:text-[34px]">
              Order a <span className="italic">custom mix.</span>
            </h2>
            <p className="mt-3 max-w-xl font-sans text-[14px] leading-[1.6] text-cream/65">
              $100 · 7-day turnaround. Send 8–15 songs, I build the mix around
              them. Wedding pre-party, gym, anniversary, road trip — yours and
              only yours. No queue.
            </p>
            <a
              href="/account/custom-mix"
              className="mt-5 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-ember transition hover:text-cream"
            >
              Order a custom mix →
            </a>
          </section>
        </AccountShell>
      </div>
      <Footer />
    </main>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    open: { label: "Open", cls: "border-cream/30 text-cream/65" },
    in_progress: { label: "In progress", cls: "border-ember/60 text-ember" },
    fulfilled: { label: "Fulfilled", cls: "border-cream/60 text-cream" },
    declined: { label: "Declined", cls: "border-cream/20 text-cream/45" },
  };
  const m = map[status] ?? map.open;
  return (
    <span
      className={`inline-block border ${m.cls} px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]`}
    >
      {m.label}
    </span>
  );
}
