import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Order = {
  id: string;
  status: string;
  amount_cents: number;
  vibe: string | null;
  target_length_minutes: number | null;
  occasion: string | null;
  member_id: string;
  created_at: string;
  delivered_at: string | null;
  delivery_mix_url: string | null;
  songs: Array<{ title: string; artist?: string; url?: string }>;
};

const STATUS_ORDER: Record<string, number> = {
  paid: 0,
  in_progress: 1,
  pending_payment: 2,
  delivered: 3,
  refunded: 4,
};

function statusPill(s: string): { label: string; cls: string } {
  switch (s) {
    case "pending_payment":
      return { label: "Awaiting payment", cls: "border-cream/30 text-cream/55" };
    case "paid":
      return { label: "Paid · queue", cls: "border-ember/60 text-ember" };
    case "in_progress":
      return { label: "Building", cls: "border-cream/60 text-cream" };
    case "delivered":
      return { label: "Delivered", cls: "border-cream/40 text-cream/55" };
    case "refunded":
      return { label: "Refunded", cls: "border-cream/20 text-cream/35" };
    default:
      return { label: s, cls: "border-cream/20 text-cream/45" };
  }
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminCustomMixesPage() {
  const admin = createAdminClient();
  const { data: ordersRaw } = await admin
    .from("custom_mix_orders")
    .select(
      "id, status, amount_cents, vibe, target_length_minutes, occasion, member_id, created_at, delivered_at, delivery_mix_url, songs",
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const orders = (ordersRaw ?? []) as Order[];
  // Sort by workflow priority (open work first) then by recency
  orders.sort((a, b) => {
    const ra = STATUS_ORDER[a.status] ?? 99;
    const rb = STATUS_ORDER[b.status] ?? 99;
    if (ra !== rb) return ra - rb;
    return b.created_at.localeCompare(a.created_at);
  });

  // Fetch member emails for display
  const memberIds = Array.from(new Set(orders.map((o) => o.member_id)));
  const memberMap = new Map<string, { email: string | null; name: string | null }>();
  if (memberIds.length > 0) {
    const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const idSet = new Set(memberIds);
    for (const u of users?.users ?? []) {
      if (!idSet.has(u.id)) continue;
      memberMap.set(u.id, {
        email: u.email ?? null,
        name:
          ((u.user_metadata?.name as string | undefined) ??
            (u.user_metadata?.full_name as string | undefined) ??
            null),
      });
    }
  }

  const openCount = orders.filter(
    (o) => o.status === "paid" || o.status === "in_progress",
  ).length;

  return (
    <div className="space-y-10">
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
          — Custom mix queue
        </p>
        <h1 className="mt-4 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
          The <span className="italic text-ember">workshop.</span>
        </h1>
        <p className="mt-4 max-w-xl font-sans text-[14px] leading-[1.6] text-cream/55">
          {openCount} open · {orders.length} total. Paid orders are at the top.
          Click any order to open the brief, mark progress, or deliver the
          finished mix.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="border border-dashed border-line/60 p-8 font-sans text-[14px] text-cream/55">
          No custom mix orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const s = statusPill(o.status);
            const m = memberMap.get(o.member_id);
            return (
              <Link
                key={o.id}
                href={`/admin/custom-mixes/${o.id}`}
                className="block border border-line bg-cream/[0.02] p-5 transition hover:border-cream/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-block border ${s.cls} px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.22em]`}
                      >
                        {s.label}
                      </span>
                      <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
                        ${(o.amount_cents / 100).toFixed(0)} · {o.songs.length} songs
                      </span>
                    </div>
                    <div className="mt-3 font-display text-[19px] text-cream">
                      {o.occasion || "Custom mix"}
                    </div>
                    <div className="mt-1 font-sans text-[12px] text-cream/55">
                      {m?.name || m?.email || o.member_id}
                      {o.vibe ? ` · ${o.vibe}` : ""}
                      {o.target_length_minutes ? ` · ${o.target_length_minutes} min` : ""}
                    </div>
                  </div>
                  <div className="text-right font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
                    Ordered {fmtDate(o.created_at)}
                    {o.delivered_at ? (
                      <>
                        <br />
                        <span className="text-ember">
                          Delivered {fmtDate(o.delivered_at)}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
