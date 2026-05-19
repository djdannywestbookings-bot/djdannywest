"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { createAdminClient, requireAdmin } from "@/lib/supabase/admin";
import { site } from "@/lib/site";

/**
 * Admin actions for the custom mix queue.
 *
 * - markInProgress: flip 'paid' → 'in_progress'
 * - deliverOrder:   flip → 'delivered', stamp delivery URL, email member
 * - revertToPaid:   move back to 'paid' (mistake)
 */

export async function markInProgress(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Not authorized.");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing order id.");

  const admin = createAdminClient();
  await admin
    .from("custom_mix_orders")
    .update({ status: "in_progress" })
    .eq("id", id);

  revalidatePath("/admin/custom-mixes");
  revalidatePath(`/admin/custom-mixes/${id}`);
}

export async function revertToPaid(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Not authorized.");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing order id.");

  const admin = createAdminClient();
  await admin
    .from("custom_mix_orders")
    .update({ status: "paid", delivered_at: null, delivery_mix_url: null })
    .eq("id", id);

  revalidatePath("/admin/custom-mixes");
  revalidatePath(`/admin/custom-mixes/${id}`);
}

export async function deliverOrder(formData: FormData): Promise<void> {
  const gate = await requireAdmin();
  if (!gate.ok) throw new Error("Not authorized.");

  const id = String(formData.get("id") ?? "");
  const url = String(formData.get("delivery_mix_url") ?? "").trim();
  if (!id) throw new Error("Missing order id.");
  if (!url) throw new Error("Delivery URL is required.");

  const admin = createAdminClient();

  // Capture member email + brief context for the delivery email
  const { data: order } = await admin
    .from("custom_mix_orders")
    .select("id, member_id, occasion, vibe")
    .eq("id", id)
    .single();
  if (!order) throw new Error("Order not found.");

  await admin
    .from("custom_mix_orders")
    .update({
      status: "delivered",
      delivery_mix_url: url,
      delivered_at: new Date().toISOString(),
    })
    .eq("id", id);

  // Send delivery email
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const dannyEmail = process.env.BOOKING_NOTIFICATIONS_TO;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const { data: userData } = await admin.auth.admin.getUserById(order.member_id);
      const memberEmail = userData?.user?.email;
      const firstName =
        ((userData?.user?.user_metadata?.name as string | undefined) ||
          (userData?.user?.user_metadata?.full_name as string | undefined) ||
          memberEmail?.split("@")[0] ||
          "there"
        ).split(/\s+/)[0];

      if (memberEmail) {
        await resend.emails.send({
          from: "DJ Danny West <onboarding@resend.dev>",
          to: [memberEmail],
          replyTo: dannyEmail ?? undefined,
          subject: "Your custom mix is ready — DJ Danny West",
          html: `<!doctype html><html><body style="margin:0;background:#F5F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;">
<table role="presentation" width="100%" style="background:#F5F1EA;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="560" style="max-width:560px;background:#FFF;border:1px solid #E5DDD0;">
<tr><td style="padding:36px 36px 0;">
<div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#FF4D1F;">Your custom mix · delivered</div>
<h1 style="font-family:Georgia,serif;font-style:italic;font-weight:normal;font-size:32px;line-height:1.1;color:#0A0907;margin:14px 0 4px;">It&rsquo;s ready, ${escapeHtml(firstName)}.</h1>
<p style="font-size:15px;line-height:1.6;color:#111;margin:14px 0;">Built around your songs, mixed properly — keys, energy, transitions. Hope this is the one.</p>
${order.occasion ? `<p style="font-size:14px;line-height:1.5;color:#6E665D;margin:14px 0;font-style:italic;">For: ${escapeHtml(order.occasion)}</p>` : ""}
</td></tr>
<tr><td align="center" style="padding:18px 36px 8px;">
<a href="${escapeHtml(url)}" style="display:inline-block;background:#FF4D1F;color:#FFF;text-decoration:none;padding:14px 26px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Listen + download →</a>
</td></tr>
<tr><td align="center" style="padding:8px 36px 28px;">
<a href="${site.url}/account/custom-mix" style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#9E948A;text-decoration:underline;">Or open in your dashboard</a>
</td></tr>
<tr><td style="padding:0 36px 32px;font-size:13px;color:#6E665D;line-height:1.55;border-top:1px solid #E5DDD0;padding-top:18px;">
If it's not exactly what you wanted — reply and tell me what to tweak. One revision included.<br/><br/>
— Danny
</td></tr>
</table></td></tr></table></body></html>`,
        });
      }
    }
  } catch (err) {
    console.error("[custom-mix delivery email]", err);
  }

  revalidatePath("/admin/custom-mixes");
  revalidatePath(`/admin/custom-mixes/${id}`);
  revalidatePath("/account/custom-mix");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
