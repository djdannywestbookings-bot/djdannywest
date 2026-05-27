import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { AccountShell } from "@/components/account/AccountShell";
import { createClient } from "@/lib/supabase/server";
import { saveNotificationPrefs } from "./actions";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/notifications");

  const { data: prefs } = await supabase
    .from("member_notification_prefs")
    .select("*")
    .eq("member_id", user.id)
    .maybeSingle();

  // Defaults if no row yet (trigger should have created one but be safe)
  const p = prefs ?? {
    new_mix_any_email: true,
    new_mix_followed_email: true,
    mix_request_fulfilled_email: true,
    announcements_email: true,
    new_mix_sms: false,
  };

  const toggles = [
    {
      name: "new_mix_any_email",
      title: "New mix uploaded",
      sub: "Email me whenever Danny posts a new mix in any series.",
      checked: p.new_mix_any_email,
    },
    {
      name: "new_mix_followed_email",
      title: "New mix in a series I follow",
      sub: "Email me only for series I follow. (Set this if you'd rather not hear about every drop.)",
      checked: p.new_mix_followed_email,
    },
    {
      name: "mix_request_fulfilled_email",
      title: "Mix request fulfilled",
      sub: "If you've submitted a mix request, I'll let you know when it's live.",
      checked: p.mix_request_fulfilled_email,
    },
    {
      name: "announcements_email",
      title: "Site announcements",
      sub: "Big launches, tour dates, members-only events.",
      checked: p.announcements_email,
    },
  ];

  const displayName =
    (user.user_metadata?.name as string | undefined) ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Member";

  return (
    <main className="bg-night text-cream">
      <SiteNav />
      <div className="relative overflow-hidden bg-night">
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay" />
        <AccountShell
          active="notifications"
          displayName={displayName}
          email={user.email ?? ""}
        >
          <header>
            <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              <div className="mb-2 h-px w-10 bg-ember/70" />
              Notifications
            </div>
            <h1 className="mt-4 font-display text-[clamp(40px,5vw,72px)] font-light leading-[0.95] tracking-[-0.03em] text-cream">
              What you <span className="italic text-ember">hear about.</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-[15px] leading-relaxed text-cream/65">
              Choose what hits your inbox. You can change this any time.
              Transactional emails (password resets, booking confirmations) always
              send — those aren&apos;t optional.
            </p>
          </header>

          <form action={saveNotificationPrefs} className="mt-10 space-y-2">
          {toggles.map((t) => (
            <label
              key={t.name}
              className="flex cursor-pointer items-start justify-between gap-6 border border-line bg-cream/[0.02] p-5 transition hover:border-cream/40"
            >
              <div className="flex-1">
                <div className="font-serif text-[18px] text-cream">{t.title}</div>
                <div className="mt-1 font-sans text-[12px] leading-relaxed text-cream/55">
                  {t.sub}
                </div>
              </div>
              <input
                type="checkbox"
                name={t.name}
                defaultChecked={t.checked}
                className="mt-1 h-5 w-5 accent-ember"
              />
            </label>
          ))}

          <label className="flex items-start justify-between gap-6 border border-dashed border-cream/15 bg-cream/[0.01] p-5 opacity-60">
            <div className="flex-1">
              <div className="font-serif text-[18px] text-cream">SMS — new mix alert</div>
              <div className="mt-1 font-sans text-[12px] leading-relaxed text-cream/55">
                Text message when a new mix drops. Requires a phone number on file and SMS
                provider — ships in a later milestone.
              </div>
            </div>
            <input
              type="checkbox"
              name="new_mix_sms"
              defaultChecked={p.new_mix_sms}
              disabled
              className="mt-1 h-5 w-5 accent-ember"
            />
          </label>

            <div className="pt-6">
              <button
                type="submit"
                className="bg-cream px-8 py-3.5 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
              >
                Save preferences →
              </button>
            </div>
          </form>
        </AccountShell>
      </div>
      <Footer />
    </main>
  );
}
