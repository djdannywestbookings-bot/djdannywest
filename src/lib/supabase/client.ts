"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for client components.
 * Reads/writes auth cookies the same way the server client does so SSR + CSR stay aligned.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
