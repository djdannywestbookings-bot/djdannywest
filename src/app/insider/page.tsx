import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { InsiderGate } from "@/components/insider/InsiderGate";
import { getInsiderAccess } from "@/lib/supabase/insiderAccess";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Insider — DJ Danny West",
  description:
    "Private notes, mixes, and behind-the-scenes from DJ Danny West — for subscribers and past clients only.",
  robots: { index: false, follow: false },
};

type PostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function InsiderIndexPage() {
  const access = await getInsiderAccess();

  if (!access.ok) {
    return (
      <main className="bg-night text-cream">
        <SiteNav />
        <InsiderGate state={access.reason} />
        <Footer />
      </main>
    );
  }

  // Fetch published posts via the admin client — RLS would also allow this read
  // for the authenticated subscriber, but using admin keeps a single code path.
  const admin = createAdminClient();
  const { data: posts } = await admin
    .from("posts")
    .select("slug, title, excerpt, cover_image_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  const rows = (posts ?? []) as PostRow[];

  return (
    <main className="bg-night text-cream">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-night pb-16 pt-20 md:pb-24 md:pt-24">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />
        <div className="pointer-events-none absolute -left-[10%] -top-[10%] h-[55vh] w-[55vh] rounded-full bg-ember/15 blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 md:grid-cols-12 md:px-12">
          <div className="md:col-span-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-3 h-px w-12 bg-ember/70" />
              Members only
            </div>
            <div className="mt-4 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/30">
              {access.reason === "admin"
                ? "Signed in as admin"
                : access.reason === "subscriber"
                  ? "Subscriber access"
                  : "Past-client access"}
            </div>
          </div>
          <div className="md:col-span-9">
            <h1 className="font-display font-light leading-[0.86] tracking-[-0.04em] text-cream">
              <span className="opsz-display block text-[22vw] italic text-ember md:text-[clamp(120px,14vw,260px)]">
                Insider.
              </span>
            </h1>
            <p className="mt-10 max-w-2xl font-sans text-[16px] leading-[1.65] text-cream/75 md:text-[18px]">
              Notes, crate diaries, behind-the-scenes from the road and the studio. Written for the
              people who already trust me with their floor.
            </p>
          </div>
        </div>
      </section>

      {/* POSTS LIST */}
      <section className="relative overflow-hidden border-b border-line bg-night py-20 md:py-28">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
          {rows.length === 0 ? (
            <div className="mx-auto max-w-md py-24 text-center">
              <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                First post coming soon
              </div>
              <h2 className="opsz-section mt-6 font-display text-[36px] font-light italic leading-[0.95] tracking-[-0.025em] text-cream md:text-[48px]">
                Nothing here yet.
              </h2>
              <p className="mt-6 font-sans text-[15px] leading-[1.65] text-cream/60">
                I&apos;m writing the first one now. You&apos;ll get an email when it&apos;s up.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {rows.map((p) => (
                <li key={p.slug} className="py-10 md:py-14">
                  <a
                    href={`/insider/${p.slug}`}
                    className="group grid grid-cols-1 gap-6 md:grid-cols-12"
                  >
                    <div className="md:col-span-3">
                      <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
                        {formatDate(p.published_at)}
                      </div>
                    </div>
                    <div className="md:col-span-9">
                      <h2 className="opsz-section font-display text-[clamp(28px,4vw,48px)] font-light leading-[1.02] tracking-[-0.02em] text-cream transition-colors group-hover:text-ember">
                        {p.title}
                      </h2>
                      {p.excerpt ? (
                        <p className="mt-4 max-w-2xl font-sans text-[15px] leading-[1.65] text-cream/65">
                          {p.excerpt}
                        </p>
                      ) : null}
                      <div className="mt-5 font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
                        Read post →
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
