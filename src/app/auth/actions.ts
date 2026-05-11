"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = { ok: true } | { ok: false; error: string };

/** Email + password sign-in. */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  redirect("/account");
}

/** Email + password sign-up. Sends a verification email. */
export async function signUp(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://djdannywest.com";
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: { name },
    },
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  redirect("/auth/check-email");
}

/** Sign out and return home. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/** Start Google OAuth flow. Requires the Google provider to be enabled in Supabase. */
export async function signInWithGoogle(): Promise<AuthResult> {
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://djdannywest.com";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) return { ok: false, error: error.message };
  if (data?.url) redirect(data.url);
  return { ok: true };
}

/** Start Apple OAuth flow. Requires Apple Developer Program + provider config in Supabase. */
export async function signInWithApple(): Promise<AuthResult> {
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://djdannywest.com";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) return { ok: false, error: error.message };
  if (data?.url) redirect(data.url);
  return { ok: true };
}
