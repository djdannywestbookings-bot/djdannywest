"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, requireAdmin } from "@/lib/supabase/admin";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function grantComp(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const memberId = String(formData.get("memberId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim() || "Comped by admin";
  const expiresStr = String(formData.get("expires") ?? "").trim();
  if (!memberId) throw new Error("Missing memberId");

  const admin = createAdminClient();
  const { error } = await admin.from("comp_grants").insert({
    member_id: memberId,
    granted_by: gate.user.id,
    reason,
    expires_at: expiresStr ? new Date(expiresStr).toISOString() : null,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/members/${memberId}`);
  revalidatePath("/admin/members");
  return;
}

export async function revokeComp(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const compId = String(formData.get("compId") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  if (!compId) throw new Error("Missing compId");

  const admin = createAdminClient();
  const { error } = await admin
    .from("comp_grants")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", compId);
  if (error) throw new Error(error.message);

  if (memberId) revalidatePath(`/admin/members/${memberId}`);
  revalidatePath("/admin/members");
  return;
}

export async function addNote(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const memberId = String(formData.get("memberId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!memberId || !body) throw new Error("Missing fields");

  const admin = createAdminClient();
  const { error } = await admin.from("admin_notes").insert({
    member_id: memberId,
    author_id: gate.user.id,
    body,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/members/${memberId}`);
  return;
}

export async function deleteNote(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const noteId = String(formData.get("noteId") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  if (!noteId) throw new Error("Missing noteId");

  const admin = createAdminClient();
  const { error } = await admin.from("admin_notes").delete().eq("id", noteId);
  if (error) throw new Error(error.message);

  if (memberId) revalidatePath(`/admin/members/${memberId}`);
  return;
}

export async function updateProfile(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const memberId = String(formData.get("memberId") ?? "");
  if (!memberId) throw new Error("Missing memberId");

  const patch: Record<string, string | boolean | null> = {
    display_name: (formData.get("display_name") as string | null) || null,
    first_name: (formData.get("first_name") as string | null) || null,
    last_name: (formData.get("last_name") as string | null) || null,
    city: (formData.get("city") as string | null) || null,
    state: (formData.get("state") as string | null) || null,
    phone: (formData.get("phone") as string | null) || null,
    is_booking_interested: formData.get("is_booking_interested") === "on",
  };

  const tagsRaw = (formData.get("tags") as string | null) ?? "";

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({
      ...patch,
      tags: tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      updated_at: new Date().toISOString(),
    })
    .eq("id", memberId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/members/${memberId}`);
  revalidatePath("/admin/members");
  return;
}

export async function sendPasswordReset(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const email = String(formData.get("email") ?? "");
  if (!email) throw new Error("Missing email");

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://djdannywest.com";
  const { error } = await admin.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });
  if (error) throw new Error(error.message);

  return;
}
