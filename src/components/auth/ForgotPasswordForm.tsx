"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { requestPasswordReset } from "@/app/auth/actions";

const easeOut = [0.16, 1, 0.3, 1] as const;
const labelCls = "font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55";
const fieldCls =
  "w-full bg-transparent border-0 border-b border-line py-3 font-sans text-[15px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none focus:ring-0 transition";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await requestPasswordReset(formData);
      if (result.ok) setSent(true);
      else setError(result.error);
    });
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeOut }}
        className="w-full max-w-md py-12"
      >
        <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
          Check your inbox
        </div>
        <h2 className="opsz-section mt-4 font-display text-[40px] font-light italic leading-tight tracking-[-0.025em] text-cream md:text-[52px]">
          Reset link sent.
        </h2>
        <p className="mt-6 max-w-sm font-sans text-[15px] leading-[1.65] text-cream/65">
          Click the link in your email to set a new password. Don&apos;t see
          it? Check spam, or wait a minute and try again.
        </p>
        <a
          href="/login"
          className="mt-8 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-cream transition hover:text-ember"
        >
          ← Back to sign in
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeOut }}
      className="w-full max-w-md"
    >
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className={labelCls}>Email on your account</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldCls}
          />
        </div>

        {error && <div className="font-sans text-[12px] text-ember">{error}</div>}

        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-cream px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-ember disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send reset link"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </form>

      <div className="mt-8 text-center font-sans text-[12px] text-cream/55">
        Remembered it?{" "}
        <a
          href="/login"
          className="text-cream underline decoration-cream/30 underline-offset-[5px] transition hover:decoration-cream"
        >
          Sign in
        </a>
      </div>
    </motion.div>
  );
}
