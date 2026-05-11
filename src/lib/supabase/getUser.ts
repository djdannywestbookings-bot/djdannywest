import { createClient } from "./server";

/**
 * Helper for server components / pages — returns the current user (or null).
 * Cheap to call repeatedly; cookies are read from the request.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
