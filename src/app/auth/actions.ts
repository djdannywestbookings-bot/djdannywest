"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = { ok: true } | { ok: false; error: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://djdannywest.com";

/**
 * Map Supabase auth errors to human language. Supabase error messages are
 * accurate but technical ("Invalid login credentials", "User already registered").
 * We translate the common ones; for unrecognised errors we pass the raw text.
 */
function humanise(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "That email + password combination didn't match. Double-check, or try resetting your password.";
  }
  if (m.includes("email not confirmed")) {
    return "You haven't verified your email yet — check your inbox for the link I sent. Don't see it? Check spam.";
  }
  if (m.includes("user already registered") || m.includes("already exists")) {
    return "An account with this email already exists. Sign in instead, or use Forgot password if you don't remember it.";
  }
  if (m.includes("password should be at least") || m.includes("weak_password")) {
    return "Pick a stronger password — at least 8 characters.";
  }
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Too many tries. Wait a minute and try again.";
  }
  if (m.includes("provider is not enabled") || m.includes("unsupported provider")) {
    return "Sign-in with this provider isn't live yet — coming soon. Use email + password below for now.";
  }
  if (m.includes("invalid email")) {
    return "That email address looks off — check the spelling.";
  }
  return message;
}

/** Email + password sign-in. */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: humanise(error.message) };

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
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/callback`,
      data: { name },
    },
  });
  if (error) return { ok: false, error: humanise(error.message) };

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

/** Send a password-reset email. */
export async function requestPasswordReset(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { ok: false, error: "Enter the email on your account." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/reset-password`,
  });
  if (error) return { ok: false, error: humanise(error.message) };
  return { ok: true };
}

/** Set a new password (called from /reset-password after clicking the email link). */
export async function setNewPassword(formData: FormData): Promise<AuthResult> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: humanise(error.message) };
  revalidatePath("/", "layout");
  redirect("/account");
}

/** Start Google OAuth flow. Requires the Google provider to be enabled in Supabase. */
export async function signInWithGoogle(): Promise<AuthResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${SITE_URL}/auth/callback` },
  });
  if (error) return { ok: false, error: humanise(error.message) };
  if (data?.url) redirect(data.url);
  return { ok: true };
}

/** Start Apple OAuth flow. Requires Apple Developer Program + provider config in Supabase. */
export async function signInWithApple(): Promise<AuthResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: { redirectTo: `${SITE_URL}/auth/callback` },
  });
  if (error) return { ok: false, error: humanise(error.message) };
  if (data?.url) redirect(data.url);
  return { ok: true };
}
