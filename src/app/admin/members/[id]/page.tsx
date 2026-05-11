import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  grantComp,
  revokeComp,
  addNote,
  deleteNote,
  updateProfile,
  sendPasswordReset,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: authRes } = await supabase.auth.admin.getUserById(id);
  if (!authRes?.user) notFound();
  const user = authRes.user;

  const [{ data: profile }, { data: activeComps }, { data: noteList }, { data: playStats }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("comp_grants")
      .select("*")
      .eq("member_id", id)
      .is("revoked_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("admin_notes")
      .select("id, body, created_at, author_id")
      .eq("member_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("member_plays")
      .select("mix_id, play_count, completion_pct, last_played_at")
      .eq("member_id", id),
  ]);

  const totalPlays = (playStats ?? []).reduce((s, p) => s + (p.play_count ?? 0), 0);
  const completedPlays = (playStats ?? []).filter((p) => (p.completion_pct ?? 0) >= 80).length;

  return (
    <div className="space-y-12">
      <div>
        <Link
          href="/admin/members"
          className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
        >
          ← All members
        </Link>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              — Member
            </p>
            <h1 className="mt-3 font-serif text-[52px] leading-[0.95] tracking-[-0.02em] md:text-[72px]">
              {profile?.display_name || user.email}
            </h1>
            <div className="mt-2 font-sans text-[14px] text-cream/55">{user.email}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeComps && activeComps.length > 0 ? (
              <span className="border border-ember/60 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.24em] text-ember">
                Comp active
              </span>
            ) : (
              <span className="border border-cream/30 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.24em] text-cream/55">
                No comp
              </span>
            )}
            {!user.email_confirmed_at && (
              <span className="border border-cream/30 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.24em] text-cream/55">
                Unverified
              </span>
            )}
            {profile?.is_booking_interested && (
              <span className="border border-cream/30 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.24em] text-cream/70">
                Booking-interested
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Top row: identity + activity */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Profile editor */}
        <section className="border border-line bg-cream/[0.02] p-6">
          <h2 className="font-serif text-[22px]">Identity</h2>
          <form action={updateProfile} className="mt-6 grid grid-cols-2 gap-5">
            <input type="hidden" name="memberId" value={id} />
            <FieldText label="Display name" name="display_name" defaultValue={profile?.display_name ?? ""} colSpan={2} />
            <FieldText label="First name" name="first_name" defaultValue={profile?.first_name ?? ""} />
            <FieldText label="Last name" name="last_name" defaultValue={profile?.last_name ?? ""} />
            <FieldText label="City" name="city" defaultValue={profile?.city ?? ""} />
            <FieldText label="State" name="state" defaultValue={profile?.state ?? ""} />
            <FieldText label="Phone" name="phone" defaultValue={profile?.phone ?? ""} colSpan={2} />
            <FieldText
              label="Tags (comma separated)"
              name="tags"
              defaultValue={(profile?.tags ?? []).join(", ")}
              colSpan={2}
            />
            <label className="col-span-2 flex items-center gap-3 font-sans text-[12px] text-cream/75">
              <input
                type="checkbox"
                name="is_booking_interested"
                defaultChecked={!!profile?.is_booking_interested}
                className="h-4 w-4 accent-ember"
              />
              Booking-interested
            </label>
            <div className="col-span-2 mt-2">
              <button
                type="submit"
                className="bg-cream px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
              >
                Save changes →
              </button>
            </div>
          </form>
        </section>

        {/* Activity */}
        <section className="border border-line bg-cream/[0.02] p-6">
          <h2 className="font-serif text-[22px]">Activity</h2>
          <dl className="mt-6 space-y-4">
            <DL label="Signed up" value={user.created_at ? new Date(user.created_at).toLocaleString() : "—"} />
            <DL label="Last sign-in" value={user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "—"} />
            <DL label="Email verified" value={user.email_confirmed_at ? "Yes" : "No"} />
            <DL label="Total plays (lifetime)" value={String(totalPlays)} />
            <DL label="Completed plays (80%+)" value={String(completedPlays)} />
          </dl>
          <form action={sendPasswordReset} className="mt-6 border-t border-line pt-5">
            <input type="hidden" name="email" value={user.email ?? ""} />
            <button
              type="submit"
              className="border border-line px-5 py-2.5 font-sans text-[10px] uppercase tracking-[0.24em] text-cream/75 transition hover:border-cream hover:text-cream"
            >
              Send password reset email
            </button>
          </form>
        </section>
      </div>

      {/* Comp section */}
      <section className="border border-line bg-cream/[0.02] p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-[22px]">Comp / free access</h2>
          <span className="font-sans text-[11px] text-cream/45">
            Members with an active comp keep streaming without a paid subscription.
          </span>
        </div>

        {activeComps && activeComps.length > 0 && (
          <div className="mt-5 space-y-3">
            {activeComps.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 border border-ember/30 bg-ember/[0.04] px-4 py-3"
              >
                <div>
                  <div className="font-serif text-[15px] text-cream">{c.reason}</div>
                  <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
                    Granted {new Date(c.created_at).toLocaleDateString()}
                    {c.expires_at
                      ? ` · Expires ${new Date(c.expires_at).toLocaleDateString()}`
                      : " · Open-ended"}
                  </div>
                </div>
                <form action={revokeComp}>
                  <input type="hidden" name="compId" value={c.id} />
                  <input type="hidden" name="memberId" value={id} />
                  <button
                    type="submit"
                    className="font-sans text-[10px] uppercase tracking-[0.22em] text-ember/80 transition hover:text-ember"
                  >
                    Revoke
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        <form action={grantComp} className="mt-6 grid grid-cols-12 gap-4">
          <input type="hidden" name="memberId" value={id} />
          <div className="col-span-12 md:col-span-6">
            <Label>Reason</Label>
            <input
              type="text"
              name="reason"
              placeholder="e.g. Cowboys staff, press, friend"
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Label>Expires (optional)</Label>
            <input
              type="date"
              name="expires"
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream focus:border-cream focus:outline-none"
            />
          </div>
          <div className="col-span-12 md:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full bg-ember px-4 py-3 font-sans text-[11px] uppercase tracking-[0.22em] text-night transition hover:bg-ember/85"
            >
              Grant comp
            </button>
          </div>
        </form>
      </section>

      {/* Notes */}
      <section className="border border-line bg-cream/[0.02] p-6">
        <h2 className="font-serif text-[22px]">Private notes</h2>
        <p className="mt-2 font-sans text-[12px] text-cream/55">
          Only admins see these. Use for context — how you met, what they want, etc.
        </p>

        <form action={addNote} className="mt-5 space-y-3">
          <input type="hidden" name="memberId" value={id} />
          <textarea
            name="body"
            rows={3}
            placeholder="Met at Cowboys home opener. Wants an 80s wedding mix for August."
            className="w-full border border-line bg-night/40 p-3 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-cream px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
          >
            Add note →
          </button>
        </form>

        <div className="mt-6 divide-y divide-line">
          {(noteList ?? []).map((n) => (
            <div key={n.id} className="flex items-start justify-between gap-4 py-4">
              <div>
                <div className="font-serif text-[15px] leading-relaxed text-cream/90">
                  {n.body}
                </div>
                <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.22em] text-cream/45">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
              <form action={deleteNote}>
                <input type="hidden" name="noteId" value={n.id} />
                <input type="hidden" name="memberId" value={id} />
                <button
                  type="submit"
                  className="font-sans text-[10px] uppercase tracking-[0.22em] text-cream/45 transition hover:text-ember"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
          {(!noteList || noteList.length === 0) && (
            <div className="py-4 font-sans text-[12px] text-cream/45">No notes yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/55">
      {children}
    </div>
  );
}

function FieldText({
  label,
  name,
  defaultValue,
  colSpan = 1,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  colSpan?: 1 | 2;
}) {
  return (
    <div className={colSpan === 2 ? "col-span-2" : "col-span-2 sm:col-span-1"}>
      <Label>{label}</Label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
      />
    </div>
  );
}

function DL({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line/60 pb-3 last:border-0">
      <dt className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/45">
        {label}
      </dt>
      <dd className="font-sans text-[13px] text-cream/85">{value}</dd>
    </div>
  );
}
