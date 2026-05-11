import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; filter?: string }>;

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const filter = sp.filter ?? "all";

  const supabase = createAdminClient();

  // Pull users from auth.users plus profiles
  const { data: authUsers } = await supabase.auth.admin.listUsers({
    perPage: 200,
  });

  const userIds = (authUsers?.users ?? []).map((u) => u.id);

  const [{ data: profiles }, { data: comps }, { data: notes }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, city, state, phone, tags, last_seen_at, is_booking_interested")
      .in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]),
    supabase
      .from("comp_grants")
      .select("member_id, expires_at, reason")
      .is("revoked_at", null)
      .in("member_id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]),
    supabase
      .from("admin_notes")
      .select("member_id")
      .in("member_id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]),
  ]);

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const compByMember = new Map(
    (comps ?? []).map((c) => [c.member_id as string, c]),
  );
  const noteCountByMember = (notes ?? []).reduce<Record<string, number>>(
    (acc, n) => {
      const k = n.member_id as string;
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    },
    {},
  );

  type Row = {
    id: string;
    email: string;
    displayName: string;
    location: string;
    createdAt: string | null;
    lastSeenAt: string | null;
    confirmedAt: string | null;
    compActive: boolean;
    compReason: string | null;
    noteCount: number;
    bookingInterested: boolean;
  };

  let rows: Row[] = (authUsers?.users ?? []).map((u) => {
    const p = profileById.get(u.id);
    const comp = compByMember.get(u.id);
    return {
      id: u.id,
      email: u.email ?? "",
      displayName: p?.display_name ?? u.email ?? "(unnamed)",
      location: [p?.city, p?.state].filter(Boolean).join(", "),
      createdAt: u.created_at ?? null,
      lastSeenAt: p?.last_seen_at ?? null,
      confirmedAt: u.email_confirmed_at ?? null,
      compActive: !!comp,
      compReason: (comp?.reason as string) ?? null,
      noteCount: noteCountByMember[u.id] ?? 0,
      bookingInterested: !!p?.is_booking_interested,
    };
  });

  if (q) {
    const lc = q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.email.toLowerCase().includes(lc) ||
        r.displayName.toLowerCase().includes(lc) ||
        r.location.toLowerCase().includes(lc),
    );
  }

  if (filter === "comped") rows = rows.filter((r) => r.compActive);
  if (filter === "unverified") rows = rows.filter((r) => !r.confirmedAt);
  if (filter === "booking") rows = rows.filter((r) => r.bookingInterested);

  rows.sort((a, b) => (a.createdAt && b.createdAt ? b.createdAt.localeCompare(a.createdAt) : 0));

  const filters = [
    { key: "all", label: "All" },
    { key: "comped", label: "Comped" },
    { key: "unverified", label: "Unverified" },
    { key: "booking", label: "Booking-interested" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
          — Members
        </p>
        <h1 className="mt-4 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
          Everyone <span className="italic text-ember">in.</span>
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <form className="flex items-center gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name, email, city…"
            className="w-72 border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none focus:ring-0"
          />
          {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
          <button
            type="submit"
            className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/65 transition hover:text-cream"
          >
            Search →
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const params = new URLSearchParams();
            if (f.key !== "all") params.set("filter", f.key);
            if (q) params.set("q", q);
            const href = "/admin/members" + (params.toString() ? `?${params}` : "");
            const active = filter === f.key;
            return (
              <Link
                key={f.key}
                href={href}
                className={
                  active
                    ? "border border-cream bg-cream px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.24em] text-night"
                    : "border border-line px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.24em] text-cream/65 transition hover:border-cream/50 hover:text-cream"
                }
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="font-sans text-[11px] text-cream/55">
        Showing {rows.length} {rows.length === 1 ? "member" : "members"}
      </div>

      <div className="divide-y divide-line border-y border-line">
        {rows.map((r) => (
          <Link
            key={r.id}
            href={`/admin/members/${r.id}`}
            className="grid grid-cols-12 items-center gap-4 py-4 transition hover:bg-cream/[0.025]"
          >
            <div className="col-span-12 md:col-span-4">
              <div className="font-serif text-[17px] text-cream">{r.displayName}</div>
              <div className="mt-0.5 font-sans text-[12px] text-cream/55">{r.email}</div>
            </div>
            <div className="col-span-6 md:col-span-3 font-sans text-[12px] text-cream/65">
              {r.location || "—"}
            </div>
            <div className="col-span-6 md:col-span-2 flex flex-wrap gap-1.5">
              {r.compActive && (
                <span className="border border-ember/60 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.22em] text-ember">
                  Comp
                </span>
              )}
              {!r.confirmedAt && (
                <span className="border border-cream/30 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.22em] text-cream/55">
                  Unverified
                </span>
              )}
              {r.bookingInterested && (
                <span className="border border-cream/30 px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.22em] text-cream/65">
                  Booking
                </span>
              )}
              {r.noteCount > 0 && (
                <span className="border border-line px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.22em] text-cream/65">
                  {r.noteCount} note{r.noteCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="col-span-12 md:col-span-3 text-right font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
            </div>
          </Link>
        ))}
        {rows.length === 0 && (
          <div className="py-6 font-sans text-[13px] text-cream/45">
            No members match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
