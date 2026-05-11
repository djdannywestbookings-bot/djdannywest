import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateBookingStatus, deleteBooking } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ filter?: string }>;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filter = sp.filter ?? "all";

  const supabase = createAdminClient();
  let q = supabase
    .from("booking_inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (filter !== "all") q = q.eq("status", filter);
  const { data: rows } = await q;

  const filters = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "replied", label: "Replied" },
    { key: "booked", label: "Booked" },
    { key: "declined", label: "Declined" },
    { key: "archived", label: "Archived" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
          — Booking inquiries
        </p>
        <h1 className="mt-4 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
          The <span className="italic text-ember">pipeline.</span>
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-line pb-5">
        {filters.map((f) => {
          const href = "/admin/bookings" + (f.key === "all" ? "" : `?filter=${f.key}`);
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

      <div className="space-y-5">
        {(rows ?? []).map((b) => (
          <details
            key={b.id}
            className="group border border-line bg-cream/[0.02] p-6 open:border-cream/40"
          >
            <summary className="flex cursor-pointer flex-wrap items-start justify-between gap-4">
              <div>
                <div className="font-serif text-[20px] text-cream">
                  {b.contact_name}
                </div>
                <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/55">
                  {b.event_type ?? "—"}
                  {b.event_date ? ` · ${new Date(b.event_date).toLocaleDateString()}` : ""}
                  {b.location ? ` · ${b.location}` : ""}
                </div>
              </div>
              <div className="font-sans text-[10px] uppercase tracking-[0.22em] text-cream/55">
                {b.status} · {new Date(b.created_at).toLocaleDateString()}
              </div>
            </summary>

            <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-line/60 pt-5 font-sans text-[13px] md:grid-cols-2">
              <DL label="Email" value={b.contact_email} link={`mailto:${b.contact_email}`} />
              {b.contact_phone && (
                <DL label="Phone" value={b.contact_phone} link={`tel:${b.contact_phone}`} />
              )}
              <DL label="Guests" value={b.guest_count ?? "—"} />
              <DL label="Offer" value={b.offer ?? "—"} />
              <DL label="Heard via" value={b.how_heard ?? "—"} />
              {b.source_mix_slug && <DL label="Source mix" value={b.source_mix_slug} />}
            </dl>

            {b.notes && (
              <div className="mt-5 border border-line bg-night/40 p-4 font-serif text-[15px] leading-relaxed text-cream/85">
                {b.notes}
              </div>
            )}

            <form action={updateBookingStatus} className="mt-6 grid grid-cols-12 gap-3 border-t border-line/60 pt-5">
              <input type="hidden" name="id" value={b.id} />
              <select
                name="status"
                defaultValue={b.status}
                className="col-span-12 md:col-span-3 border border-line bg-night/40 px-3 py-2 font-sans text-[12px] text-cream focus:border-cream focus:outline-none"
              >
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="booked">Booked</option>
                <option value="declined">Declined</option>
                <option value="archived">Archived</option>
              </select>
              <input
                type="text"
                name="admin_note"
                defaultValue={(b.admin_note as string) ?? ""}
                placeholder="Internal note (private)"
                className="col-span-12 md:col-span-7 border-0 border-b border-line bg-transparent py-2 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
              />
              <button
                type="submit"
                className="col-span-12 md:col-span-2 bg-cream px-4 py-2 font-sans text-[10px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
              >
                Save
              </button>
            </form>
            <form action={deleteBooking} className="mt-3">
              <input type="hidden" name="id" value={b.id} />
              <button
                type="submit"
                className="font-sans text-[10px] uppercase tracking-[0.22em] text-ember/70 transition hover:text-ember"
              >
                Delete inquiry
              </button>
            </form>
          </details>
        ))}

        {(!rows || rows.length === 0) && (
          <div className="border border-dashed border-line/60 p-8 font-sans text-[14px] text-cream/55">
            No inquiries in this view.
          </div>
        )}
      </div>
    </div>
  );
}

function DL({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div>
      <dt className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/45">
        {label}
      </dt>
      <dd className="mt-1 text-cream/85">
        {link ? (
          <a href={link} className="underline decoration-cream/30 underline-offset-[5px] hover:decoration-cream">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
