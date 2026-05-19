import { signOut } from "@/app/auth/actions";
import { getInsiderAccess } from "@/lib/supabase/insiderAccess";

/**
 * Active section in the account sidebar. The page passes this so the
 * matching link is highlighted.
 */
export type AccountSection =
  | "dashboard"
  | "library"
  | "insider"
  | "request"
  | "custom"
  | "subscription"
  | "notifications";

type Props = {
  active: AccountSection;
  /** Member name (or null) shown at the top of the sidebar. */
  displayName: string;
  /** Member email shown under the name. */
  email: string;
  children: React.ReactNode;
};

/**
 * Two-column layout used by every /account/* page:
 *   - Desktop: persistent left sidebar with all account nav + sign out.
 *   - Mobile: sidebar collapses to a horizontal tab strip above content.
 *
 * The sidebar pins account "chrome" (subscription / notifications / sign
 * out) where settings belong so the main content area can focus on
 * music + actions.
 */
export async function AccountShell({
  active,
  displayName,
  email,
  children,
}: Props) {
  // Members who pass the Insider gate get the link. Public users + members
  // without access never see it (same logic as the global SiteNav).
  const insider = await getInsiderAccess();
  const showInsider = insider.ok;

  return (
    <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-x-12 px-6 pb-24 pt-12 md:grid-cols-[260px_1fr] md:px-12 md:pt-16">
      {/* Decorative ember glow — desktop only */}
      <div className="pointer-events-none absolute -left-[10%] top-0 hidden h-[40vh] w-[40vh] rounded-full bg-ember/12 blur-[180px] md:block" />

      {/* SIDEBAR */}
      <aside className="relative">
        {/* Member identity block — desktop only */}
        <div className="hidden md:block">
          <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
            <div className="mb-3 h-px w-12 bg-ember/70" />
            Member
          </div>
          <div className="mt-4 font-display text-[24px] font-light leading-tight text-cream">
            {displayName}
          </div>
          <div className="mt-1 break-all font-sans text-[12px] text-cream/45">
            {email}
          </div>
        </div>

        {/* Nav — desktop = stacked, mobile = horizontal scroller */}
        <nav className="-mx-6 mt-0 flex gap-2 overflow-x-auto border-b border-line px-6 py-3 md:mx-0 md:mt-10 md:flex-col md:gap-0 md:overflow-visible md:border-0 md:px-0 md:py-0">
          <SidebarSection title="Listen">
            <SidebarLink href="/account" active={active === "dashboard"}>
              Dashboard
            </SidebarLink>
            <SidebarLink href="/mixes/library" active={active === "library"}>
              Mix library
            </SidebarLink>
            {showInsider ? (
              <SidebarLink href="/insider" active={active === "insider"}>
                Insider
              </SidebarLink>
            ) : null}
          </SidebarSection>
          <SidebarSection title="Get a mix">
            <SidebarLink href="/account/request-mix" active={active === "request"}>
              Request a mix
            </SidebarLink>
            <SidebarLink href="/account/custom-mix" active={active === "custom"}>
              Custom mix · $100
            </SidebarLink>
          </SidebarSection>
          <SidebarSection title="Account">
            <SidebarLink
              href="/account/subscription"
              active={active === "subscription"}
            >
              Subscription
            </SidebarLink>
            <SidebarLink
              href="/account/notifications"
              active={active === "notifications"}
            >
              Notifications
            </SidebarLink>
            <form action={signOut} className="hidden md:block">
              <button
                type="submit"
                className="block w-full px-4 py-2.5 text-left font-sans text-[12px] uppercase tracking-[0.22em] text-cream/55 transition hover:text-ember"
              >
                Sign out
              </button>
            </form>
          </SidebarSection>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="relative mt-10 md:mt-0">{children}</main>
    </div>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex shrink-0 gap-1 md:mt-7 md:flex-col md:gap-0 md:first:mt-0">
      {/* Section label — desktop only */}
      <div className="hidden md:mb-2 md:block md:px-4">
        <div className="font-sans text-[9px] uppercase tracking-[0.32em] text-cream/35">
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`shrink-0 whitespace-nowrap rounded-sm px-4 py-2.5 font-sans text-[12px] uppercase tracking-[0.22em] transition md:rounded-none md:border-l-2 ${
        active
          ? "border-ember bg-cream/[0.04] text-cream"
          : "border-transparent text-cream/55 hover:bg-cream/[0.02] hover:text-cream"
      }`}
    >
      {children}
    </a>
  );
}
