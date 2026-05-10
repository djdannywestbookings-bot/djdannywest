# DJ Danny West — Progress

Last updated: 2026-05-10

## Done
- Project scaffolded: Next.js 16 (App Router) + TypeScript + Tailwind v4 + Motion (Framer Motion successor) + ESLint
- Design system v0: Fraunces (display, variable) + Inter (body), warm dark palette (`night`, `cream`, `ember`)
- Homepage Hero v0: editorial headline "Sets that move rooms.", placeholder portrait card with rotating vinyl rings + DW monogram watermark, primary CTA "Subscribe — $20/mo", secondary "Book Danny — from $1,500", scrolling marquee of mix titles
- Manifesto section v0: section label, large editorial paragraph, 3-pillar grid (mixes / requests / bookings)
- Domain purchased: djdannywest.com (in Cloudflare)
- TypeScript clean (`tsc --noEmit`), production build compiles clean

## In progress
- Awaiting Danny's review of Hero v0 screenshots before iterating on the look

## Blocked / waiting on Danny
- GitHub account confirmation + repo creation (or grant CLI access)
- Vercel signup + repo connection
- Real photography of Danny (for v1 hero portrait)
- Logo / wordmark direction (for v1)

## Next
1. Iterate on hero based on Danny's feedback
2. Push to GitHub
3. Deploy to Vercel staging
4. Verify on Danny's actual phone + laptop
5. Build the second page (Mixes index — locked grid of mixes with paywall CTAs)

## Stack and services (locked)
- Next.js 16 + TypeScript + Tailwind v4 + Motion — frontend
- Supabase (Postgres + Auth + Storage) — to be added when we build accounts
- Mux — to be added when we build the player
- Stripe — to be added when we build subscriptions
- Resend — to be added when we wire transactional email
- PostHog — to be added when we ship to staging
- Vercel — hosting (Hobby tier for staging, Pro for prod)
- Cloudflare — DNS

## Open risks (not yet addressed)
- Music licensing for streamed mixes (the single biggest business risk — flagged in the brief)
- Auto-renewal disclosure language on checkout (CA law) — owed at checkout build
- ToS / Privacy / Cookie pages — placeholders to be added pre-launch, lawyer review required
