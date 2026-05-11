import { createAdminClient } from "@/lib/supabase/admin";
import { createSeries, updateSeries, deleteSeries } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSeriesPage() {
  const supabase = createAdminClient();
  const { data: series } = await supabase
    .from("series")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12">
      <div>
        <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
          — Series
        </p>
        <h1 className="mt-4 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
          The <span className="italic text-ember">shelves.</span>
        </h1>
      </div>

      <section className="border border-line bg-cream/[0.02] p-6">
        <h2 className="font-serif text-[22px]">New series</h2>
        <form action={createSeries} className="mt-5 grid grid-cols-12 gap-4">
          <FormField className="col-span-12 md:col-span-6" label="Title">
            <input
              name="title"
              required
              placeholder="Stadium Club Live"
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[15px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12 md:col-span-6" label="Subtitle">
            <input
              name="subtitle"
              placeholder="Sundays at AT&T Stadium"
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[15px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12" label="Description">
            <textarea
              name="description"
              rows={2}
              placeholder="Game-day sets from the Stadium Club booth."
              className="w-full border border-line bg-night/40 p-3 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </FormField>
          <FormField className="col-span-12 md:col-span-6" label="Slug (auto from title if blank)">
            <input
              name="slug"
              placeholder="stadium-club-live"
              className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none"
            />
          </FormField>
          <div className="col-span-12 md:col-span-6 flex items-end">
            <label className="flex items-center gap-3 font-sans text-[12px] text-cream/75">
              <input type="checkbox" name="is_published" defaultChecked className="h-4 w-4 accent-ember" />
              Published (visible on /mixes)
            </label>
          </div>
          <div className="col-span-12">
            <button
              type="submit"
              className="bg-cream px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
            >
              Create series →
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-serif text-[22px]">Existing</h2>
        <div className="mt-5 space-y-4">
          {(series ?? []).map((s) => (
            <details key={s.id} className="group border border-line bg-cream/[0.02] open:border-cream/40">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5">
                <div>
                  <div className="font-serif text-[20px] text-cream">{s.title}</div>
                  <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.22em] text-cream/45">
                    /mixes/series/{s.slug} · {s.is_published ? "Published" : "Hidden"}
                  </div>
                </div>
                <div className="font-sans text-[10px] uppercase tracking-[0.22em] text-cream/55 group-open:hidden">
                  Edit →
                </div>
              </summary>
              <form action={updateSeries} className="grid grid-cols-12 gap-4 border-t border-line p-5">
                <input type="hidden" name="id" value={s.id} />
                <FormField className="col-span-12 md:col-span-6" label="Title">
                  <input
                    name="title"
                    defaultValue={s.title}
                    required
                    className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream focus:border-cream focus:outline-none"
                  />
                </FormField>
                <FormField className="col-span-12 md:col-span-6" label="Subtitle">
                  <input
                    name="subtitle"
                    defaultValue={s.subtitle ?? ""}
                    className="w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream focus:border-cream focus:outline-none"
                  />
                </FormField>
                <FormField className="col-span-12" label="Description">
                  <textarea
                    name="description"
                    defaultValue={s.description ?? ""}
                    rows={2}
                    className="w-full border border-line bg-night/40 p-3 font-sans text-[13px] text-cream focus:border-cream focus:outline-none"
                  />
                </FormField>
                <div className="col-span-12 md:col-span-6 flex items-end">
                  <label className="flex items-center gap-3 font-sans text-[12px] text-cream/75">
                    <input
                      type="checkbox"
                      name="is_published"
                      defaultChecked={s.is_published}
                      className="h-4 w-4 accent-ember"
                    />
                    Published
                  </label>
                </div>
                <div className="col-span-12 flex justify-between gap-3">
                  <button
                    type="submit"
                    className="bg-cream px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
                  >
                    Save →
                  </button>
                </div>
              </form>
              <form action={deleteSeries} className="border-t border-line p-5">
                <input type="hidden" name="id" value={s.id} />
                <button
                  type="submit"
                  className="font-sans text-[10px] uppercase tracking-[0.22em] text-ember/80 transition hover:text-ember"
                >
                  Delete series (mixes detach but stay)
                </button>
              </form>
            </details>
          ))}
          {(!series || series.length === 0) && (
            <div className="border border-dashed border-line/60 p-6 font-sans text-[13px] text-cream/55">
              No series yet. Create the first one above.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FormField({
  className,
  label,
  children,
}: {
  className?: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/55">
        {label}
      </div>
      {children}
    </div>
  );
}
