import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Send "new mix uploaded" emails to opted-in members when a mix is published.
 *
 * Logic:
 *   - Skip if mix.notify_on_publish is false.
 *   - Skip if mix.notify_sent_at is already set (no double-sends).
 *   - Pick recipients:
 *     - If mix.notify_followers_only is true → only members following the
 *       mix's series with member_notification_prefs.new_mix_followed_email=true.
 *     - Otherwise → all members with member_notification_prefs.new_mix_any_email=true.
 *   - Send in batches via Resend (up to 100 per call).
 *   - Stamp mix.notify_sent_at + notify_recipient_count.
 *
 * Called from publishMix server action.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderHtml(mixTitle: string, mixSubtitle: string | null, seriesTitle: string | null, mixUrl: string, coverUrl: string | null): string {
  const subtitleLine = mixSubtitle
    ? `<div style="font-size:13px;color:#6E665D;letter-spacing:0.16em;text-transform:uppercase;margin-top:6px;">${escapeHtml(mixSubtitle)}${seriesTitle ? " · " + escapeHtml(seriesTitle) : ""}</div>`
    : seriesTitle
      ? `<div style="font-size:13px;color:#6E665D;letter-spacing:0.16em;text-transform:uppercase;margin-top:6px;">${escapeHtml(seriesTitle)}</div>`
      : "";
  return `<!doctype html>
<html>
  <body style="margin:0;background:#0A0907;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#F5F1EA;">
    <table role="presentation" width="100%" style="background:#0A0907;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" style="max-width:600px;background:#0F0E0C;border:1px solid #1F1C18;">
            <tr><td style="padding:32px 36px 8px;">
              <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#E5B97A;">New mix · Subscribers only</div>
            </td></tr>
            ${coverUrl ? `<tr><td style="padding:8px 36px 0;"><img src="${escapeHtml(coverUrl.startsWith('http') ? coverUrl : `https://djdannywest.com${coverUrl}`)}" alt="${escapeHtml(mixTitle)} cover" width="528" style="display:block;max-width:528px;width:100%;height:auto;border:0;" /></td></tr>` : ""}
            <tr><td style="padding:24px 36px 8px;">
              <div style="font-family:Georgia,serif;font-size:32px;font-style:italic;color:#F5F1EA;line-height:1.1;">${escapeHtml(mixTitle)}</div>
              ${subtitleLine}
            </td></tr>
            <tr><td style="padding:20px 36px 36px;">
              <a href="${escapeHtml(mixUrl)}" style="display:inline-block;background:#E5B97A;color:#0A0907;text-decoration:none;padding:14px 26px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Listen now →</a>
              <div style="font-size:11px;color:#6E665D;margin-top:18px;letter-spacing:0.16em;text-transform:uppercase;">A DJ that moves rooms · New mixes weekly</div>
            </td></tr>
            <tr><td style="padding:0 36px 28px;">
              <hr style="border:0;border-top:1px solid #1F1C18;margin:0 0 14px 0;" />
              <div style="font-size:11px;color:#6E665D;line-height:1.6;">You're getting this because you opted in to new-mix alerts. <a href="https://djdannywest.com/account/notifications" style="color:#E5B97A;">Manage preferences</a>.</div>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendNewMixAlerts(mixId: string): Promise<{
  attempted: number;
  sent: number;
  skipped: string | null;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { attempted: 0, sent: 0, skipped: "RESEND_API_KEY missing" };
  }

  const admin = createAdminClient();
  const { data: mix } = await admin
    .from("mixes")
    .select("id, slug, title, subtitle, cover_url, series_id, notify_on_publish, notify_followers_only, notify_sent_at, is_published")
    .eq("id", mixId)
    .maybeSingle();

  if (!mix) return { attempted: 0, sent: 0, skipped: "mix not found" };
  if (!mix.is_published) return { attempted: 0, sent: 0, skipped: "mix not published" };
  if (!mix.notify_on_publish) return { attempted: 0, sent: 0, skipped: "notify_on_publish disabled" };
  if (mix.notify_sent_at) return { attempted: 0, sent: 0, skipped: "already sent" };

  // Series title for the email
  let seriesTitle: string | null = null;
  if (mix.series_id) {
    const { data: s } = await admin
      .from("series")
      .select("title")
      .eq("id", mix.series_id)
      .maybeSingle();
    seriesTitle = (s?.title as string) ?? null;
  }

  // Decide recipients
  let recipientIds: string[] = [];
  if (mix.notify_followers_only && mix.series_id) {
    const { data: followers } = await admin
      .from("member_followed_series")
      .select("member_id")
      .eq("series_id", mix.series_id);
    const ids = (followers ?? []).map((f) => f.member_id as string);
    if (ids.length === 0) {
      await admin
        .from("mixes")
        .update({ notify_sent_at: new Date().toISOString(), notify_recipient_count: 0 })
        .eq("id", mixId);
      return { attempted: 0, sent: 0, skipped: "no followers" };
    }
    const { data: prefs } = await admin
      .from("member_notification_prefs")
      .select("member_id")
      .in("member_id", ids)
      .eq("new_mix_followed_email", true);
    recipientIds = (prefs ?? []).map((p) => p.member_id as string);
  } else {
    const { data: prefs } = await admin
      .from("member_notification_prefs")
      .select("member_id")
      .eq("new_mix_any_email", true);
    recipientIds = (prefs ?? []).map((p) => p.member_id as string);
  }

  if (recipientIds.length === 0) {
    await admin
      .from("mixes")
      .update({ notify_sent_at: new Date().toISOString(), notify_recipient_count: 0 })
      .eq("id", mixId);
    return { attempted: 0, sent: 0, skipped: "no opted-in recipients" };
  }

  // Resolve emails from auth.users
  const adminClient = admin;
  const emails: string[] = [];
  // listUsers paginates — we fetch up to 200 at a time which is fine for early scale
  let page = 1;
  while (true) {
    const { data: list } = await adminClient.auth.admin.listUsers({ page, perPage: 200 });
    const users = list?.users ?? [];
    for (const u of users) {
      if (u.email && recipientIds.includes(u.id) && u.email_confirmed_at) {
        emails.push(u.email);
      }
    }
    if (users.length < 200) break;
    page++;
    if (page > 50) break; // safety cap (10k users)
  }

  if (emails.length === 0) {
    await admin
      .from("mixes")
      .update({ notify_sent_at: new Date().toISOString(), notify_recipient_count: 0 })
      .eq("id", mixId);
    return { attempted: 0, sent: 0, skipped: "no verified-email recipients" };
  }

  const resend = new Resend(apiKey);
  const mixUrl = `https://djdannywest.com/mixes/${mix.slug}`;
  const html = renderHtml(
    mix.title as string,
    mix.subtitle as string | null,
    seriesTitle,
    mixUrl,
    mix.cover_url as string | null,
  );
  const subject = `New mix: ${mix.title}${mix.subtitle ? " · " + mix.subtitle : ""}`;
  const from = "DJ Danny West <onboarding@resend.dev>";

  // Resend batch endpoint: send up to 100 per call.
  let sent = 0;
  for (let i = 0; i < emails.length; i += 100) {
    const slice = emails.slice(i, i + 100);
    const payload = slice.map((to) => ({ from, to: [to], subject, html }));
    try {
      const result = await resend.batch.send(payload);
      if (!result.error) {
        sent += slice.length;
      }
    } catch (err) {
      console.error("[NEW_MIX EMAIL BATCH FAILED]", err);
    }
  }

  await admin
    .from("mixes")
    .update({
      notify_sent_at: new Date().toISOString(),
      notify_recipient_count: sent,
    })
    .eq("id", mixId);

  return { attempted: emails.length, sent, skipped: null };
}
