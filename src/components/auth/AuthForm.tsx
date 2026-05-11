"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { signIn, signUp } from "@/app/auth/actions";

const easeOut = [0.16, 1, 0.3, 1] as const;
const labelCls = "font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55";
const fieldCls =
  "w-full bg-transparent border-0 border-b border-line py-3 font-sans text-[15px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none focus:ring-0 transition";

type Mode = "signin" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await (mode === "signin" ? signIn(formData) : signUp(formData));
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeOut }}
      className="w-full max-w-md"
    >
      {/* OAuth — disabled until providers are configured */}
      <div className="space-y-3">
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Google sign-in is coming soon — use email below"
          className="flex w-full cursor-not-allowed items-center gap-3 border border-line bg-cream/[0.015] px-6 py-3.5 font-sans text-[12px] uppercase tracking-[0.22em] text-cream/45"
        >
          <GoogleMark muted />
          <span className="flex-1 text-left">Continue with Google</span>
          <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-cream/35">
            Soon
          </span>
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Apple sign-in is coming soon — use email below"
          className="flex w-full cursor-not-allowed items-center gap-3 border border-line bg-cream/[0.015] px-6 py-3.5 font-sans text-[12px] uppercase tracking-[0.22em] text-cream/45"
        >
          <AppleMark muted />
          <span className="flex-1 text-left">Continue with Apple</span>
          <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-cream/35">
            Soon
          </span>
        </button>
      </div>

      <div className="my-8 flex items-center gap-4">
        <span className="h-px flex-1 bg-line" />
        <span className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/35">
          or use email
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* Email + password */}
      <form action={handleSubmit} className="space-y-6">
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className={labelCls}>Your name</label>
            <input id="name" name="name" type="text" autoComplete="name" className={fieldCls} />
          </div>
        )}
        <div>
          <label htmlFor="email" className={labelCls}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldCls}
          />
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="password" className={labelCls}>
              Password{mode === "signup" ? " · 8+ characters" : ""}
            </label>
            {mode === "signin" && (
              <a
                href="/forgot-password"
                className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/45 transition hover:text-ember"
              >
                Forgot?
              </a>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className={fieldCls}
          />
        </div>

        {error && (
          <div className="font-sans text-[12px] text-ember">{error}</div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-cream px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-ember disabled:opacity-60"
        >
          {pending ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </form>

      <div className="mt-8 text-center font-sans text-[12px] text-cream/55">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <a href="/signup" className="text-cream underline decoration-cream/30 underline-offset-[5px] transition hover:decoration-cream">
              Create an account
            </a>
          </>
        ) : (
          <>
            Already a member?{" "}
            <a href="/login" className="text-cream underline decoration-cream/30 underline-offset-[5px] transition hover:decoration-cream">
              Sign in
            </a>
          </>
        )}
      </div>
    </motion.div>
  );
}

function GoogleMark({ muted = false }: { muted?: boolean }) {
  const opacity = muted ? 0.45 : 1;
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" style={{ opacity }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" fill="#34A853" />
      <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.83Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.1 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" fill="#EA4335" />
    </svg>
  );
}

function AppleMark({ muted = false }: { muted?: boolean }) {
  return (
    <svg className={`h-4 w-4 ${muted ? "opacity-50" : ""}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.5c-.04-3.06 2.5-4.53 2.61-4.6-1.42-2.08-3.64-2.37-4.43-2.4-1.89-.19-3.69 1.11-4.65 1.11-.97 0-2.45-1.08-4.02-1.05-2.07.03-3.98 1.2-5.04 3.06-2.15 3.74-.55 9.27 1.55 12.31 1.03 1.49 2.25 3.16 3.85 3.1 1.55-.06 2.13-1 4-1 1.86 0 2.39 1 4.02.97 1.66-.03 2.71-1.51 3.72-3 1.18-1.71 1.66-3.38 1.69-3.47-.04-.02-3.24-1.24-3.27-4.93Zm-3.1-9.05c.85-1.04 1.43-2.48 1.27-3.92-1.23.05-2.72.83-3.6 1.86-.79.92-1.49 2.39-1.3 3.81 1.37.1 2.78-.71 3.63-1.75Z" />
    </svg>
  );
}
