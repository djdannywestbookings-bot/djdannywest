import { NextResponse } from "next/server";

/** Square integration removed — cancel via Stripe Customer Portal. */
export function POST() {
  return NextResponse.json(
    { error: "Square integration removed — use Stripe Customer Portal at /api/stripe/portal" },
    { status: 410 },
  );
}
export function GET() {
  return NextResponse.json({ status: "deprecated: site uses Stripe" }, { status: 410 });
}
