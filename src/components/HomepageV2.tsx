"use client";

import { useEffect, useState, FormEvent } from "react";

/**
 * HomepageV2 — the new homepage, ported from homepage-preview.html.
 *
 * All sections live in this single file for simplicity and easy revert.
 * Styling lives in globals.css under .hp-* class names to preserve
 * pixel-fidelity with the approved preview. Reveal animations use the
 * .rv system (CSS keyframes with default-visible state) so the page
 * renders correctly if JS fails or hydration stalls.
 *
 * Sections, top → bottom:
 *   1. SiteNav       — fixed, transparent → solid on scroll
 *   2. Hero          — full-bleed video + serif headline
 *   3. Ticker        — infinite-scroll credentials strip
 *   4. Manifesto     — kept from prior site, cream/gold w/ vinyl backdrop
 *   5. FeatureMixes  — editorial block, dark gradient placeholder
 *   6. FeatureCraft  — editorial block, dark gradient placeholder (right-aligned)
 *   7. Stats         — 4-metric grid
 *   8. Standard      — 6-service grid
 *   9. Process       — 3-step booking flow
 *   10. Cities       — DFW + Worldwide
 *   11. BookForm     — writes to /api/booking-inquiry (Supabase-backed)
 *   12. Footer       — tagline + subscribe pill + social/copyright
 */
export default function HomepageV2() {
  return (
    <main className="hp">
      <SiteNav />
      <Hero />
      <Ticker />
      <Manifesto />
      <FeatureMixes />
      <FeatureCraft />
      <Stats />
      <Standard />
      <Process />
      <Cities />
      <BookForm />
      <Footer />
    </main>
  );
}

/* ─────────── NAV ─────────── */
function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`hp-nav${scrolled ? " scrolled" : ""}`}>
      <a className="hp-brand" href="#top">
        <span className="hp-brand-dot" />
        <span className="hp-brand-txt">Danny West</span>
      </a>
      <div className="hp-nav-links">
        <a href="#mixes">Mixes</a>
        <a href="#services">Services</a>
        <a href="/subscribe">Subscribe</a>
        <a className="hp-pill" href="#book">Book Danny</a>
      </div>
    </nav>
  );
}

/* ─────────── HERO ─────────── */
function Hero() {
  return (
    <header className="hp-hero" id="top">
      <video
        className="hp-hero-video"
        src="/video/hero-1080.mp4"
        poster="/video/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="hp-hero-veil" />
      <div className="wrap">
        <p className="label rv">Dallas · Worldwide — Bookings by inquiry</p>
        {/*
          Hero headline = wordmark logo.
          The <span className="sr"> preserves the semantic h1 text for search
          engines and screen readers ("A DJ that moves rooms.") while the
          <img> is the visible brand mark. `/brand/wordmark-white.png` is the
          same asset used in SiteNav so the file is guaranteed to exist.
        */}
        <h1 className="rv d1">
          <span className="sr">A DJ that moves rooms.</span>
          <img
            className="hp-hero-logo"
            src="/brand/wordmark-white.png"
            alt="DJ Danny West"
            width={1053}
            height={652}
          />
        </h1>
        <p className="hp-lede rv d2">
          Official DJ for the Dallas Cowboys Stadium Club and SiriusXM Channel 13, Pitbull&apos;s
          Globalization. Weddings, corporate, clubs, and private events — every room read, every
          night moved.
        </p>
        <div className="hp-cta-row rv d3">
          <a
            className="hp-pill solid"
            href="#book"
            style={{
              fontFamily: "var(--sans)",
              fontSize: 11,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "18px 40px",
            }}
          >
            Send a booking inquiry
          </a>
          <span className="hp-micro">New mixes weekly · Subscribers only</span>
        </div>
      </div>
      <div className="hp-scroll-hint">
        <span className="hp-scroll-lbl">Scroll</span>
        <div className="hp-scroll-bar" />
      </div>
    </header>
  );
}

