import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminOverviewPage() {
  const supabase = createAdminClient();

  // Pull a few key counts in parallel
  const [usersRes, mixesRes, seriesRes, compsRes, openReqRes, newBookRes, activeSubsRes] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("mixes").select("id", { count: "exact", head: true }),
      supabase.from("series").select("id", { count: "exact", head: true }),
      supabase
        .from("comp_grants")
        .select("id", { count: "exact", head: true })
        .is("revoked_at", null),
      supabase
        .from("mix_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
      supabase
        .from("booking_inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("subscriptions")
        .select("id", { count: "exact", head: true })
        .eq("status", "ACTIVE"),
    ]);

  const stats = [
    { label: "Members", value: usersRes.count ?? 0, href: "/admin/members" },
    { label: "Active subs", value: activeSubsRes.count ?? 0, href: "/admin/members" },
    { label: "Active comps", value: compsRes.count ?? 0, href: "/admin/members?filter=comped" },
    { label: "Series", value: seriesRes.count ?? 0, href: "/admin/series" },
    { label: "Mixes", value: mixesRes.count ?? 0, href: "/admin/mixes" },
    { label: "Open requests", value: openReqRes.count ?? 0, href: "/admin/requests" },
    { label: "New inquiries", value: newBookRes.count ?? 0, href: "/admin/bookings?filter=new" },
  ];

  // Recent signups
  const { data: recent } = await supabase
    .from("profiles")
    .select("id, display_name, city, state, created_at")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="space-y-14">
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
          — Overview
        </p>
        <h1 className="mt-4 font-serif text-[60px] leading-[0.95] tracking-[-0.02em] md:text-[88px]">
          The <span className="italic text-ember">board.</span>
        </h1>
        <p className="mt-6 max-w-xl font-sans text-[14px] leading-relaxed text-cream/65">
          Members, comps, mixes, requests. Square + Mux land in the next milestone — once
          subscriptions flow, lifetime value and play stats fill in.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-7">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group block border border-line bg-cream/[0.02] p-5 transition hover:border-cream/40 hover:bg-cream/[0.05]"
          >
            <div className="font-sans text-[9px] uppercase tracking-[0.28em] text-cream/50">
              {s.label}
            </div>
            <div className="mt-3 font-serif text-[44px] leading-none tracking-[-0.02em] text-cream">
              {s.value}
            </div>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="font-serif text-[28px] tracking-[-0.01em]">Recent signups</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {(recent ?? []).map((p) => (
            <Link
              key={p.id}
              href={`/admin/members/${p.id}`}
              className="flex items-center justify-between gap-6 py-4 transition hover:bg-cream/[0.025]"
            >
              <div>
                <div className="font-serif text-[18px] text-cream">
                  {p.display_name ?? "(unnamed member)"}
                </div>
                <div className="mt-1 font-sans text-[12px] text-cream/55">
                  {[p.city, p.state].filter(Boolean).join(", ") || "—"}
                </div>
              </div>
              <div className="font-sans text-[11px] uppercase tracking-[0.24em] text-cream/45">
                {p.created_at ? new Date(p.created_at).toLocaleDateString() : ""}
              </div>
            </Link>
          ))}
          {(!recent || recent.length === 0) && (
            <div className="py-6 font-sans text-[13px] text-cream/45">
              No members yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
