import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { InsiderGate } from "@/components/insider/InsiderGate";
import { getInsiderAccess } from "@/lib/supabase/insiderAccess";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderMarkdown } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Insider — DJ Danny West",
  robots: { index: false, follow: false },
};

type PostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  body_markdown: string;
  published_at: string | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InsiderPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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

  const admin = createAdminClient();
  const { data: post } = await admin
    .from("posts")
    .select("slug, title, excerpt, cover_image_url, body_markdown, published_at, status")
    .eq("slug", slug)
    .maybeSingle();

  if (!post) notFound();
  // Admins can preview drafts; anyone else only sees published posts.
  if (post.status !== "published" && access.reason !== "admin") notFound();

  const p = post as PostRow;
  const bodyHtml = renderMarkdown(p.body_markdown);

  return (
    <main className="bg-night text-cream">
      <SiteNav />

      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-line bg-night pb-16 pt-20 md:pb-24 md:pt-24">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-[10%] -top-[10%] h-[55vh] w-[55vh] rounded-full bg-ember/15 blur-[180px]" />

        <div className="relative mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-6 md:px-12">
          <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
            <div className="mb-3 h-px w-12 bg-ember/70" />
            Insider · {formatDate(p.published_at)}
          </div>
          <h1 className="opsz-display font-display text-[clamp(40px,6vw,80px)] font-light leading-[1.02] tracking-[-0.025em] text-cream">
            {p.title}
          </h1>
          {p.excerpt ? (
            <p className="max-w-2xl font-sans text-[16px] leading-[1.65] text-cream/65 md:text-[18px]">
              {p.excerpt}
            </p>
          ) : null}
        </div>
      </section>

      {/* COVER */}
      {p.cover_image_url ? (
        <section className="relative bg-night">
          <div className="mx-auto max-w-[1100px] px-6 py-12 md:px-12 md:py-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.cover_image_url}
              alt=""
              className="w-full border border-line"
            />
          </div>
        </section>
      ) : null}

      {/* BODY */}
      <section className="relative overflow-hidden border-b border-line bg-night py-16 md:py-24">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay" />
        <div className="relative mx-auto max-w-[760px] px-6 md:px-12">
          <article
            className="insider-prose"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </section>

      {/* BACK TO INDEX */}
      <section className="relative bg-night py-12 md:py-16">
        <div className="mx-auto max-w-[760px] px-6 md:px-12">
          <a
            href="/insider"
            className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
          >
            ← Back to Insider
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
