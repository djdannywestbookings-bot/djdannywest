"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);
}

/**
 * Create a new post. Always starts as draft.
 * Slug auto-derives from title if blank.
 */
export async function createPost(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Not authorized.");

  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const body = String(formData.get("body_markdown") ?? "");
  let slug = String(formData.get("slug") ?? "").trim();

  if (!title) throw new Error("Title is required.");
  if (!slug) slug = slugify(title);

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("posts")
    .insert({
      title,
      slug,
      excerpt: excerpt || null,
      cover_image_url: coverImageUrl || null,
      body_markdown: body,
      author_id: gate.user.id,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${data.id}/edit`);
}

/** Save edits to an existing post. */
export async function updatePost(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Not authorized.");

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const body = String(formData.get("body_markdown") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();

  if (!id) throw new Error("Missing post id.");
  if (!title) throw new Error("Title is required.");
  if (!slug) throw new Error("Slug is required.");

  const admin = createAdminClient();
  const { error } = await admin
    .from("posts")
    .update({
      title,
      slug,
      excerpt: excerpt || null,
      cover_image_url: coverImageUrl || null,
      body_markdown: body,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}/edit`);
  revalidatePath(`/insider/${slug}`);
  revalidatePath("/insider");
}

/**
 * Publish a post — flips status, stamps published_at, and fires an email
 * blast to every eligible insider (active subscribers + confirmed clients).
 */
export async function publishPost(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Not authorized.");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id.");

  const admin = createAdminClient();
  const { data: post, error: postErr } = await admin
    .from("posts")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug, title, excerpt")
    .single();
  if (postErr) throw new Error(postErr.message);

  revalidatePath("/admin/posts");
  revalidatePath("/insider");
  revalidatePath(`/insider/${post.slug}`);

  // Fire-and-forget email blast.
  await sendInsiderBlast(post).catch((err) => {
    console.error("[INSIDER BLAST FAILED]", err);
  });
}

export async function unpublishPost(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Not authorized.");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id.");

  const admin = createAdminClient();
  const { error } = await admin
    .from("posts")
    .update({ status: "draft" })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  revalidatePath("/insider");
}

export async function deletePost(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Not authorized.");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing post id.");

  const admin = createAdminClient();
  const { error } = await admin.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/posts");
  revalidatePath("/insider");
  redirect("/admin/posts");
}

/**
 * Build the eligible-recipient list and send the new-post email.
 * - Active subscribers (subscriptions.status = 'ACTIVE', joined to auth.users for email)
 * - Confirmed booking clients (booking_inquiries.status in 'booked','completed')
 * Dedupes by lower(email) before sending.
 */
async function sendInsiderBlast(post: {
  slug: string;
  title: string;
  excerpt: string | null;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[INSIDER BLAST] Skipped — RESEND_API_KEY not set.");
    return;
  }

  const admin = createAdminClient();

  // 1. Active subscribers — join through auth.users to pull email + name.
  const { data: subRows } = await admin
    .from("subscriptions")
    .select("member_id")
    .eq("status", "ACTIVE");

  const subscriberIds = (subRows ?? []).map((r) => r.member_id).filter(Boolean);
  let subscriberEmails: { email: string; name: string | null }[] = [];
  if (subscriberIds.length > 0) {
    const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const idSet = new Set(subscriberIds);
    subscriberEmails = (users?.users ?? [])
      .filter((u) => idSet.has(u.id) && !!u.email)
      .map((u) => ({
        email: u.email!,
        name:
          (u.user_metadata?.display_name as string | undefined) ??
          (u.user_metadata?.full_name as string | undefined) ??
          null,
      }));
  }

  // 2. Confirmed booking clients.
  const { data: bookings } = await admin
    .from("booking_inquiries")
    .select("contact_email, contact_name")
    .in("status", ["booked", "completed"]);
  const clientEmails = (bookings ?? [])
    .filter((b) => !!b.contact_email)
    .map((b) => ({
      email: b.contact_email!,
      name: b.contact_name ?? null,
    }));

  // 3. Dedupe by lowercase email.
  const seen = new Set<string>();
  const recipients: { email: string; name: string | null }[] = [];
  for (const r of [...subscriberEmails, ...clientEmails]) {
    const key = r.email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    recipients.push(r);
  }

  if (recipients.length === 0) {
    console.log("[INSIDER BLAST] No eligible recipients.");
    return;
  }

  const resend = new Resend(apiKey);
  const url = `${site.url}/insider/${post.slug}`;

  // Send individually so failures don't block the rest. Resend's batch API
  // would also work — switch later if volume justifies it.
  await Promise.all(
    recipients.map((r) =>
      resend.emails.send({
        from: "DJ Danny West <onboarding@resend.dev>",
        to: [r.email],
        subject: `Insider · ${post.title}`,
        html: renderBlastHtml(post, r.name, url),
      }).catch((err) => {
        console.error("[INSIDER BLAST send failed for]", r.email, err);
      }),
    ),
  );
  console.log(`[INSIDER BLAST] Sent to ${recipients.length} recipients.`);
}

function renderBlastHtml(
  post: { title: string; excerpt: string | null },
  name: string | null,
  url: string,
): string {
  const first = (name ?? "").split(/\s+/)[0] || "there";
  const excerpt = post.excerpt
    ? `<p style="margin:14px 0;font-size:15px;line-height:1.6;color:#111;">${escapeHtml(post.excerpt)}</p>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#F5F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;">
<table role="presentation" width="100%" style="background:#F5F1EA;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="560" style="max-width:560px;background:#FFF;border:1px solid #E5DDD0;">
<tr><td style="padding:36px 36px 0;">
<div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#FF4D1F;">Insider · new post</div>
<h1 style="font-family:Georgia,serif;font-weight:normal;font-style:italic;font-size:32px;line-height:1.1;color:#0A0907;margin:14px 0 4px;">${escapeHtml(post.title)}</h1>
<div style="font-size:13px;color:#6E665D;margin-bottom:6px;">For ${escapeHtml(first)} — members only.</div>
</td></tr>
<tr><td style="padding:0 36px;">${excerpt}</td></tr>
<tr><td align="center" style="padding:18px 36px 36px;">
<a href="${url}" style="display:inline-block;background:#FF4D1F;color:#FFF;text-decoration:none;padding:12px 22px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Read the post →</a>
</td></tr>
<tr><td style="padding:0 36px 28px;font-size:12px;color:#9E948A;line-height:1.55;border-top:1px solid #E5DDD0;padding-top:18px;">
You're getting this because you're an active subscriber or a past booking client. <br/>
<a href="${site.url}/account/notifications" style="color:#9E948A;">Email preferences</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
