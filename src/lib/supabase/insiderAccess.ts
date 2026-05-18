import { createAdminClient } from "./admin";
import { createClient } from "./server";

/**
 * Returns true if the current visitor can read /insider content.
 *
 * Membership rules (also enforced server-side by the `has_insider_access`
 * SQL function — RLS is the safety net behind this app-level gate):
 *   - User is an admin → true
 *   - User has an ACTIVE subscription → true
 *   - User's email matches a booking_inquiries row with
 *     status in ('booked', 'completed') → true
 *   - Otherwise → false
 *
 * Returns a discriminated object the page can render against.
 */
export type InsiderAccess =
  | { ok: true; reason: "admin" | "subscriber" | "client"; userId: string }
  | { ok: false; reason: "unauthenticated" | "no_access" };

export async function getInsiderAccess(): Promise<InsiderAccess> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthenticated" };

  const admin = createAdminClient();

  // Admin allow-list — always wins.
  const { data: adminRow } = await admin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (adminRow) return { ok: true, reason: "admin", userId: user.id };

  // Active subscription.
  const { data: subRow } = await admin
    .from("subscriptions")
    .select("status")
    .eq("member_id", user.id)
    .eq("status", "ACTIVE")
    .maybeSingle();
  if (subRow) return { ok: true, reason: "subscriber", userId: user.id };

  // Confirmed booking client (email match).
  const email = user.email?.toLowerCase();
  if (email) {
    const { data: bookingRow } = await admin
      .from("booking_inquiries")
      .select("id")
      .ilike("contact_email", email)
      .in("status", ["booked", "completed"])
      .limit(1)
      .maybeSingle();
    if (bookingRow) return { ok: true, reason: "client", userId: user.id };
  }

  return { ok: false, reason: "no_access" };
}
