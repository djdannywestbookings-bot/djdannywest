"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, requireAdmin } from "@/lib/supabase/admin";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export type CreateResult =
  | { ok: true; mixSlug: string }
  | { ok: false; error: string };

/**
 * Create a draft mix row in the DB. Returns the slug so the client can
 * request a Mux upload URL keyed to it. The mix stays is_published=false
 * until the admin flips it after Mux finishes encoding.
 */
export async function createDraftMix(formData: FormData): Promise<CreateResult> {
  const gate = await requireAdmin();
  if (!gate.ok) return { ok: false, error: "Unauthorized" };

  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const seriesId = String(formData.get("series_id") ?? "").trim() || null;
  const volumeRaw = String(formData.get("volume") ?? "").trim();
  const volume = volumeRaw ? parseInt(volumeRaw, 10) || null : null;
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const coverUrl = String(formData.get("cover_url") ?? "").trim() || null;
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!title) return { ok: false, error: "Title is required" };

  const baseSlug = slugify(slugInput || title + (subtitle ? "-" + subtitle : ""));
  const admin = createAdminClient();

  // Ensure uniqueness — append -2, -3 etc. if needed
  let slug = baseSlug || `mix-${Date.now()}`;
  for (let n = 2; n < 50; n++) {
    const { data: existing } = await admin
      .from("mixes")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${n}`;
  }

  const { error } = await admin.from("mixes").insert({
    slug,
    series_id: seriesId,
    volume,
    title,
    subtitle,
    description,
    cover_url: coverUrl,
    tags,
    is_published: false,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/mixes");
  return { ok: true, mixSlug: slug };
}
