"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, requireAdmin } from "@/lib/supabase/admin";

export async function updateRequestStatus(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const adminResponse = String(formData.get("admin_response") ?? "").trim() || null;
  if (!id) throw new Error("Missing id");
  if (!["open", "in_progress", "fulfilled", "declined"].includes(status)) {
    throw new Error("Invalid status");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("mix_requests")
    .update({
      status,
      admin_response: adminResponse,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/requests");
}

export async function deleteRequest(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  const admin = createAdminClient();
  const { error } = await admin.from("mix_requests").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/requests");
}
