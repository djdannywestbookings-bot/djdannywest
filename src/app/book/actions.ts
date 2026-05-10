"use server";

export type BookingInquiry = {
  eventType: string;
  eventDate: string;
  location: string;
  guests: string;
  budget: string;
  howHeard: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  submittedAt: string;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Booking inquiry submit handler.
 *
 * For now this just logs to the Vercel function logs so we can see real
 * inquiries come through. When the real backend lands, replace the body of
 * this function with: send via Resend, insert into Postgres (Supabase),
 * fire a Slack/email notification to Danny.
 */
export async function submitBookingInquiry(
  formData: FormData,
): Promise<SubmitResult> {
  const data: BookingInquiry = {
    eventType: String(formData.get("eventType") ?? ""),
    eventDate: String(formData.get("eventDate") ?? ""),
    location: String(formData.get("location") ?? ""),
    guests: String(formData.get("guests") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    howHeard: String(formData.get("howHeard") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    submittedAt: new Date().toISOString(),
  };

  // Minimal validation — required fields.
  if (!data.name || !data.email || !data.eventType) {
    return { ok: false, error: "Please fill in name, email, and event type." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { ok: false, error: "That email looks off — please double-check." };
  }

  // Surface in Vercel function logs until real backend lands.
  console.log("[BOOKING INQUIRY]", JSON.stringify(data, null, 2));

  return { ok: true };
}