/* ─────────── TICKER ─────────── */
function Ticker() {
  // Duplicated inline so the CSS `translateX(-50%)` keyframe loops seamlessly.
  const items = [
    "SiriusXM · Ch. 13",
    "Dallas Cowboys",
    "Pitbull's Globalization",
    "50 Cent · Final Lap Tour",
    "ESPN · Super Bowl",
    "Red Bull 3Style",
    "HBO Boxing",
    "House of Blues Vegas",
    "WARP Tokyo",
    "Club LIV Manchester",
    "SXSW",
  ];
  const rendered = [...items, ...items];
  return (
    <section className="hp-ticker-sec">
      <h2 className="rv">
        Some rooms you&apos;ll <span className="em">recognize</span>.
      </h2>
      <div className="hp-ticker rv d1">
        <div className="hp-ticker-track">
          {rendered.map((item, i) => (
            <span key={i}>
              {item}
              {i < rendered.length - 1 && <i>●</i>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── MANIFESTO ─────────── */
function Manifesto() {
  return (
    <section className="hp-manifesto">
      <div className="hp-vinyl" aria-hidden="true">
        <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", color: "#b39a63" }}>
          <circle cx="300" cy="300" r="298" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="300" cy="300" r="293" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <circle cx="300" cy="300" r="125" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
          <circle cx="300" cy="300" r="153" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
          <circle cx="300" cy="300" r="181" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
          <circle cx="300" cy="300" r="209" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
          <circle cx="300" cy="300" r="237" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
          <circle cx="300" cy="300" r="265" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.65" />
          <circle cx="300" cy="300" r="115" fill="currentColor" opacity="0.22" />
          <circle cx="300" cy="300" r="115" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="300" cy="300" r="6" fill="currentColor" opacity="0.85" />
        </svg>
      </div>
      <div className="wrap">
        <p className="hp-lede rv">
          The mixes you can&apos;t get on <span className="hp-em">Spotify</span>. The sets that don&apos;t exist on{" "}
          <span className="hp-em">SoundCloud</span>.
        </p>
        <div className="hp-grid">
          <div className="hp-card rv">
            <h4>New mixes uploaded weekly</h4>
            <p>Recorded live or in studio. Lossless audio. DJ sets you can play in any room.</p>
          </div>
          <div className="hp-card rv d1">
            <h4>Request what you want</h4>
            <p>Subscribers can request a mix. Post your Spotify or your favorite playlist, name the mix, and see if it makes the cut.</p>
          </div>
          <div className="hp-card rv d2">
            <h4>Hire your favorite DJ</h4>
            <p>Send a booking inquiry to get a courtesy discount on your first event — weddings, clubs, private.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── FEATURES ─────────── */
function FeatureMixes() {
  return (
    <section className="hp-feature hp-feature-mixes-bg" id="mixes">
      <div className="hp-shade" />
      <div className="wrap" style={{ width: "100%" }}>
        <div className="hp-inner">
          <p className="label rv">The mixes · Subscribers only</p>
          <h3 className="rv d1">
            The sets that don&apos;t exist on <span className="em">Spotify</span>.
          </h3>
          <p className="rv d2">
            New mixes uploaded weekly — recorded live or in studio, in lossless audio. Subscribers
            can request a mix: post your playlist, name the mix, and see if it makes the cut.
          </p>
          <a className="hp-cta rv d3" href="/subscribe">
            Subscribe to the mixes
          </a>
        </div>
      </div>
    </section>
  );
}

function FeatureCraft() {
  return (
    <section className="hp-feature right hp-feature-craft-bg">
      <div className="hp-shade" />
      <div className="wrap" style={{ width: "100%" }}>
        <div className="hp-inner">
          <p className="label rv">The craft · Reading the room</p>
          <h3 className="rv d1">
            A great set is never <span className="em">planned</span>. It&apos;s read.
          </h3>
          <p className="rv d2">
            From the Cowboys Stadium Club to a backyard in Southlake — the skill is the same. Watch
            the floor, catch the wave, and never let it break. Open format, Latin, hip-hop, house —
            whatever the room asks for.
          </p>
          <a className="hp-cta rv d3" href="#book">
            Book the room-reader
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────── STATS ─────────── */
function Stats() {
  return (
    <section className="hp-stats">
      <div className="wrap">
        <span className="label hp-stats-label rv">The record</span>
        <div className="hp-stat-grid">
          <div className="hp-stat rv">
            <b>
              6<i>+</i>
            </b>
            <span>Countries played</span>
          </div>
          <div className="hp-stat rv d1">
            <b>
              14<i>+</i>
            </b>
            <span>World stages</span>
          </div>
          <div className="hp-stat rv d2">
            <b>
              52<i>/yr</i>
            </b>
            <span>New mixes</span>
          </div>
          <div className="hp-stat rv d3">
            <b>
              Ch.<i>13</i>
            </b>
            <span>SiriusXM · Globalization</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── STANDARD (services grid) ─────────── */
function Standard() {
  const services = [
    { n: "01", title: "Weddings", body: "The one night that has to be perfect. From ceremony to last dance — a floor that never empties and a timeline that never slips." },
    { n: "02", title: "Quinceañeras", body: "Two generations, one dance floor. Bilingual sets that keep the abuelas and the teenagers moving in the same room." },
    { n: "03", title: "Corporate", body: "Product launches, galas, holiday parties. Professional, on-brand, on time — with a stage presence built on ESPN and HBO rooms." },
    { n: "04", title: "Clubs & Nightlife", body: "Resident-level open format honed from House of Blues Vegas to Club LIV Manchester to WARP Tokyo." },
    { n: "05", title: "Private Parties", body: "Birthdays, Sweet 16s, backyard takeovers. A world-stage DJ in your living room — full production included." },
    { n: "06", title: "School Dances & Proms", body: "Clean edits, current music, real energy. The dance they'll actually remember." },
  ];
  return (
    <section className="hp-standard" id="services">
      <div className="wrap">
        <span className="label hp-std-label rv">01 — The Danny West Standard</span>
        <h2 className="rv d1">
          Every event, played like it&apos;s the <span className="em">main</span> stage.
        </h2>
        <div className="hp-std-grid">
          {services.map((s, i) => (
            <div key={s.n} className={`hp-std rv${i % 3 === 1 ? " d1" : i % 3 === 2 ? " d2" : ""}`}>
              <span className="hp-std-num">{s.n}</span>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── PROCESS ─────────── */
function Process() {
  return (
    <section className="hp-process">
      <div className="wrap">
        <span className="label rv">02 — Booking</span>
        <h2 className="rv d1">
          Three steps. No <span className="em">silence</span> on the floor.
        </h2>
        <div className="hp-steps">
          <div className="hp-step rv">
            <div className="hp-big">1</div>
            <h4>
              The <i>inquiry</i>
            </h4>
            <p>
              Tell me the date, the venue, and the vibe. Every inquiry gets a personal reply — and a
              courtesy discount on your first event.
            </p>
          </div>
          <div className="hp-step rv d1">
            <div className="hp-big">2</div>
            <h4>
              The <i>plan</i>
            </h4>
            <p>
              One call to map the night — must-plays, do-not-plays, timeline, announcements. You get
              one point of contact: me.
            </p>
          </div>
          <div className="hp-step rv d2">
            <div className="hp-big">3</div>
            <h4>
              The room <i>moves</i>
            </h4>
            <p>
              Show up early, sound-check everything, read the floor all night. You host. I handle
              the energy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── CITIES ─────────── */
function Cities() {
  const cities = ["Dallas", "Fort Worth", "Arlington", "Plano", "Frisco", "Irving", "McKinney", "Southlake"];
  return (
    <section className="hp-cities">
      <div className="wrap">
        <p className="label rv">Serving</p>
        <h2 className="rv d1" style={{ marginTop: 20 }}>
          DFW is home. The <span className="em">world</span> is the venue.
        </h2>
        <div className="hp-city-row rv d2">
          {cities.map((c, i) => (
            <span key={c}>
              {c}
              {i < cities.length - 1 && <i>●</i>}
            </span>
          ))}
          <i>●</i>
          <span className="em" style={{ fontStyle: "italic" }}>Worldwide</span>
        </div>
      </div>
    </section>
  );
}

/* ─────────── BOOK FORM ─────────── */
function BookForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      event_date: String(data.get("event_date") || ""),
      event_type: String(data.get("event_type") || ""),
      venue: String(data.get("venue") || ""),
      vibe: String(data.get("vibe") || ""),
      source: "homepage",
    };
    try {
      const res = await fetch("/api/booking-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Something went wrong. Try again or email direct." }));
        throw new Error(body.error || "Something went wrong. Try again or email direct.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again or email direct.");
    }
  }

  return (
    <section className="hp-contact" id="book">
      <div className="wrap hp-contact-grid">
        <div>
          <span className="label rv">Bookings by inquiry</span>
          <h2 className="rv d1">
            Request the <span className="em">night</span>.
          </h2>
          <p className="hp-contact-sub rv d2">
            Tell me what you&apos;re planning. Every inquiry is read and answered personally — and
            first-time clients get a courtesy discount on their event.
          </p>
          <div className="hp-direct rv d3">
            <div>
              <small>Bookings</small>
              <a href="mailto:djdannywestbookings@gmail.com">djdannywestbookings@gmail.com</a>
            </div>
            <div>
              <small>Social</small>
              <a href="https://www.instagram.com/djdannywest/">@djdannywest</a>
            </div>
            <div>
              <small>Mixes</small>
              <a href="/subscribe">Subscribe — new mixes weekly</a>
            </div>
          </div>
        </div>

        {status === "success" ? (
          <p className="hp-form-success rv">
            Received. Expect a <span className="em">personal</span> reply shortly.
          </p>
        ) : (
          <form className="hp-form" onSubmit={onSubmit}>
            <div className="hp-field rv">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" placeholder="Your name" required />
            </div>
            <div className="hp-field rv d1">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@email.com" required />
            </div>
            <div className="hp-field rv d1">
              <label htmlFor="event_date">Event date</label>
              <input id="event_date" name="event_date" type="text" placeholder="MM / DD / YYYY" />
            </div>
            <div className="hp-field rv d2">
              <label htmlFor="event_type">Event type</label>
              <select id="event_type" name="event_type" required defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                <option>Wedding</option>
                <option>Quinceañera</option>
                <option>Corporate event</option>
                <option>Club / Nightlife</option>
                <option>Private party</option>
                <option>School dance / Prom</option>
                <option>Birthday / Sweet 16</option>
                <option>Something else</option>
              </select>
            </div>
            <div className="hp-field rv d2">
              <label htmlFor="venue">Venue &amp; city</label>
              <input id="venue" name="venue" type="text" placeholder="Where's the room?" />
            </div>
            <div className="hp-field rv d3">
              <label htmlFor="vibe">
                The vibe{" "}
                <span style={{ letterSpacing: 0, textTransform: "none", fontFamily: "var(--sans)", fontSize: 9 }}>
                  (optional)
                </span>
              </label>
              <textarea id="vibe" name="vibe" placeholder="Guest count, music you love, anything I should know…" />
            </div>
            {error && <p className="hp-form-error">{error}</p>}
            <button type="submit" className="rv d3" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send inquiry"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ─────────── FOOTER ─────────── */
function Footer() {
  return (
    <footer className="hp-footer">
      <div className="hp-foot-top">
        <div className="hp-foot-tag">
          A DJ that <i>moves</i> rooms.
        </div>
        <a
          className="hp-pill"
          href="/subscribe"
          style={{
            fontFamily: "var(--sans)",
            fontSize: 11,
            letterSpacing: ".24em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Subscribe Now
        </a>
      </div>
      <div className="hp-foot-bottom">
        <span>© 2026 Danny West · Dallas · Worldwide</span>
        <span>
          <a href="https://www.instagram.com/djdannywest/">Instagram</a> ·{" "}
          <a href="https://www.tiktok.com/@djdannywest">TikTok</a> ·{" "}
          <a href="mailto:djdannywestbookings@gmail.com">djdannywestbookings@gmail.com</a>
        </span>
      </div>
    </footer>
  );
}
