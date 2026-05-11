"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitMixRequest(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in first");

  // Rate limit: 1 open request per member per calendar month
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const { data: recent } = await supabase
    .from("mix_requests")
    .select("id, created_at")
    .eq("member_id", user.id)
    .gte("created_at", monthAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(1);
  if (recent && recent.length > 0) {
    throw new Error(
      "You already submitted a mix request in the last 30 days. One per month keeps the queue manageable.",
    );
  }

  const title = String(formData.get("title") ?? "").trim() || null;
  const moodTagsRaw = String(formData.get("mood_tags") ?? "").trim();
  const moodTags = moodTagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const occasion = String(formData.get("occasion") ?? "").trim() || null;
  const lenRaw = String(formData.get("desired_length_minutes") ?? "").trim();
  const desiredLengthMinutes = lenRaw ? parseInt(lenRaw, 10) || null : null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const spotifyUrl = String(formData.get("spotify_playlist_url") ?? "").trim() || null;

  const { error } = await supabase.from("mix_requests").insert({
    member_id: user.id,
    title,
    mood_tags: moodTags,
    occasion,
    desired_length_minutes: desiredLengthMinutes,
    notes,
    spotify_playlist_url: spotifyUrl,
    status: "open",
  });
  if (error) throw new Error(error.message);

  revalidatePath("/account/request-mix");
  revalidatePath("/admin/requests");
}
