import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/booking-inquiry
 *
 * Endpoint for the homepage booking form (BookForm inside HomepageV2).
 * Writes the submission into Supabase `booking_inquiries` and, if Resend is
 * configured, sends Danny a notification email.
 *
 * NOTE — if /book already has its own submission endpoint (e.g. /api/book/submit
 * or a server action), you can either:
 *   (a) delete this file and point HomepageV2's BookForm at that existing
 *       endpoint by editing the fetch URL in HomepageV2.tsx, or
 *   (b) leave both — they'll write to the same table and be independent.
 *
 * The table columns used below match what /book already stores. If your
 * schema differs, adjust the .insert(...) payload accordingly.
 */
export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const BOOKING_EMAIL = process.env.BOOKING_NOTIFICATION_EMAIL || "djdannywestbookings@gmail.com";

interface Payload {
  name?: string;
  email?: string;
  event_date?: string;
  event_type?: string;
  venue?: string;
  vibe?: string;
  source?: string;
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const event_date = (body.event_date || "").trim();
  const event_type = (body.event_type || "").trim();
  const venue = (body.venue || "").trim();
  const vibe = (body.vibe || "").trim();
  const source = (body.source || "homepage").trim();

  if (!name || !email || !event_type) {
    return NextResponse.json(
      { error: "Name, email, and event type are required." },
      { status: 400 }
    );
  }
  // Cheap sanity check on email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }

  // Supabase insert
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error("[booking-inquiry] Supabase env vars missing");
    return NextResponse.json(
      { error: "Server misconfigured. Please email direct." },
      { status: 500 }
    );
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });
  const { error: dbErr } = await supabase.from("booking_inquiries").insert({
    name,
    email,
    event_date: event_date || null,
    event_type,
    venue: venue || null,
    vibe: vibe || null,
    source,
  });
  if (dbErr) {
    console.error("[booking-inquiry] supabase insert failed:", dbErr);
    return NextResponse.json(
      { error: "Couldn't save your inquiry. Please email direct." },
      { status: 500 }
    );
  }

  // Notification email (best-effort — form succeeds even if email fails)
  if (RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "DJ Danny West <bookings@djdannywest.com>",
          to: [BOOKING_EMAIL],
          reply_to: email,
          subject: `New booking inquiry — ${event_type} from ${name}`,
          text:
            `New booking inquiry via homepage form\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Event type: ${event_type}\n` +
            `Event date: ${event_date || "(not provided)"}\n` +
            `Venue: ${venue || "(not provided)"}\n\n` +
            `Vibe:\n${vibe || "(none)"}\n\n` +
            `Source: ${source}\n`,
        }),
      });
    } catch (err) {
      console.error("[booking-inquiry] resend send failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
