import Image from "next/image";
import { getCurrentUser } from "@/lib/supabase/getUser";
import { getInsiderAccess } from "@/lib/supabase/insiderAccess";
import { signOut } from "@/app/auth/actions";

type Props = {
  active?: "mixes" | "book" | "merch" | "insider";
  /** When the nav sits over a hero with its own video/photography, pass `false` so it floats transparently. */
  solid?: boolean;
};

/**
 * Site navigation header.
 * Async server component — auth-aware so the right-hand button reflects whether
 * the visitor is signed in (Member Login vs My Account + Sign out).
 */
export async function SiteNav({ active, solid = true }: Props) {
  const user = await getCurrentUser();
  // The Insider link is only rendered for visitors who actually have access —
  // keeps public visitors from even knowing the section exists.
  const insider = user ? await getInsiderAccess() : null;
  const showInsider = !!insider && insider.ok;

  const link = (key: string, label: string, href: string) => (
    <a
      href={href}
      className={`transition hover:text-cream ${
        active === key ? "text-cream" : "text-cream/65"
      }`}
    >
      {label}
    </a>
  );

  return (
    <header
      className={`${
        solid ? "relative" : "absolute left-0 right-0 top-0"
      } z-30 mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-12 md:py-8`}
    >
      <a href="/" className="flex items-center gap-3">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
        </span>
        <Image
          src="/brand/wordmark-white.png"
          alt="Danny West"
          width={1053}
          height={652}
          priority
          className="h-9 w-auto md:h-10"
        />
      </a>
      <nav className="hidden items-center gap-10 font-sans text-[10px] uppercase tracking-[0.32em] md:flex">
        {link("mixes", "Mixes", "/mixes")}
        {link("book", "Book", "/book")}
        {showInsider ? link("insider", "Insider", "/insider") : null}
        {link("merch", "Merch", "/merchandise")}
      </nav>

      {user ? (
        <div className="flex items-center gap-4">
          <form action={signOut} className="hidden md:block">
            <button
              type="submit"
              className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45 transition hover:text-ember"
            >
              Sign out
            </button>
          </form>
          <a
            href="/account"
            className="bg-cream px-4 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.32em] text-night transition hover:bg-ember"
          >
            My Account →
          </a>
        </div>
      ) : (
        <a
          href="/login"
          className="bg-cream px-4 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.32em] text-night transition hover:bg-ember"
        >
          Member Login →
        </a>
      )}
    </header>
  );
}
