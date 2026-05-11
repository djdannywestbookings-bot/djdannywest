import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/series", label: "Series" },
  { href: "/admin/mixes", label: "Mixes" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/bookings", label: "Bookings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gate = await requireAdmin();
  if (!gate.ok && gate.reason === "unauthenticated") redirect("/login?next=/admin");
  if (!gate.ok) redirect("/account");

  return (
    <div className="min-h-screen bg-night text-cream">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-8">
            <Link
              href="/admin"
              className="font-sans text-[11px] uppercase tracking-[0.32em] text-cream/80 transition hover:text-ember"
            >
              Danny West · Admin
            </Link>
            <nav className="hidden gap-7 md:flex">
              {navItems.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
            >
              ← View site
            </Link>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1400px] gap-6 overflow-x-auto px-6 pb-3 lg:px-10 md:hidden">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/55 transition hover:text-cream"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
        {children}
      </main>
    </div>
  );
}
