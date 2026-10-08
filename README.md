# Tuan Hung Vu Technologies Pte. Ltd.

**A technology company exploring AI security and business integrity.**

Business logic. Protected by design.

Our business story began in 2023 and grew out of an AI-security hackathon in Singapore. The startup was accelerated by **BLOCK71**; its address is **Ayer Rajah Industrial Estate, Singapore**. No additional street, building, unit or postal details are supplied. This repository is the company website and a deterministic business-action verification research preview. No production enforcement, award, certification, named investor, or additional regional office is claimed.

## Local development

Use Node.js 24 LTS or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000/en. English is default; Simplified Chinese is `/zh`. Each language includes home, product, simulator, architecture, pricing, About us, contact, and privacy. Other locales are not published.

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

## Docker production preview

```sh
docker compose up --build -d
```

Open **http://localhost:3100/en** or **http://localhost:3100/zh**. The Node.js 24 standalone server runs as an unprivileged user, with dropped capabilities, an HTTP health check, and a localhost-only port.

```sh
docker compose ps
docker compose logs --tail=50 web
docker compose down
```

Public metadata is baked into the image. Rebuild with an approved public domain before publishing:

```sh
NEXT_PUBLIC_SITE_URL=https://your-confirmed-domain.example docker compose up --build -d
```

Do not keep the example domain. Localhost builds remain noindex. The GitHub repository URL is unchanged; no repository rename or new public deployment is part of this rebrand.

## Browser checks

```sh
npx playwright install chromium
TEST_BASE_URL=http://localhost:3100 TEST_CANONICAL_ORIGIN=http://localhost:3100 npm run test:browser
```

Checks cover all 16 localized pages, responsive widths, company branding, removed language routes, metadata, the Singapore story, simulator scenarios, approval invalidation, replay/evidence blocks, copy/download fallback, contact validation, and email composition. They do not send email. Screenshots are saved in ignored `artifacts/screenshots/`.

## Identity and design

- The sole public brand is **Tuan Hung Vu Technologies Pte. Ltd.** The two-line company lockup uses the full name, not a separate product brand.
- Professional, light-first company identity: warm white, deep navy, a restrained vermilion accent, Geist Sans, and native CSS.
- Original folded company monogram, authored in Blender and exported as a primary vector mark: `public/brand/company-mark.svg`.
- Artwork source: `public/brand/company-monogram.blend`; rendered study: `public/brand/company-monogram.png`. Blender source is excluded from the Docker runtime image.
- The retired artwork is archived locally outside `public/`, not served or committed as current branding.
- Shared design system: `design.md` and `tokens.css`.

## Functionality and boundaries

The refund simulator is deterministic and local. It uses fictional USD data and never intercepts a live agent or executes a payment. It demonstrates explicit business rules, trusted-state requirements, exact-action approval binding, reason codes, and decision-record exports.

Demo, sales, and design-partner enquiries prepare an email to **contact@tuanhungvu.com** in the visitor’s own mail application. The visitor reviews and sends it; the website does not claim receipt or delivery.

Indicative commercial tiers: free research demo, USD 249/month team-pilot planning tier, custom enterprise discussions. Final prices, scope, and production availability need approval. No checkout or billing system is implemented.

## SEO, AEO and analytics

Next.js 16 static Server Components distribute through the CDN; the runtime is the default Node.js runtime, not deprecated Edge Functions. The site has English/Chinese canonical and hreflang metadata, sitemap, robots, social cards, organization and FAQ JSON-LD, and `public/llms.txt`. These aid discovery but do not guarantee rankings or AI citations.

Set `NEXT_PUBLIC_SITE_URL` to your approved public origin in `.env.local` or at build time. Until a non-local origin is configured, robots.txt disallows crawling and pages are noindex.

Vercel Web Analytics is installed but disabled by default. Enable it in the hosting project and set `NEXT_PUBLIC_ENABLE_ANALYTICS=true` only after approving telemetry. The privacy disclosure follows the build flag; custom events contain no form fields, names, emails, transaction payloads, or amounts.

## Documentation

- [Project scope](docs/PROJECT.md)
- [Architecture and trust boundaries](docs/ARCHITECTURE.md)
- [Launch checklist](docs/LAUNCH.md)

## Dependency audit

Run `npm audit --omit=dev` for runtime dependencies. Development lint tooling still has an upstream `braces` advisory through `fast-glob`/`micromatch` without a compatible patched release at setup time. Do not downgrade Next.js or run `npm audit fix --force` just to silence it. Avoid untrusted glob input in development tooling and update when upstream releases a fix.
