import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateRequestStatus, deleteRequest } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ filter?: string }>;

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filter = sp.filter ?? "all";

  const supabase = createAdminClient();
  let q = supabase.from("mix_requests").select("*").order("created_at", { ascending: false });
  if (filter !== "all") q = q.eq("status", filter);
  const { data: requests } = await q;

  // Get member display names for the rows we have
  const memberIds = Array.from(new Set((requests ?? []).map((r) => r.member_id as string)));
  const { data: profiles } = memberIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", memberIds)
    : { data: [] };
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name as string]));

  const filters = [
    { key: "all", label: "All" },
    { key: "open", label: "Open" },
    { key: "in_progress", label: "In progress" },
    { key: "fulfilled", label: "Fulfilled" },
    { key: "declined", label: "Declined" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
          — Mix requests
        </p>
        <h1 className="mt-4 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
          The <span className="italic text-ember">queue.</span>
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-line pb-5">
        {filters.map((f) => {
          const href = "/admin/requests" + (f.key === "all" ? "" : `?filter=${f.key}`);
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
        {(requests ?? []).map((r) => (
          <details key={r.id} className="group border border-line bg-cream/[0.02] p-6 open:border-cream/40">
            <summary className="flex cursor-pointer items-start justify-between gap-4">
              <div>
                <div className="font-serif text-[20px] text-cream">
                  {r.title || "Untitled request"}
                </div>
                <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/55">
                  {nameById.get(r.member_id as string) ?? "(unnamed member)"}{" "}
                  · {new Date(r.created_at).toLocaleDateString()}{" "}
                  · {(r.mood_tags as string[])?.slice(0, 4).join(" / ") || "no tags"}
                </div>
              </div>
              <div className="font-sans text-[10px] uppercase tracking-[0.22em] text-cream/55">
                {r.status}
              </div>
            </summary>

            <div className="mt-5 space-y-4 border-t border-line/60 pt-5 font-sans text-[13px] text-cream/75">
              {r.occasion && (
                <div>
                  <span className="text-cream/45">Occasion · </span>
                  {r.occasion}
                </div>
              )}
              {r.desired_length_minutes && (
                <div>
                  <span className="text-cream/45">Desired length · </span>
                  {r.desired_length_minutes} min
                </div>
              )}
              {r.spotify_playlist_url && (
                <div>
                  <span className="text-cream/45">Reference playlist · </span>
                  <a href={r.spotify_playlist_url as string} target="_blank" rel="noreferrer" className="text-ember underline">
                    {r.spotify_playlist_url}
                  </a>
                </div>
              )}
              {r.notes && (
                <div className="border border-line bg-night/40 p-4 font-serif text-[15px] leading-relaxed text-cream/85">
                  {r.notes}
                </div>
              )}
            </div>

            <form action={updateRequestStatus} className="mt-6 grid grid-cols-12 gap-3 border-t border-line/60 pt-5">
              <input type="hidden" name="id" value={r.id} />
              <select
                name="status"
                defaultValue={r.status}
                className="col-span-12 md:col-span-3 border border-line bg-night/40 px-3 py-2 font-sans text-[12px] text-cream focus:border-cream focus:outline-none"
              >
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="declined">Declined</option>
              </select>
              <input
                type="text"
                name="admin_response"
                defaultValue={(r.admin_response as string) ?? ""}
                placeholder="Note back to the member (optional)"
                className="col-span-12 md:col-span-7 border-0 border-b border-line bg-transparent py-2 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
              />
              <button
                type="submit"
                className="col-span-12 md:col-span-2 bg-cream px-4 py-2 font-sans text-[10px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
              >
                Save
              </button>
            </form>
            <form action={deleteRequest} className="mt-3">
              <input type="hidden" name="id" value={r.id} />
              <button
                type="submit"
                className="font-sans text-[10px] uppercase tracking-[0.22em] text-ember/70 transition hover:text-ember"
              >
                Delete request
              </button>
            </form>
          </details>
        ))}

        {(!requests || requests.length === 0) && (
          <div className="border border-dashed border-line/60 p-8 font-sans text-[14px] text-cream/55">
            No requests in this view.
          </div>
        )}
      </div>
    </div>
  );
}
