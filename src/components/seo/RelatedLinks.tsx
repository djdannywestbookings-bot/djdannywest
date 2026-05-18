/**
 * Internal-linking cluster surfaced near the bottom of every city + service
 * page. Crawler reads: each city links to every service, each service links
 * to every city — tight topical cluster for local SEO.
 *
 * Also useful to visitors: pick your fit fast.
 */

type Link = { label: string; href: string };

const SERVICES: Link[] = [
  { label: "Wedding DJ", href: "/services/weddings" },
  { label: "Quinceañera DJ", href: "/services/quinceaneras" },
  { label: "Corporate DJ", href: "/services/corporate" },
  { label: "Private Parties", href: "/services/private-parties" },
  { label: "Clubs · Nightlife", href: "/services/clubs" },
  { label: "School Dances · Proms", href: "/services/school-dances" },
  { label: "Birthdays · Sweet 16", href: "/services/birthdays" },
];

const CITIES: Link[] = [
  { label: "Dallas", href: "/dj-dallas" },
  { label: "Fort Worth", href: "/dj-fort-worth" },
  { label: "Arlington", href: "/dj-arlington" },
  { label: "Plano", href: "/dj-plano" },
  { label: "Frisco", href: "/dj-frisco" },
  { label: "Irving", href: "/dj-irving" },
  { label: "McKinney", href: "/dj-mckinney" },
  { label: "Southlake", href: "/dj-southlake" },
];

type Props = {
  /** When set, the matching link in its column is rendered without a hyperlink. */
  currentService?: string;
  currentCity?: string;
};

export function RelatedLinks({ currentService, currentCity }: Props) {
  const renderLink = (l: Link, isCurrent: boolean) =>
    isCurrent ? (
      <span className="font-sans text-[13px] text-cream/40">{l.label}</span>
    ) : (
      <a
        href={l.href}
        className="font-sans text-[13px] text-cream/75 transition hover:text-cream"
      >
        {l.label}
      </a>
    );

  return (
    <section className="relative overflow-hidden border-b border-line bg-night py-20 md:py-24">
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay" />
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-12">
        <div className="md:col-span-3">
          <div className="font-sans text-[10px] uppercase tracking-[0.32em] text-cream/45">
            Find your fit
          </div>
          <h2 className="opsz-section mt-3 font-display text-[28px] font-light leading-[1.05] tracking-[-0.02em] text-cream md:text-[34px]">
            Pick a <span className="italic">service.</span>
            <br />
            Pick a <span className="italic">city.</span>
          </h2>
        </div>

        <div className="md:col-span-5">
          <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
            DFW DJ Services
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SERVICES.map((l) => (
              <li key={l.href}>
                {renderLink(l, !!currentService && l.href === currentService)}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="mb-5 font-sans text-[10px] uppercase tracking-[0.32em] text-ember">
            Cities I serve
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {CITIES.map((l) => (
              <li key={l.href}>
                {renderLink(l, !!currentCity && l.href === currentCity)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
