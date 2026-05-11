"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient, requireAdmin } from "@/lib/supabase/admin";

export async function updateBookingStatus(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const adminNote = String(formData.get("admin_note") ?? "").trim() || null;
  if (!id) throw new Error("Missing id");
  if (!["new", "replied", "booked", "declined", "archived"].includes(status)) {
    throw new Error("Invalid status");
  }
  const admin = createAdminClient();
  const { error } = await admin
    .from("booking_inquiries")
    .update({
      status,
      admin_note: adminNote,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings");
}

export async function deleteBooking(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Unauthorized");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");
  const admin = createAdminClient();
  const { error } = await admin.from("booking_inquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings");
}
