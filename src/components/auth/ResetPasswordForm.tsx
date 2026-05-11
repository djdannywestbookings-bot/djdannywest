"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { setNewPassword } from "@/app/auth/actions";

const easeOut = [0.16, 1, 0.3, 1] as const;
const labelCls = "font-sans text-[10px] uppercase tracking-[0.32em] text-cream/55";
const fieldCls =
  "w-full bg-transparent border-0 border-b border-line py-3 font-sans text-[15px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none focus:ring-0 transition";

export function ResetPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");
    if (password !== confirm) {
      setError("Those passwords don't match — try again.");
      return;
    }
    startTransition(async () => {
      const result = await setNewPassword(formData);
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
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="password" className={labelCls}>New password · 8+ characters</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            className={fieldCls}
          />
        </div>
        <div>
          <label htmlFor="confirm" className={labelCls}>Confirm new password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            className={fieldCls}
          />
        </div>

        {error && <div className="font-sans text-[12px] text-ember">{error}</div>}

        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-cream px-8 py-4 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition-colors duration-300 hover:bg-ember disabled:opacity-60"
        >
          {pending ? "Saving…" : "Set new password"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </form>
    </motion.div>
  );
}
