# DJ Danny West

Premium subscription streaming site + booking funnel for DJ Danny West.

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css`)
- Motion (Framer Motion successor) for entrance + scroll animations
- Fraunces (display, variable) + Inter (body) via `next/font`

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Build
```bash
npm run build
npm start
```

## Project structure
```
src/
  app/
    globals.css      Design tokens (colors, fonts, grain) + Tailwind v4 @theme
    layout.tsx       Root layout, font loading, metadata
    page.tsx         Homepage — composes Hero + Manifesto
  components/
    Hero.tsx         Hero section: nav, editorial headline, portrait card, marquee
    Marquee.tsx      Infinite scroll mix-title ticker
    Manifesto.tsx    Below-fold scroll-revealed ethos + 3-pillar grid
```

## Design system
Defined in `src/app/globals.css` under `@theme`. Use semantic Tailwind classes:
- `bg-night` / `text-cream` / `text-ember` etc.
- `font-display` (Fraunces) / `font-sans` (Inter)
- `.opsz-display` / `.opsz-section` / `.opsz-text` for Fraunces optical-size axis presets
- `.grain` for SVG noise overlay (use with `mix-blend-overlay`)

See `PROGRESS.md` for current state and what's next.
