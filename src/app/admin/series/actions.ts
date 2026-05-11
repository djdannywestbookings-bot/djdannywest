"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, requireAdmin } from "@/lib/supabase/admin";

export type ActionResult = { ok: true } | { ok: false; error: string };

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function createSeries(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");

  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const slugIn = String(formData.get("slug") ?? "").trim();
  const slug = slugIn ? slugify(slugIn) : slugify(title);
  const isPublished = formData.get("is_published") === "on";

  const admin = createAdminClient();
  const { error } = await admin.from("series").insert({
    slug,
    title,
    subtitle,
    description,
    is_published: isPublished,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/series");
  revalidatePath("/mixes");
  return;
}

export async function updateSeries(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("series")
    .update({
      title: String(formData.get("title") ?? "").trim(),
      subtitle: String(formData.get("subtitle") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      is_published: formData.get("is_published") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/series");
  revalidatePath("/mixes");
  return;
}

export async function deleteSeries(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  const admin = createAdminClient();
  const { error } = await admin.from("series").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/series");
  revalidatePath("/mixes");
  return;
}
