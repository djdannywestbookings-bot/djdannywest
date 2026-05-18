import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPost } from "./actions";

export const dynamic = "force-dynamic";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  published_at: string | null;
  updated_at: string;
};

function fmt(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminPostsPage() {
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, slug, title, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  const rows = (posts ?? []) as PostRow[];

  return (
    <div className="space-y-12">
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
          — Insider posts
        </p>
        <h1 className="mt-4 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
          The <span className="italic text-ember">notes.</span>
        </h1>
        <p className="mt-4 max-w-xl font-sans text-[14px] leading-[1.6] text-cream/55">
          Members-only blog. Active subscribers and past booking clients see published posts.
          Publishing fires an email blast to all eligible members.
        </p>
      </div>

      {/* NEW POST */}
      <section className="border border-line bg-cream/[0.02] p-6">
        <h2 className="font-serif text-[22px]">New post</h2>
        <form action={createPost} className="mt-5 grid grid-cols-12 gap-4">
          <FormField className="col-span-12 md:col-span-8" label="Title">
            <input
              name="title"
              required
              placeholder="What I'm playing right now"
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[15px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12 md:col-span-4" label="Slug (auto from title if blank)">
            <input
              name="slug"
              placeholder="what-im-playing"
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12" label="Excerpt (1–2 sentences shown on the index)">
            <input
              name="excerpt"
              placeholder="A few of the records doing damage in DFW rooms this month."
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12" label="Cover image URL (optional)">
            <input
              name="cover_image_url"
              type="url"
              placeholder="https://…"
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12" label="Body (Markdown)">
            <textarea
              name="body_markdown"
              rows={10}
              placeholder={`## Section heading\n\nA paragraph here…\n\n- bullet one\n- bullet two\n\n> Pull quote.`}
              className="w-full border border-line bg-night/40 p-3 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </FormField>
          <div className="col-span-12">
            <button
              type="submit"
              className="bg-cream px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
            >
              Save as draft →
            </button>
            <p className="mt-3 font-sans text-[11px] text-cream/45">
              Posts always start as draft. You&apos;ll get the publish + email-blast button on the edit screen.
            </p>
          </div>
        </form>
      </section>

      {/* EXISTING POSTS */}
      <section>
        <h2 className="font-serif text-[22px]">Existing</h2>
        <div className="mt-5 space-y-3">
          {rows.length === 0 ? (
            <div className="border border-dashed border-line/60 p-6 font-sans text-[13px] text-cream/55">
              No posts yet. Create the first one above.
            </div>
          ) : (
            rows.map((p) => (
              <Link
                key={p.id}
                href={`/admin/posts/${p.id}/edit`}
                className="flex flex-wrap items-center justify-between gap-4 border border-line bg-cream/[0.02] p-5 transition hover:border-cream/40"
              >
                <div>
                  <div className="font-serif text-[20px] text-cream">{p.title}</div>
                  <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
                    /insider/{p.slug}
                    <span className={`ml-3 ${p.status === "published" ? "text-ember" : "text-cream/35"}`}>
                      · {p.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-sans text-[11px] text-cream/55">
                    {p.status === "published" ? `Published ${fmt(p.published_at)}` : `Updated ${fmt(p.updated_at)}`}
                  </div>
                  <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.22em] text-cream/55">
                    Edit →
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function FormField({
  className,
  label,
  children,
}: {
  className?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/55">
        {label}
      </div>
      {children}
    </div>
  );
}
