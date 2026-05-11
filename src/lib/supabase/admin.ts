import { createClient as createSbClient } from "@supabase/supabase-js";
import { createClient } from "./server";

/**
 * Server-only Supabase client using the service role key.
 * BYPASSES Row-Level Security. Use ONLY from server actions / route handlers
 * after an isAdmin() gate check. Never expose to the client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your Vercel env vars.",
    );
  }
  return createSbClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Returns true if the current user is in the admin_users allowlist.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return !!data;
}

/**
 * Same as isAdmin() but returns the user object too — useful for admin pages
 * that need to know who's signed in.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, user: null, reason: "unauthenticated" };

  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return { ok: false as const, user, reason: "not_admin" };
  return { ok: true as const, user };
}
