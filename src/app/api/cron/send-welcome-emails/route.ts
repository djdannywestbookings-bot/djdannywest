import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { dripEmailForStep } from "@/lib/notifications/inquiry-drip";

/**
 * Vercel Cron endpoint that processes the welcome-drip queue.
 *
 * Schedule (set in vercel.json): hourly.
 *
 * Each tick:
 *   1. Pull all queued inquiry_drips rows whose send_after <= now.
 *   2. For each, render the template for the matching step and send
 *      via Resend.
 *   3. Mark the row 'sent' on success or 'failed' with the error.
 *
 * Locked to Vercel via the CRON_SECRET header check so random visitors
 * can't trigger it. (Vercel automatically passes CRON_SECRET as a
 * header on real cron runs.)
 */
export async function GET(request: NextRequest) {
  // Vercel cron sends `Authorization: Bearer ${CRON_SECRET}`. Also
  // allow ?secret=... for manual debugging via curl.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization") ?? "";
    const queryParam = request.nextUrl.searchParams.get("secret") ?? "";
    const ok =
      authHeader === `Bearer ${secret}` || queryParam === secret;
    if (!ok) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const replyTo = process.env.BOOKING_REPLY_TO ?? process.env.BOOKING_NOTIFICATIONS_TO;
  if (!apiKey) {
    return NextResponse.json(
      { skipped: "RESEND_API_KEY not configured" },
      { status: 200 },
    );
  }
  const resend = new Resend(apiKey);
  const admin = createAdminClient();
  const nowIso = new Date().toISOString();

  // Cap per-tick to keep runtime predictable. 25 emails / hour = 600/day —
  // way more than this site will ever need at the current scale.
  const { data: due, error: fetchErr } = await admin
    .from("inquiry_drips")
    .select("id, step, inquiry_id, contact_email, contact_name, event_type, event_date")
    .eq("status", "queued")
    .lte("send_after", nowIso)
    .order("send_after", { ascending: true })
    .limit(25);

  if (fetchErr) {
    return NextResponse.json(
      { error: fetchErr.message },
      { status: 500 },
    );
  }
  if (!due || due.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  const sent: string[] = [];
  const failed: Array<{ id: string; error: string }> = [];

  for (const row of due) {
    const firstName =
      ((row.contact_name as string) ?? "").split(/\s+/)[0] || "there";
    try {
      const email = dripEmailForStep(row.step, {
        contactName: row.contact_name ?? "",
        contactFirstName: firstName,
        eventType: row.event_type,
        eventDate: row.event_date,
        inquiryId: row.inquiry_id,
      });
      const result = await resend.emails.send({
        from: "DJ Danny West <onboarding@resend.dev>",
        to: [row.contact_email],
        replyTo,
        subject: email.subject,
        html: email.html,
      });
      if (result.error) {
        throw new Error(result.error.message ?? String(result.error));
      }
      await admin
        .from("inquiry_drips")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          resend_id: result.data?.id ?? null,
        })
        .eq("id", row.id);
      sent.push(row.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[inquiry-drip send]", row.id, "step", row.step, message);
      await admin
        .from("inquiry_drips")
        .update({ status: "failed", error: message.slice(0, 500) })
        .eq("id", row.id);
      failed.push({ id: row.id, error: message });
    }
  }

  return NextResponse.json({
    processed: due.length,
    sent: sent.length,
    failed: failed.length,
    failures: failed,
  });
}
