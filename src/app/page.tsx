import HomepageV2 from "@/components/HomepageV2";

// Homepage entry point. Everything lives inside HomepageV2 for now — one file,
// easy to revert. The old Hero / Marquee / Manifesto / Credits / Footer
// components are no longer imported here; they can be deleted or left in place
// (they're not referenced anywhere on the new homepage).
export default function Page() {
  return <HomepageV2 />;
}
