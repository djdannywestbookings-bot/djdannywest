"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, requireAdmin } from "@/lib/supabase/admin";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function publishMix(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("mixes")
    .update({
      is_published: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/mixes");
  revalidatePath("/mixes");
  revalidatePath("/mixes/library");
  return;
}

export async function unpublishMix(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("mixes")
    .update({
      is_published: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/mixes");
  revalidatePath("/mixes");
  revalidatePath("/mixes/library");
  return;
}

export async function updateMixSeries(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  const seriesId = String(formData.get("series_id") ?? "");
  if (!id) throw new Error("Missing id");

  const admin = createAdminClient();
  const { error } = await admin
    .from("mixes")
    .update({
      series_id: seriesId || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/mixes");
  revalidatePath("/mixes");
  return;
}
