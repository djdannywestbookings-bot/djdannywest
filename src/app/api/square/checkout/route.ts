import { NextResponse } from "next/server";

/**
 * Legacy custom-checkout endpoint. Replaced by Square hosted checkout link
 * (Path B) — see src/app/subscribe/page.tsx. Members are now redirected to
 * Square's checkout page; we no longer accept card nonces server-side.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Checkout moved",
      message:
        "Use the Subscribe button on /subscribe — it redirects to Square's hosted checkout.",
    },
    { status: 410 },
  );
}

export async function GET() {
  return NextResponse.json({ status: "deprecated: use /subscribe" }, { status: 410 });
}
