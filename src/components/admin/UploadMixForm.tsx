"use client";

import { useState, useTransition } from "react";
import { createDraftMix } from "@/app/admin/mixes/new/actions";

type Series = { id: string; title: string };

type Props = {
  series: Series[];
};

const LABEL = "font-sans text-[10px] uppercase tracking-[0.28em] text-cream/55";
const INPUT =
  "w-full border-0 border-b border-line bg-transparent py-2 font-sans text-[14px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none focus:ring-0";

type Phase =
  | { kind: "idle" }
  | { kind: "creating-mix" }
  | { kind: "awaiting-file"; mixSlug: string }
  | { kind: "uploading"; mixSlug: string; pct: number }
  | { kind: "done"; mixSlug: string }
  | { kind: "error"; message: string };

export function UploadMixForm({ series }: Props) {
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);

  async function handleCreate(formData: FormData) {
    setPhase({ kind: "creating-mix" });
    startTransition(async () => {
      const result = await createDraftMix(formData);
      if (!result.ok) {
        setPhase({ kind: "error", message: result.error });
        return;
      }
      setPhase({ kind: "awaiting-file", mixSlug: result.mixSlug });
    });
  }

  async function handleUpload() {
    if (phase.kind !== "awaiting-file" || !file) return;
    const slug = phase.mixSlug;
    setPhase({ kind: "uploading", mixSlug: slug, pct: 0 });
    try {
      // 1. Ask the server for a Mux direct-upload URL
      const urlResp = await fetch("/api/mux/upload-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mixSlug: slug }),
      });
      const urlData: { ok?: boolean; uploadUrl?: string; error?: string } =
        await urlResp.json();
      if (!urlResp.ok || !urlData.uploadUrl) {
        setPhase({
          kind: "error",
          message: urlData.error ?? "Couldn't get an upload URL from Mux.",
        });
        return;
      }

      // 2. PUT the file straight to Mux with progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", urlData.uploadUrl!);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setPhase({ kind: "uploading", mixSlug: slug, pct });
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Mux upload failed: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      setPhase({ kind: "done", mixSlug: slug });
    } catch (e) {
      setPhase({
        kind: "error",
        message: e instanceof Error ? e.message : "Upload failed.",
      });
    }
  }

  // Step 1: details form
  if (phase.kind === "idle" || phase.kind === "creating-mix" || phase.kind === "error") {
    return (
      <form action={handleCreate} className="space-y-6">
        <div className="grid grid-cols-12 gap-5">
          <Field className="col-span-12 md:col-span-8" label="Title">
            <input name="title" required placeholder="SiriusXM Pitbull Globalization" className={INPUT} />
          </Field>
          <Field className="col-span-12 md:col-span-4" label="Subtitle">
            <input name="subtitle" placeholder="Vol. 20" className={INPUT} />
          </Field>
          <Field className="col-span-12 md:col-span-6" label="Series">
            <select name="series_id" className="w-full border border-line bg-night/40 px-3 py-2 font-sans text-[14px] text-cream focus:border-cream focus:outline-none">
              <option value="">(no series)</option>
              {series.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>
          <Field className="col-span-6 md:col-span-3" label="Volume">
            <input name="volume" type="number" min={1} placeholder="20" className={INPUT} />
          </Field>
          <Field className="col-span-6 md:col-span-3" label="Slug (auto from title if blank)">
            <input name="slug" placeholder="siriusxm-globalization-vol-20" className={INPUT} />
          </Field>
          <Field className="col-span-12" label="Tags (comma separated)">
            <input name="tags" placeholder="latin, peak time, open format" className={INPUT} />
          </Field>
          <Field className="col-span-12" label="Cover URL (optional)">
            <input name="cover_url" placeholder="/cover-art/siriusxm-globalization-vol-20.svg" className={INPUT} />
          </Field>
          <Field className="col-span-12" label="Description (optional)">
            <textarea name="description" rows={2} className="w-full border border-line bg-night/40 p-3 font-sans text-[13px] text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none" />
          </Field>
        </div>
        {phase.kind === "error" && (
          <div className="font-sans text-[12px] text-ember">{phase.message}</div>
        )}
        <button
          type="submit"
          disabled={phase.kind === "creating-mix"}
          className="bg-cream px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember disabled:opacity-60"
        >
          {phase.kind === "creating-mix" ? "Creating…" : "Create draft mix →"}
        </button>
        <p className="font-sans text-[11px] text-cream/45">
          Creates the mix record. Next step: attach the audio file (Mux upload).
        </p>
      </form>
    );
  }

  // Step 2: file picker + upload
  if (phase.kind === "awaiting-file") {
    return (
      <div className="space-y-5">
        <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/55">
          ✓ Mix created · slug: <span className="text-cream">{phase.mixSlug}</span>
        </div>
        <p className="font-sans text-[13px] text-cream/65">
          Now pick the audio file. It uploads straight to Mux, then Mux encodes it
          and pings our webhook — your mix shows up as ready in a minute or two.
        </p>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full font-sans text-[13px] text-cream file:mr-4 file:border-0 file:bg-cream file:px-4 file:py-2 file:font-sans file:text-[11px] file:uppercase file:tracking-[0.22em] file:text-night hover:file:bg-ember"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file}
          className="bg-ember px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember/85 disabled:opacity-50"
        >
          Upload to Mux →
        </button>
      </div>
    );
  }

  if (phase.kind === "uploading") {
    return (
      <div className="space-y-4">
        <div className="font-sans text-[10px] uppercase tracking-[0.28em] text-cream/55">
          Uploading · {phase.pct}%
        </div>
        <div className="h-1 w-full bg-line">
          <div className="h-full bg-ember transition-all" style={{ width: `${phase.pct}%` }} />
        </div>
      </div>
    );
  }

  // Done
  return (
    <div className="space-y-4">
      <div className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream">
        ✓ Upload complete
      </div>
      <p className="font-sans text-[13px] text-cream/70">
        Mux is encoding the file. When it&apos;s ready, the webhook will set the
        playback ID on this mix and you can publish it from{" "}
        <a href="/admin/mixes" className="text-ember underline">
          /admin/mixes
        </a>
        .
      </p>
    </div>
  );
}

function Field({
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
      <div className={LABEL}>{label}</div>
      {children}
    </div>
  );
}
