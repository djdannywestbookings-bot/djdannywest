"use server";

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type BookingInquiry = {
  eventType: string;
  eventDate: string;
  location: string;
  guests: string;
  offer: string;
  howHeard: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  submittedAt: string;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

function fmt(label: string, value: string): string {
  return value ? `<tr><td style="padding:6px 14px 6px 0;color:#6E665D;font-size:12px;text-transform:uppercase;letter-spacing:0.18em;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:6px 0;color:#111;font-size:15px;">${escapeHtml(value)}</td></tr>` : "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmailHtml(d: BookingInquiry): string {
  const offerLabel = d.offer || "— (no offer submitted)";
  return `<!doctype html>
<html>
  <body style="margin:0;background:#F5F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;">
    <table role="presentation" width="100%" style="background:#F5F1EA;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" style="max-width:600px;background:#FFF;border:1px solid #E5DDD0;">
            <tr>
              <td style="padding:32px 36px 8px;">
                <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#FF4D1F;">New Booking Inquiry</div>
                <div style="font-family:Georgia,serif;font-size:32px;font-style:italic;color:#0A0907;margin-top:6px;">${escapeHtml(d.name) || "Anonymous"}</div>
                <div style="font-size:14px;color:#6E665D;margin-top:4px;">${escapeHtml(d.eventType)}${d.eventDate ? " · " + escapeHtml(d.eventDate) : ""}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 36px 0;">
                <hr style="border:0;border-top:1px solid #E5DDD0;margin:16px 0;" />
                <table role="presentation" width="100%">
                  ${fmt("Event type", d.eventType)}
                  ${fmt("Event date", d.eventDate)}
                  ${fmt("Location", d.location)}
                  ${fmt("Guests", d.guests)}
                  ${fmt("Offer", offerLabel)}
                  ${fmt("Heard via", d.howHeard)}
                  ${fmt("Email", d.email)}
                  ${fmt("Phone", d.phone)}
                </table>
                ${d.notes ? `<div style="margin-top:18px;"><div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#6E665D;margin-bottom:6px;">Notes</div><div style="background:#F8F4ED;border-left:2px solid #FF4D1F;padding:14px 16px;font-size:15px;line-height:1.55;color:#111;white-space:pre-wrap;">${escapeHtml(d.notes)}</div></div>` : ""}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 36px 32px;">
                <a href="mailto:${escapeHtml(d.email)}" style="display:inline-block;background:#FF4D1F;color:#FFF;text-decoration:none;padding:12px 22px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Reply →</a>
                <div style="font-size:11px;color:#9E948A;margin-top:18px;">Received ${escapeHtml(d.submittedAt)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Booking inquiry submit handler.
 * - Validates required fields.
 * - Sends an email to the address in BOOKING_NOTIFICATIONS_TO via Resend.
 * - Falls back to console-logging if Resend isn't configured (e.g. local dev
 *   without env vars set), so the form is still useful in development.
 */
export async function submitBookingInquiry(
  formData: FormData,
): Promise<SubmitResult> {
  const data: BookingInquiry = {
    eventType: String(formData.get("eventType") ?? "").trim(),
    eventDate: String(formData.get("eventDate") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    guests: String(formData.get("guests") ?? "").trim(),
    offer: String(formData.get("offer") ?? "").trim(),
    howHeard: String(formData.get("howHeard") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    submittedAt: new Date().toISOString(),
  };

  if (!data.name || !data.email || !data.eventType) {
    return { ok: false, error: "Please fill in name, email, and event type." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, error: "That email looks off — please double-check." };
  }

  // Persist to DB. Use admin client so anonymous (signed-out) submitters can still write.
  let inquiryId: string | null = null;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const admin = createAdminClient();
    const { data: row } = await admin
      .from("booking_inquiries")
      .insert({
        member_id: user?.id ?? null,
        event_type: data.eventType || null,
        event_date: data.eventDate ? data.eventDate : null,
        location: data.location || null,
        guest_count: data.guests || null,
        offer: data.offer || null,
        contact_name: data.name,
        contact_email: data.email,
        contact_phone: data.phone || null,
        how_heard: data.howHeard || null,
        notes: data.notes || null,
        status: "new",
      })
      .select("id")
      .single();
    inquiryId = (row?.id as string | undefined) ?? null;
  } catch (err) {
    // Persisting to DB is best-effort — never block the email send on it.
    console.error("[BOOKING DB INSERT FAILED]", err);
  }

  // Enqueue the 5-step welcome drip. Best-effort — failures here do not
  // prevent the booking confirmation email from being sent.
  if (inquiryId) {
    try {
      const { enqueueInquiryDrip } = await import("@/lib/notifications/inquiry-drip-queue");
      await enqueueInquiryDrip({
        inquiryId,
        contactEmail: data.email,
        contactName: data.name,
        eventType: data.eventType || null,
        eventDate: data.eventDate || null,
      });
    } catch (err) {
      console.error("[INQUIRY DRIP ENQUEUE FAILED]", err);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_NOTIFICATIONS_TO;

  if (!apiKey || !to) {
    // Local-dev fallback. In production both vars are set in Vercel.
    console.log("[BOOKING INQUIRY — Resend not configured]", JSON.stringify(data, null, 2));
    return { ok: true };
  }

  try {
    const resend = new Resend(apiKey);
    const subjectName = data.name || "Someone";
    const subjectEvent = data.eventType || "an event";
    const result = await resend.emails.send({
      // Using Resend's default onboarding sender until we verify djdannywest.com.
      // After domain verification, swap to: "Bookings <bookings@djdannywest.com>"
      from: "DJ Danny West Bookings <onboarding@resend.dev>",
      to: [to],
      replyTo: data.email,
      subject: `Booking inquiry — ${subjectName} · ${subjectEvent}`,
      html: renderEmailHtml(data),
    });

    if (result.error) {
      console.error("[RESEND ERROR]", result.error);
      return {
        ok: false,
        error: "Couldn't send the inquiry — please email djdannywestbookings@gmail.com directly.",
      };
    }
    return { ok: true };
  } catch (err) {
    console.error("[BOOKING SUBMIT FAILED]", err);
    return {
      ok: false,
      error: "Something went wrong on our end. Please email djdannywestbookings@gmail.com directly.",
    };
  }
}
