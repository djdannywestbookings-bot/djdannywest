import { site } from "@/lib/site";

/**
 * Welcome drip — 5 emails over 14 days, fired automatically when someone
 * sends a booking inquiry from /book or /wedding-dj-guide.
 *
 * Cadence (offsets from inquiry submitted_at):
 *   step 1 → 0 days  · "Got it. Here's what happens next."
 *   step 2 → 2 days  · Social proof / credibility
 *   step 3 → 5 days  · DFW venue cheat sheet teaser
 *   step 4 → 9 days  · Behind-the-scenes story
 *   step 5 → 14 days · Soft 'still considering?' nudge
 *
 * Danny gets BCC'd implicitly through Resend reply-to wiring — replies
 * come back to BOOKING_NOTIFICATIONS_TO.
 *
 * Email templates are deliberately conversational, single-author voice.
 * No "Dear valued customer" — Danny writes to one person.
 */

// Schedule offsets (in hours from inquiry submitted_at).
//
// IMPORTANT: the cron job runs once daily on Vercel's free Hobby tier
// (Hobby caps cron frequency at once per day). So actual send time is
// "the next 13:00 UTC after the offset elapses".
//
// Step 1's job is "here's what happens next" — the existing booking-
// inquiry confirmation email fires SYNCHRONOUSLY from the form action,
// so step 1 is a layered follow-up, not the only confirmation. Even
// with a 24-hour cron lag, the inquirer never goes through a silence
// gap.
export const DRIP_SCHEDULE_HOURS = [
  0, // step 1 — fires on next daily cron tick (≤24h after submit)
  48, // step 2 — 2 days
  120, // step 3 — 5 days
  216, // step 4 — 9 days
  336, // step 5 — 14 days
] as const;

export type DripContext = {
  contactName: string;
  contactFirstName: string;
  eventType: string | null;
  eventDate: string | null;
  inquiryId: string;
};

