# THV-guard

**An AI business-action verification research preview by Tuan Hung Vu Technologies Pte. Ltd.**

Verify the action. Not just the agent.

## Run

Use Node.js 24 LTS or newer. This repository was verified with Node.js 26.

```sh
npm ci
npm run dev
```

Open http://localhost:3000/en. English is the default; Vietnamese is `/vi`, Simplified Chinese is `/zh`. Each language includes home, product, policy simulator, architecture, pricing, About us, contact, and privacy pages. The About page connects the business story beginning in 2023 to the motivation for guarding business logic.

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm run start -- --port 3100
```

### Browser verification

```sh
npx playwright install chromium
TEST_BASE_URL=http://localhost:3100 npm run test:browser
```

Keep the production server running in another terminal. `TEST_CANONICAL_ORIGIN` defaults to `http://localhost:3000`; set it to match `NEXT_PUBLIC_SITE_URL` when testing a configured build. Browser checks cover all 24 localized pages at 320, 375, 414, 768, and 1440px, language switching, metadata, social images, the four policy scenarios, approval invalidation, replay/evidence checks, download/copy fallback, contact validation, and email draft composition. They do not send email. Screenshots are written to the ignored `artifacts/screenshots/` directory.

## Docker production preview

```sh
docker compose up --build -d
```

Open **http://localhost:3100/en** (or `/vi`, `/zh`). The container runs the compiled Next.js standalone server as an unprivileged user, with dropped capabilities, an HTTP health check, and a localhost-only published port. Build dependencies and Blender source are not shipped in the runtime image.

```sh
docker compose ps
docker compose logs --tail=50 web
docker compose down
```

Public metadata is baked into the image. For a confirmed public domain, rebuild with:

```sh
NEXT_PUBLIC_SITE_URL=https://your-confirmed-domain.example docker compose up --build -d
```

Do not use the example domain unchanged. Localhost builds remain noindex. Analytics stays off unless explicitly enabled at build time.

Test Docker with:

```sh
TEST_BASE_URL=http://localhost:3100 TEST_CANONICAL_ORIGIN=http://localhost:3100 npm run test:browser
```

## What is implemented

- Next.js 16 App Router, React 19, TypeScript, native CSS, Geist fonts.
- Static server-rendered marketing pages for CDN delivery; default Node.js runtime, not deprecated Edge Functions.
- Hallmark-guided dark techno/security visual system, portable `tokens.css`.
- Original Blender shield logo: `public/brand/thv-guard-logo.blend`, PNG, and vector SVG.
- Animated action-verification flow with pause and reduced-motion support; no WebGL or animation library.
- Deterministic **local** refund simulator with immutable approval binding, reason codes, checklist, and JSON exports.
- Demo, sales, and design-partner email composition to **contact@tuanhungvu.com**. Your email app opens a draft; you review and send it yourself. No fake receipt confirmation.
- Localized metadata, canonical/hreflang tags, sitemap, robots, Open Graph cards, semantic FAQs with JSON-LD, and `public/llms.txt` for answer-engine discovery. These make content accessible; they do not guarantee search rankings or AI citations.
- Optional cookie-less Vercel Web Analytics and non-personal custom events, **off by default**.

## Configure before publishing

Copy `.env.example` to `.env.local`, and set `NEXT_PUBLIC_SITE_URL` to your confirmed public origin. Until a non-local origin is configured, pages are **noindex** and robots.txt disallows crawlers. Rebuild after changes.

To enable analytics, activate Web Analytics in your Vercel project and set `NEXT_PUBLIC_ENABLE_ANALYTICS=true`. The privacy page reflects the build configuration. No personal form fields or transaction payloads are tracked.

No external services, databases, payment processing, or email-delivery credentials are required. No hosted project has been provisioned and no site has been publicly deployed. On Vercel, use Node.js 24 and the standard Next.js preset. Update the installed Vercel CLI before deploying: `npm i -g vercel@latest`.

## Honest product boundaries

The supplied ActionProof PRD defines a **research preview**, adapted here to the solution name **THV-guard**. No production enforcement engine, live gateway interception, SDK integration, certification, signed approvals, or guaranteed audit integrity is claimed. Procurement and finance are research directions; refund is the detailed interactive demo.

Pricing is **draft/indicative**: free research demo, S$249/month team pilot planning tier, and custom enterprise. Confirm final pricing and availability before publication. Singapore enterprise backing is described as provided; no specific investor name, grant body, logo, or endorsement is invented.

## Documentation

- [Project description and PRD mapping](docs/PROJECT.md)
- [Architecture and trust boundaries](docs/ARCHITECTURE.md)
- [Launch checklist](docs/LAUNCH.md)

## Dependency audit

`npm audit --omit=dev` verifies the production dependency set. The generated ESLint/Next lint tooling currently includes a `braces` advisory through `fast-glob`/`micromatch`; the registry has no patched compatible version at the time of setup. Do not downgrade Next.js or run `npm audit fix --force` to silence this. Avoid processing untrusted glob patterns in development tooling and update when upstream releases a fix. This affects development tooling, not the shipped runtime dependencies.
