import { createAdminClient } from "@/lib/supabase/admin";
import { DRIP_SCHEDULE_HOURS } from "./inquiry-drip";

/**
 * Insert the 5 welcome-drip rows for a new booking inquiry. Each row
 * gets a send_after timestamp offset from now by DRIP_SCHEDULE_HOURS.
 * The hourly cron at /api/cron/send-welcome-emails picks them up.
 */
export async function enqueueInquiryDrip(opts: {
  inquiryId: string;
  contactEmail: string;
  contactName: string;
  eventType: string | null;
  eventDate: string | null;
}): Promise<void> {
  const admin = createAdminClient();
  const now = Date.now();

  // Step 1 is the immediate "got it" — step 1 send_after = now, so the
  // cron picks it up on the next tick (within 60 min).
  // If you want truly-immediate step 1, the existing booking-inquiry
  // confirmation email already covers that — the drip step 1 layered on
  // top is the "here's what happens next" follow-up.
  const rows = DRIP_SCHEDULE_HOURS.map((hours, idx) => ({
    inquiry_id: opts.inquiryId,
    contact_email: opts.contactEmail,
    contact_name: opts.contactName,
    event_type: opts.eventType,
    event_date: opts.eventDate,
    step: idx + 1,
    send_after: new Date(now + hours * 3600 * 1000).toISOString(),
    status: "queued",
  }));

  const { error } = await admin.from("inquiry_drips").insert(rows);
  if (error) {
    throw new Error(`enqueueInquiryDrip insert failed: ${error.message}`);
  }
}

/**
 * Mark every queued drip for an inquiry as canceled. Useful when the
 * lead converts (or when the admin manually cancels follow-up) so the
 * person doesn't get the "still thinking?" nudge after they've booked.
 */
export async function cancelInquiryDrips(inquiryId: string): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("inquiry_drips")
    .update({ status: "canceled" })
    .eq("inquiry_id", inquiryId)
    .eq("status", "queued");
}
