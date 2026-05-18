import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  updatePost,
  publishPost,
  unpublishPost,
  deletePost,
} from "../../actions";

export const dynamic = "force-dynamic";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  body_markdown: string;
  status: string;
  published_at: string | null;
  updated_at: string;
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: post } = await admin
    .from("posts")
    .select(
      "id, slug, title, excerpt, cover_image_url, body_markdown, status, published_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();
  const p = post as PostRow;

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/admin/posts"
          className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
        >
          ← All posts
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              — Editing
            </p>
            <h1 className="mt-3 font-serif text-[40px] leading-[1.0] tracking-[-0.02em] md:text-[56px]">
              {p.title}
            </h1>
            <div className="mt-2 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
              /insider/{p.slug}
              <span className={`ml-3 ${p.status === "published" ? "text-ember" : "text-cream/35"}`}>
                · {p.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {p.status === "draft" ? (
              <form action={publishPost}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  className="bg-ember px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-cream"
                >
                  Publish + email blast →
                </button>
              </form>
            ) : (
              <form action={unpublishPost}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  className="border border-line px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-cream/75 transition hover:border-cream hover:text-cream"
                >
                  Move to draft
                </button>
              </form>
            )}
            <Link
              href={`/insider/${p.slug}`}
              target="_blank"
              className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/55 underline decoration-cream/20 underline-offset-[6px] transition hover:text-cream hover:decoration-cream"
            >
              Preview ↗
            </Link>
          </div>
        </div>
      </div>

      <section className="border border-line bg-cream/[0.02] p-6">
        <form action={updatePost} className="grid grid-cols-12 gap-4">
          <input type="hidden" name="id" value={p.id} />
          <FormField className="col-span-12 md:col-span-8" label="Title">
            <input
              name="title"
              defaultValue={p.title}
              required
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[15px] text-cream focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12 md:col-span-4" label="Slug">
            <input
              name="slug"
              defaultValue={p.slug}
              required
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12" label="Excerpt">
            <input
              name="excerpt"
              defaultValue={p.excerpt ?? ""}
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12" label="Cover image URL">
            <input
              name="cover_image_url"
              type="url"
              defaultValue={p.cover_image_url ?? ""}
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[13px] text-cream focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12" label="Body (Markdown)">
            <textarea
              name="body_markdown"
              defaultValue={p.body_markdown}
              rows={22}
              className="w-full border border-line bg-night/40 p-3 font-sans text-[13px] leading-[1.55] text-cream focus:border-cream focus:outline-none"
            />
            <p className="mt-2 font-sans text-[11px] text-cream/45">
              Supports headings (## · ###), bold (**), italic (*), links, lists, blockquotes (&gt; pull quote), code blocks. Raw HTML is escaped for safety.
            </p>
          </FormField>
          <div className="col-span-12 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="bg-cream px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
            >
              Save changes →
            </button>
            {p.status === "draft" ? (
              <span className="font-sans text-[11px] text-cream/45">
                This post is still a draft.
              </span>
            ) : (
              <span className="font-sans text-[11px] text-cream/45">
                Live since {new Date(p.published_at ?? p.updated_at).toLocaleString()}.
              </span>
            )}
          </div>
        </form>
      </section>

      <section className="border border-line bg-cream/[0.02] p-6">
        <h2 className="font-serif text-[20px] text-ember/90">Danger zone</h2>
        <p className="mt-2 font-sans text-[13px] text-cream/55">
          Deleting is permanent. Members who&apos;ve clicked the email link won&apos;t be able to find it again.
        </p>
        <form action={deletePost} className="mt-4">
          <input type="hidden" name="id" value={p.id} />
          <button
            type="submit"
            className="border border-ember/40 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.24em] text-ember/80 transition hover:border-ember hover:text-ember"
          >
            Delete post
          </button>
        </form>
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
