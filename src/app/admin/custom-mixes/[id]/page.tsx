import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  markInProgress,
  deliverOrder,
  revertToPaid,
} from "../actions";

export const dynamic = "force-dynamic";

type Order = {
  id: string;
  status: string;
  amount_cents: number;
  vibe: string | null;
  target_length_minutes: number | null;
  occasion: string | null;
  explicit_ok: boolean;
  dont_do: string | null;
  notes_to_danny: string | null;
  songs: Array<{ title: string; artist?: string; url?: string }>;
  member_id: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  delivered_at: string | null;
  delivery_mix_url: string | null;
};

function fmtDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString();
}

export default async function AdminCustomMixOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();
  const { data } = await admin
    .from("custom_mix_orders")
    .select(
      "id, status, amount_cents, vibe, target_length_minutes, occasion, explicit_ok, dont_do, notes_to_danny, songs, member_id, stripe_session_id, stripe_payment_intent_id, created_at, delivered_at, delivery_mix_url",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const order = data as Order;

  const { data: userData } = await admin.auth.admin.getUserById(order.member_id);
  const memberEmail = userData?.user?.email ?? "(unknown)";
  const memberName =
    (userData?.user?.user_metadata?.name as string | undefined) ??
    (userData?.user?.user_metadata?.full_name as string | undefined) ??
    null;

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/admin/custom-mixes"
          className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
        >
          ← All custom mix orders
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
              — Order · {order.status}
            </p>
            <h1 className="mt-3 font-serif text-[40px] leading-[1.0] tracking-[-0.02em] md:text-[56px]">
              {order.occasion || "Custom mix"}
            </h1>
            <div className="mt-2 font-sans text-[12px] text-cream/55">
              {memberName ? `${memberName} · ` : ""}
              <a
                href={`mailto:${memberEmail}`}
                className="text-ember underline decoration-ember/40 underline-offset-[4px] hover:text-cream"
              >
                {memberEmail}
              </a>
            </div>
          </div>
          {/* STATUS ACTIONS */}
          <div className="flex flex-wrap items-center gap-3">
            {order.status === "paid" ? (
              <form action={markInProgress}>
                <input type="hidden" name="id" value={order.id} />
                <button
                  type="submit"
                  className="border border-ember/60 bg-cream/[0.02] px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.24em] text-ember transition hover:bg-ember hover:text-night"
                >
                  Mark in progress →
                </button>
              </form>
            ) : null}
            {(order.status === "in_progress" || order.status === "paid") ? (
              <details className="relative">
                <summary className="cursor-pointer list-none bg-ember px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-cream">
                  Deliver mix →
                </summary>
                <form
                  action={deliverOrder}
                  className="absolute right-0 z-10 mt-2 w-[360px] border border-line bg-night p-4 shadow-xl"
                >
                  <input type="hidden" name="id" value={order.id} />
                  <label className="block font-sans text-[10px] uppercase tracking-[0.28em] text-cream/65">
                    Delivery URL
                  </label>
                  <input
                    name="delivery_mix_url"
                    type="url"
                    required
                    placeholder="https://… Dropbox / Drive / Mux stream"
                    className="mt-2 w-full border-0 border-b border-cream/15 bg-transparent py-2 font-sans text-[13px] text-cream focus:border-cream focus:outline-none"
                  />
                  <p className="mt-2 font-sans text-[11px] leading-snug text-cream/45">
                    Direct link the member can click to listen or download.
                    Sending this also fires the &ldquo;your mix is ready&rdquo; email.
                  </p>
                  <button
                    type="submit"
                    className="mt-3 w-full bg-ember px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-cream"
                  >
                    Send delivery email →
                  </button>
                </form>
              </details>
            ) : null}
            {order.status === "in_progress" ? (
              <form action={revertToPaid}>
                <input type="hidden" name="id" value={order.id} />
                <button
                  type="submit"
                  className="border border-cream/20 px-4 py-2.5 font-sans text-[10px] uppercase tracking-[0.22em] text-cream/55 transition hover:text-ember"
                >
                  Move back to queue
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>

      {/* BRIEF */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-7 space-y-5 border border-line bg-cream/[0.02] p-6">
          <h2 className="font-serif text-[22px] text-cream">The brief</h2>
          <Row label="Vibe" value={order.vibe ?? "—"} />
          <Row
            label="Target length"
            value={
              order.target_length_minutes
                ? `${order.target_length_minutes} min`
                : "—"
            }
          />
          <Row
            label="Explicit lyrics"
            value={order.explicit_ok ? "OK — uncut" : "Clean edits only"}
          />
          {order.dont_do ? <Row label="Don't do" value={order.dont_do} /> : null}
          {order.notes_to_danny ? (
            <Row label="Notes" value={order.notes_to_danny} />
          ) : null}
        </div>
        <div className="md:col-span-5 space-y-5 border border-line bg-cream/[0.02] p-6">
          <h2 className="font-serif text-[22px] text-cream">Order meta</h2>
          <Row label="Amount" value={`$${(order.amount_cents / 100).toFixed(0)}`} />
          <Row label="Status" value={order.status} />
          <Row label="Created" value={fmtDateTime(order.created_at)} />
          <Row label="Delivered" value={fmtDateTime(order.delivered_at)} />
          {order.delivery_mix_url ? (
            <Row
              label="Delivery URL"
              value={order.delivery_mix_url}
              link
            />
          ) : null}
          <Row label="Stripe session" value={order.stripe_session_id ?? "—"} mono />
          <Row label="Payment intent" value={order.stripe_payment_intent_id ?? "—"} mono />
        </div>
      </section>

      {/* SONGS */}
      <section>
        <h2 className="font-serif text-[22px] text-cream">
          Songs ({order.songs.length})
        </h2>
        <ol className="mt-4 space-y-2">
          {order.songs.map((s, i) => (
            <li
              key={i}
              className="grid grid-cols-12 gap-3 border border-line bg-cream/[0.02] p-3"
            >
              <span className="col-span-1 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="col-span-11 md:col-span-5 font-serif text-[16px] text-cream">
                {s.title}
              </span>
              <span className="col-span-6 md:col-span-3 font-sans text-[13px] text-cream/55">
                {s.artist ?? "—"}
              </span>
              <span className="col-span-6 md:col-span-3 truncate font-sans text-[12px] text-cream/45">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener"
                    className="text-ember underline decoration-ember/40 underline-offset-[4px] hover:text-cream"
                  >
                    Listen ↗
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  link,
}: {
  label: string;
  value: string;
  mono?: boolean;
  link?: boolean;
}) {
  return (
    <div className="grid grid-cols-12 gap-3 border-b border-line/60 pb-3 last:border-0 last:pb-0">
      <dt className="col-span-4 font-sans text-[10px] uppercase tracking-[0.28em] text-cream/45">
        {label}
      </dt>
      <dd
        className={`col-span-8 ${mono ? "break-all font-mono" : ""} font-sans text-[13px] text-cream/85`}
      >
        {link && value !== "—" ? (
          <a
            href={value}
            target="_blank"
            rel="noopener"
            className="text-ember underline decoration-ember/40 underline-offset-[4px] hover:text-cream"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
