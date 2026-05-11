import { NextResponse } from "next/server";

/** Square integration removed — site now uses Stripe. */
export function POST() {
  return NextResponse.json(
    { error: "Square integration removed — use Stripe at /api/stripe/webhook" },
    { status: 410 },
  );
}
export function GET() {
  return NextResponse.json({ status: "deprecated: site uses Stripe" }, { status: 410 });
}