export type DripEmail = {
  subject: string;
  html: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Shared shell wrapping every drip email — branded letterhead, soft footer
 * with unsubscribe-implicit "reply to opt out" line.
 */
function wrap(opts: {
  eyebrow: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}): string {
  const cta = opts.ctaHref && opts.ctaLabel
    ? `<tr><td align="center" style="padding:14px 36px 8px;">
<a href="${opts.ctaHref}" style="display:inline-block;background:#FF4D1F;color:#FFF;text-decoration:none;padding:14px 26px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">${escapeHtml(opts.ctaLabel)} →</a>
</td></tr>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#F5F1EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111;">
<table role="presentation" width="100%" style="background:#F5F1EA;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="560" style="max-width:560px;background:#FFF;border:1px solid #E5DDD0;">
<tr><td style="padding:36px 36px 0;">
<div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#FF4D1F;">${escapeHtml(opts.eyebrow)}</div>
</td></tr>
<tr><td style="padding:8px 36px 0;font-size:15px;line-height:1.65;color:#111;">${opts.body}</td></tr>
${cta}
<tr><td style="padding:24px 36px 28px;font-size:13px;color:#6E665D;line-height:1.55;">
— Danny<br/>
<span style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#9E948A;">DJ Danny West · Cowboys' Stadium Club DJ · SiriusXM</span>
</td></tr>
<tr><td style="padding:0 36px 24px;font-size:11px;color:#9E948A;line-height:1.55;border-top:1px solid #E5DDD0;padding-top:14px;">
You're getting this because you sent a booking inquiry to DJ Danny West. Reply &ldquo;stop&rdquo; and I'll take you off the list (you'll still get a real reply about your event).
</td></tr>
</table></td></tr></table></body></html>`;
}

export function dripEmailForStep(step: number, ctx: DripContext): DripEmail {
  switch (step) {
    case 1:
      return {
        subject: `Got it, ${ctx.contactFirstName} — here's what happens next`,
        html: wrap({
          eyebrow: "Booking inquiry · received",
          body: `<p style="margin:14px 0;">Thanks, ${escapeHtml(ctx.contactFirstName)}. I personally read every inquiry that comes in, and yours is in front of me now.</p>
<p style="margin:14px 0;">Here's how this works:</p>
<ol style="padding-left:22px;margin:10px 0;">
<li style="margin-bottom:8px;">I'll personally reply to you within 24 hours with availability for your date${ctx.eventDate ? ` (${escapeHtml(ctx.eventDate)})` : ""}, an honest read on fit, and any clarifying questions.</li>
<li style="margin-bottom:8px;">If we move forward, we do a 30-minute call (phone or video) to lock the vibe, the timeline, and the must-plays.</li>
<li style="margin-bottom:8px;">Real contract, real deposit, real DJ on your date.</li>
</ol>
<p style="margin:14px 0;">While I work on your reply: <a href="${site.url}/mixes" style="color:#FF4D1F;text-decoration:underline;">the archive</a> is open if you want to hear the kind of work I do. Sets from Cowboys games, weddings I've played, club nights, festivals — pick anything.</p>`,
          ctaHref: `${site.url}/mixes`,
          ctaLabel: "Hear my work",
        }),
      };

    case 2:
      return {
        subject: "While you wait — who I usually play for",
        html: wrap({
          eyebrow: "DJ Danny West · the short version",
          body: `<p style="margin:14px 0;">Quick context on who you just reached out to:</p>
<ul style="padding-left:22px;margin:10px 0;">
<li style="margin-bottom:8px;"><b>Cowboys Stadium Club DJ</b> — every home game since 2018, AT&amp;T Stadium</li>
<li style="margin-bottom:8px;"><b>SiriusXM Channel 13 · Pitbull's Globalization</b> mix-show coordinator. Latin + global house</li>
<li style="margin-bottom:8px;"><b>Tour DJ</b> for 50 Cent, Pitbull, Enrique Iglesias × Ricky Martin</li>
<li style="margin-bottom:8px;"><b>Open-format</b> wedding + corporate work across DFW — Latin, hip-hop, country, top-40, oldies</li>
<li style="margin-bottom:8px;"><b>Rooms</b> like the Adolphus, Four Seasons Las Colinas, Marquee on Magnolia, the Filter Building, Stonebriar</li>
</ul>
<p style="margin:14px 0;">I'm not telling you this to brag. I'm telling you because the gap between an experienced DJ and a hobbyist on your wedding day is the difference between everyone dancing and your aunt asking if she can plug her phone in.</p>
<p style="margin:14px 0;">When you book me, you get me — not a different DJ from a roster you'll never meet.</p>`,
          ctaHref: `${site.url}/mixes`,
          ctaLabel: "Hear recent mixes",
        }),
      };

    case 3:
      return {
        subject: `Venue notes — for ${ctx.eventType ? escapeHtml(ctx.eventType).toLowerCase() : "your event"}`,
        html: wrap({
          eyebrow: "Venue intel — DFW",
          body: `<p style="margin:14px 0;">A quick note while you're picking a venue (if you haven't):</p>
<p style="margin:14px 0;">Every DFW venue has its own audio personality. A few that come up a lot:</p>
<ul style="padding-left:22px;margin:10px 0;">
<li style="margin-bottom:8px;"><b>The Adolphus</b> — high ceilings, marble walls. Sound bounces. Subs need to be controlled or it turns to mud.</li>
<li style="margin-bottom:8px;"><b>Four Seasons Las Colinas</b> — power is solid, room is forgiving. Strict 11pm noise curfew — your final-song moment has to land before then.</li>
<li style="margin-bottom:8px;"><b>Marquee on Magnolia</b> — beautiful indoors, but bring your own line array for outdoor ceremony.</li>
<li style="margin-bottom:8px;"><b>The Filter Building</b> — concrete + steel = serious reverb. Directional speakers, not omnidirectional.</li>
</ul>
<p style="margin:14px 0;">I've played all of these. If you'd like to talk through venue acoustics or anything else, just reply.</p>
<p style="margin:14px 0;">My full <a href="${site.url}/wedding-dj-guide" style="color:#FF4D1F;text-decoration:underline;">DFW Wedding DJ Pricing Guide</a> has the rest of the venue cheat sheet — feel free to share it with your planner or anyone else helping you decide.</p>`,
          ctaHref: `${site.url}/wedding-dj-guide`,
          ctaLabel: "Read the guide",
        }),
      };

    case 4:
      return {
        subject: "One story from a wedding last fall",
        html: wrap({
          eyebrow: "Behind the booth",
          body: `<p style="margin:14px 0;">Quick story.</p>
<p style="margin:14px 0;">Last September, big Texas wedding — bilingual family, 280 guests, gorgeous estate venue. The bride wanted her abuela's favorite Spanish ballads played early, then a hard pivot into Latin urbano + hip-hop for the late-night.</p>
<p style="margin:14px 0;">The first dance went into Bad Bunny's <i>Tití Me Preguntó</i> — abuela's face when the beat dropped and her granddaughter started moving was the photo of the night. Floor stayed packed until 1am.</p>
<p style="margin:14px 0;">That's the thing about an open-format DJ who reads rooms — you can do bilingual, multi-generational events without anyone feeling left out of the music. The dance floor becomes the bridge between people who might never have a reason to share one.</p>
<p style="margin:14px 0;">If your event has a story like that — a family, a moment, a vibe you want me to build the night around — tell me when we talk. That's the stuff I love.</p>`,
          ctaHref: `${site.url}/book`,
          ctaLabel: "Book Danny",
        }),
      };

    case 5:
      return {
        subject: "Still thinking it over? (No pressure)",
        html: wrap({
          eyebrow: "Quick check-in",
          body: `<p style="margin:14px 0;">Just a soft check-in.</p>
<p style="margin:14px 0;">If we already chatted and you're booked elsewhere — congrats on landing your DJ. No hard feelings, hope the event is unreal.</p>
<p style="margin:14px 0;">If you're still weighing options or your date moved or life got in the way: my calendar is open, my inbox is open, and I'm happy to talk through your event with zero sales pressure. Sometimes people just want a second opinion on what to ask other DJs — I'll give you that for free.</p>
<p style="margin:14px 0;">Either way, reply to this email and let me know where you landed. I won't follow up again after this — but I'd love to know.</p>`,
          ctaHref: `${site.url}/book`,
          ctaLabel: "Pick up the conversation",
        }),
      };

    default:
      throw new Error(`Unknown drip step: ${step}`);
  }
}
