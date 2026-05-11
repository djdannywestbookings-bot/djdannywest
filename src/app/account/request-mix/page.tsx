import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { submitMixRequest } from "./actions";

export const metadata: Metadata = {
  title: "Request a mix",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const LABEL = "font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55";
const INPUT =
  "w-full border-0 border-b border-line bg-transparent py-3 font-sans text-[15px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none focus:ring-0";

export default async function RequestMixPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/request-mix");

  // Pull this member's recent requests (newest first)
  const { data: requests } = await supabase
    .from("mix_requests")
    .select("id, title, status, created_at, fulfilled_mix_id, admin_response")
    .eq("member_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

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
          — Request a mix
        </p>
        <h1 className="mt-3 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[72px]">
          Tell me <span className="italic text-ember">what to make.</span>
        </h1>
        <p className="mt-6 max-w-xl font-sans text-[14px] leading-relaxed text-cream/65">
          Drop the vibe, the occasion, a playlist for reference — anything that helps me
          know what you want to hear. One request per member per month so the queue stays
          honest. You&apos;ll get an email when it&apos;s live.
        </p>

        <form action={submitMixRequest} className="mt-12 space-y-7 border border-line bg-cream/[0.02] p-7">
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
              className="w-full border border-line bg-night/40 p-3 font-sans text-[14px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="group inline-flex items-center gap-3 bg-cream px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
            >
              Submit request{" "}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </form>

        {/* Past requests */}
        {requests && requests.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-[28px] tracking-[-0.01em]">Your requests</h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {requests.map((r) => (
                <div key={r.id} className="grid grid-cols-12 gap-4 py-4">
                  <div className="col-span-12 md:col-span-7">
                    <div className="font-serif text-[17px] text-cream">
                      {r.title || "Untitled request"}
                    </div>
                    {r.admin_response && (
                      <div className="mt-1 font-sans text-[12px] italic text-cream/70">
                        Danny: {r.admin_response}
                      </div>
                    )}
                  </div>
                  <div className="col-span-6 md:col-span-3 font-sans text-[11px] uppercase tracking-[0.22em]">
                    <StatusPill status={r.status} />
                  </div>
                  <div className="col-span-6 md:col-span-2 text-right font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
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
    <span className={`inline-block border ${m.cls} px-2.5 py-1 text-[10px] uppercase tracking-[0.22em]`}>
      {m.label}
    </span>
  );
}
