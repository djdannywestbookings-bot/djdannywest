"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveNotificationPrefs(
  formData: FormData,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const patch = {
    new_mix_any_email: formData.get("new_mix_any_email") === "on",
    new_mix_followed_email: formData.get("new_mix_followed_email") === "on",
    mix_request_fulfilled_email: formData.get("mix_request_fulfilled_email") === "on",
    announcements_email: formData.get("announcements_email") === "on",
    new_mix_sms: formData.get("new_mix_sms") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("member_notification_prefs")
    .upsert({ member_id: user.id, ...patch });

  if (error) throw new Error(error.message);

  revalidatePath("/account/notifications");
  return;
}
