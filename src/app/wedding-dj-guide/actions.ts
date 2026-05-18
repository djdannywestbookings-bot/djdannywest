"use server";

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";

/**
 * Guide-download form payload.
 * Same field set as the booking inquiry — this is treated as a soft inquiry
 * and lands in the same admin queue. The "How heard" field gets stamped
 * "Wedding DJ Guide download" so Danny can route follow-up tone accordingly.
 */
export type GuideRequest = {
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

const GUIDE_URL = `${site.url}/guides/dfw-wedding-dj-guide.pdf`;
const GUIDE_FILENAME = "DFW-Wedding-DJ-Guide.pdf";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmt(label: string, value: string): string {
  return value
    ? `<tr><td style="padding:6px 14px 6px 0;color:#6E665D;font-size:12px;text-transform:uppercase;letter-spacing:0.18em;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:6px 0;color:#111;font-size:15px;">${escapeHtml(value)}</td></tr>`
    : "";
}

/** Internal email to Danny — same layout as booking inquiries for visual consistency. */
function renderInternalHtml(d: GuideRequest): string {
  return `<!doctype html>
<html><body style="margin:0;background:#F5F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;">
<table role="presentation" width="100%" style="background:#F5F1EA;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" style="max-width:600px;background:#FFF;border:1px solid #E5DDD0;">
<tr><td style="padding:32px 36px 8px;">
<div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#FF4D1F;">Guide Download · Soft Inquiry</div>
<div style="font-family:Georgia,serif;font-size:32px;font-style:italic;color:#0A0907;margin-top:6px;">${escapeHtml(d.name) || "Anonymous"}</div>
<div style="font-size:14px;color:#6E665D;margin-top:4px;">${escapeHtml(d.eventType) || "Wedding"}${d.eventDate ? " · " + escapeHtml(d.eventDate) : ""}</div>
</td></tr>
<tr><td style="padding:8px 36px 0;">
<hr style="border:0;border-top:1px solid #E5DDD0;margin:16px 0;" />
<table role="presentation" width="100%">
${fmt("Event type", d.eventType)}
${fmt("Event date", d.eventDate)}
${fmt("Location", d.location)}
${fmt("Guests", d.guests)}
${fmt("Offer", d.offer)}
${fmt("Heard via", d.howHeard)}
${fmt("Email", d.email)}
${fmt("Phone", d.phone)}
</table>
${d.notes ? `<div style="margin-top:18px;"><div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#6E665D;margin-bottom:6px;">Notes</div><div style="background:#F8F4ED;border-left:2px solid #FF4D1F;padding:14px 16px;font-size:15px;line-height:1.55;color:#111;white-space:pre-wrap;">${escapeHtml(d.notes)}</div></div>` : ""}
<div style="margin-top:18px;padding:14px 16px;background:#F8F4ED;border-left:2px solid #FF4D1F;font-size:13px;color:#111;">
This person downloaded the DFW Wedding DJ Guide and submitted full event details — they're warmer than a cold inquiry. Reply within 24 hours.
</div>
</td></tr>
<tr><td style="padding:24px 36px 32px;">
<a href="mailto:${escapeHtml(d.email)}" style="display:inline-block;background:#FF4D1F;color:#FFF;text-decoration:none;padding:12px 22px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Reply →</a>
<div style="font-size:11px;color:#9E948A;margin-top:18px;">Received ${escapeHtml(d.submittedAt)}</div>
</td></tr>
</table></td></tr></table></body></html>`;
}

/** Email to the requester — delivers the PDF link + soft CTA. */
function renderUserHtml(d: GuideRequest): string {
  const firstName = (d.name || "").split(/\s+/)[0] || "there";
  return `<!doctype html>
<html><body style="margin:0;background:#F5F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;">
<table role="presentation" width="100%" style="background:#F5F1EA;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" style="max-width:600px;background:#FFF;border:1px solid #E5DDD0;">
<tr><td style="padding:36px 36px 0;">
<div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#FF4D1F;">Your guide is ready</div>
<h1 style="font-family:Georgia,serif;font-style:italic;font-weight:normal;font-size:36px;line-height:1.05;color:#0A0907;margin:14px 0 0;">Here it is, ${escapeHtml(firstName)}.</h1>
</td></tr>
<tr><td style="padding:20px 36px 0;font-size:15px;line-height:1.6;color:#111;">
<p style="margin:14px 0;">Thanks for grabbing the <b>DFW Wedding DJ Pricing &amp; Planning Guide</b>. The PDF is ready to download below — no email opt-in dance, no upsells, just the guide.</p>
<p style="margin:14px 0;">A few of the things you'll find inside:</p>
<ul style="padding-left:20px;margin:14px 0;">
<li style="margin-bottom:6px;">The four real DFW wedding DJ pricing tiers (with what each actually includes)</li>
<li style="margin-bottom:6px;">7 red flags that mean walk away — even at a great price</li>
<li style="margin-bottom:6px;">A venue-by-venue DFW cheat sheet (Adolphus, Four Seasons, Marquee on Magnolia, and more)</li>
<li style="margin-bottom:6px;">Your 12-month music planning timeline</li>
<li style="margin-bottom:6px;">The 10-question DJ interview that filters fast</li>
</ul>
</td></tr>
<tr><td align="center" style="padding:14px 36px 8px;">
<a href="${GUIDE_URL}" style="display:inline-block;background:#FF4D1F;color:#FFF;text-decoration:none;padding:14px 26px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Download the guide →</a>
<div style="font-size:11px;color:#9E948A;margin-top:10px;">PDF · 10 pages · djdannywest.com</div>
</td></tr>
<tr><td style="padding:20px 36px 0;font-size:15px;line-height:1.6;color:#111;">
<hr style="border:0;border-top:1px solid #E5DDD0;margin:16px 0;" />
<p style="margin:14px 0;">I also have your event details. I'll personally take a look at your date and venue and reply within 24 hours — whether or not we end up working together. If your date's already booked I'll point you to two or three DJs I'd actually recommend.</p>
<p style="margin:14px 0;">If you want to skip ahead and check availability now:</p>
</td></tr>
<tr><td style="padding:8px 36px 28px;">
<a href="${site.url}/book" style="font-family:-apple-system,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#FF4D1F;text-decoration:underline;">djdannywest.com/book →</a>
</td></tr>
<tr><td style="padding:0 36px 28px;font-size:13px;line-height:1.55;color:#6E665D;">
— Danny<br/>
<span style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#9E948A;">Cowboys' Stadium Club DJ · SiriusXM</span>
</td></tr>
</table>
<div style="font-size:10px;color:#9E948A;margin-top:14px;letter-spacing:0.18em;text-transform:uppercase;">djdannywest.com</div>
</td></tr></table></body></html>`;
}

/**
 * Submit handler for the /wedding-dj-guide landing-page form.
 *
 * - Persists the inquiry to `booking_inquiries` (status: "guide_download") so
 *   it lands in Danny's admin queue alongside real bookings.
 * - Emails the requester the PDF download link via Resend.
 * - Notifies Danny via Resend.
 * - Falls back to console-log when Resend isn't configured (local dev).
 */
export async function submitGuideRequest(
  formData: FormData,
): Promise<SubmitResult> {
  const data: GuideRequest = {
    eventType: String(formData.get("eventType") ?? "Wedding").trim() || "Wedding",
    eventDate: String(formData.get("eventDate") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    guests: String(formData.get("guests") ?? "").trim(),
    offer: String(formData.get("offer") ?? "").trim(),
    howHeard:
      String(formData.get("howHeard") ?? "").trim() ||
      "Wedding DJ Guide download",
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    submittedAt: new Date().toISOString(),
  };

  if (!data.name || !data.email) {
    return { ok: false, error: "Please fill in your name and email." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, error: "That email looks off — please double-check." };
  }

  // Persist to booking_inquiries — marked as a guide download.
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const admin = createAdminClient();
    await admin.from("booking_inquiries").insert({
      member_id: user?.id ?? null,
      event_type: data.eventType,
      event_date: data.eventDate || null,
      location: data.location || null,
      guest_count: data.guests || null,
      offer: data.offer || null,
      contact_name: data.name,
      contact_email: data.email,
      contact_phone: data.phone || null,
      how_heard: data.howHeard,
      notes: data.notes || null,
      status: "guide_download",
    });
  } catch (err) {
    // Persisting is best-effort; never block the email send on a DB error.
    console.error("[GUIDE DB INSERT FAILED]", err);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_NOTIFICATIONS_TO;

  if (!apiKey || !to) {
    console.log(
      "[GUIDE REQUEST — Resend not configured]",
      JSON.stringify(data, null, 2),
    );
    return { ok: true };
  }

  try {
    const resend = new Resend(apiKey);
    const from = "DJ Danny West <onboarding@resend.dev>";

    // Fire user email + internal email in parallel for snappy response.
    const [userEmail, internalEmail] = await Promise.all([
      resend.emails.send({
        from,
        to: [data.email],
        replyTo: process.env.BOOKING_REPLY_TO ?? to,
        subject: "Your DFW Wedding DJ Pricing Guide — DJ Danny West",
        html: renderUserHtml(data),
      }),
      resend.emails.send({
        from,
        to: [to],
        replyTo: data.email,
        subject: `Guide download · ${data.name} · ${data.eventType}`,
        html: renderInternalHtml(data),
      }),
    ]);

    if (userEmail.error) {
      console.error("[RESEND USER EMAIL ERROR]", userEmail.error);
      // The download link is still useful even if email fails — return ok so
      // the success state shows the link directly.
    }
    if (internalEmail.error) {
      console.error("[RESEND INTERNAL EMAIL ERROR]", internalEmail.error);
    }
    return { ok: true };
  } catch (err) {
    console.error("[GUIDE SUBMIT FAILED]", err);
    // Even if email fails, we wrote to the DB and can serve the direct link
    // in the success UI. Return ok rather than confusing the user.
    return { ok: true };
  }
}
