import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMuxConfig } from "@/lib/mux/client";
import { UploadMixForm } from "@/components/admin/UploadMixForm";

export const dynamic = "force-dynamic";

export default async function AdminNewMixPage() {
  const supabase = createAdminClient();
  const { data: series } = await supabase
    .from("series")
    .select("id, title")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  const muxReady = !!getMuxConfig();

  return (
    <div className="space-y-12">
      <div>
        <Link
          href="/admin/mixes"
          className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
        >
          ← All mixes
        </Link>
        <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
          — Upload a mix
        </p>
        <h1 className="mt-3 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
          New <span className="italic text-ember">mix.</span>
        </h1>
      </div>

      <div className="border border-line bg-cream/[0.02] p-7">
        {!muxReady ? (
          <div className="space-y-3">
            <div className="font-sans text-[11px] uppercase tracking-[0.28em] text-ember">
              ⚠ Mux not configured
            </div>
            <p className="font-sans text-[14px] leading-relaxed text-cream/70">
              The upload flow uses Mux for streaming. Set the Mux environment
              variables in Vercel and redeploy — see <code className="text-ember">MUX_SETUP.md</code> in your
              workspace folder for the step-by-step. You can still create draft
              mix metadata below; the file upload step will surface an error
              until credentials are in place.
            </p>
          </div>
        ) : null}

        <UploadMixForm series={series ?? []} />
      </div>
    </div>
  );
}
