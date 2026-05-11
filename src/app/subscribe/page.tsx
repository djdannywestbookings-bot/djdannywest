import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Subscribe",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// Square hosted checkout link for the Monthly Membership.
// Configured once in Square Dashboard; carries plan / cadence / receipt.
const SQUARE_CHECKOUT_URL = "https://square.link/u/dSVJQXec";

export default async function SubscribePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/subscribe");

  // Check if they already have an active subscription or comp access
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("member_id", user.id)
    .eq("status", "ACTIVE")
    .maybeSingle();

  // Pre-fill the email at Square checkout so the webhook can match them
  // back to our member account.
  const checkoutUrl = user.email
    ? `${SQUARE_CHECKOUT_URL}?prefilled_email=${encodeURIComponent(user.email)}`
    : SQUARE_CHECKOUT_URL;

  return (
    <main className="bg-night text-cream">
      <SiteNav />
      <section className="mx-auto grid min-h-[80vh] max-w-[1200px] grid-cols-1 gap-12 px-6 pb-24 pt-20 md:grid-cols-12 md:px-12 md:pt-24">
        <div className="md:col-span-5">
          <Link
            href="/mixes"
            className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
          >
            ← Back
          </Link>
          <p className="mt-6 font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
            — Become a member
          </p>
          <h1 className="mt-4 font-serif text-[56px] leading-[0.95] tracking-[-0.02em] md:text-[80px]">
            $20 <span className="italic text-ember">a month.</span>
          </h1>
          <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-cream/65">
            Full archive. New mixes uploaded weekly. Request a mix. Subscriber
            booking discount on your first event. Cancel any time.
          </p>
          <ul className="mt-8 space-y-3 font-sans text-[13px] text-cream/65">
            <li>· The full mix archive</li>
            <li>· New mixes every week</li>
            <li>· Submit a mix request once a month</li>
            <li>· 10% off your first booking</li>
            <li>· Cancel any time, no questions</li>
          </ul>
        </div>

        <div className="md:col-span-7">
          {existing ? (
            <div className="border border-cream/30 bg-cream/[0.04] p-8">
              <h2 className="font-serif text-[28px] text-cream">
                You&apos;re already subscribed.
              </h2>
              <p className="mt-4 font-sans text-[14px] text-cream/65">
                Streaming is on. Head to your member library.
              </p>
              <Link
                href="/mixes/library"
                className="mt-6 inline-flex bg-cream px-6 py-3 font-sans text-[11px] uppercase tracking-[0.24em] text-night transition hover:bg-ember"
              >
                Open library →
              </Link>
            </div>
          ) : (
            <div className="border border-line bg-cream/[0.02] p-8">
              <h2 className="font-serif text-[28px] text-cream">
                Continue to checkout
              </h2>
              <p className="mt-4 max-w-md font-sans text-[14px] leading-relaxed text-cream/65">
                You&apos;ll be sent to Square&apos;s secure checkout to complete
                your subscription. Pick the <strong>Subscription — Monthly
                ($20)</strong> option, not One-time purchase. Use the same email
                you signed up with here so we can unlock your library
                automatically.
              </p>
              <a
                href={checkoutUrl}
                className="mt-8 inline-flex items-center bg-ember px-7 py-4 font-sans text-[12px] uppercase tracking-[0.24em] text-night transition hover:bg-cream"
              >
                Subscribe via Square →
              </a>
              <p className="mt-6 font-sans text-[11px] uppercase tracking-[0.18em] text-cream/45">
                Powered by Square · $20/mo · Cancel anytime
              </p>
              <div className="mt-10 border-t border-line pt-6">
                <p className="font-sans text-[12px] leading-relaxed text-cream/55">
                  After paying, your library unlocks within a minute. If it
                  doesn&apos;t, email{" "}
                  <a
                    className="underline hover:text-cream"
                    href="mailto:djdannywestbookings@gmail.com"
                  >
                    djdannywestbookings@gmail.com
                  </a>{" "}
                  and we&apos;ll sort it.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
