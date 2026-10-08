# Company website architecture

## Current system

The Tuan Hung Vu Technologies Pte. Ltd. website uses Next.js 16 App Router, React 19, TypeScript and native CSS. Marketing/content pages are statically rendered for CDN delivery. The default Node.js runtime is used, not Edge Functions. Docker runs the Next.js standalone server as an unprivileged user on Node.js 24.

English and Simplified Chinese are the only supported locales. Root redirects to `/en`; unknown locales and unsupported slugs return 404. Locale validation, metadata, sitemap and language controls use the same `locales` source. There is no separate product brand.

## Ownership

| File or directory | Responsibility |
| --- | --- |
| `src/app/(entry)` | Root redirect |
| `src/app/[locale]` | Locale layout, marketing/content routes and social card |
| `src/components/company-brand.tsx` | Single company lockup shared by header/footer |
| `src/components/site-header.tsx` | Navigation and English/Chinese language switching |
| `src/components/guard-animation.tsx` | Native animated action-verification illustration, pause and reduced-motion |
| `src/components/simulator.tsx` | Local refund controls and decision inspection |
| `src/components/contact-form.tsx` | Validation, email-draft composition and manual fallback |
| `src/lib/i18n.ts` | Company identity, supported locales, text selection and email helper |
| `src/lib/content.ts`, `src/lib/about.ts` | English/Chinese content and company story |
| `src/lib/policy.ts` | Pure deterministic refund evaluation |
| `design.md`, `tokens.css`, `src/app/globals.css` | Shared company design system |
| `public/brand` | Current vector monogram, PNG study and original Blender source |

The retired artwork and starter favicon are archived in ignored local artifacts, outside the served public directory. No old asset is used by current metadata or navigation.

## Simulation trust boundary

`evaluate` accepts an explicit proposed action, trusted-state fixture, approval snapshot and clock. Amounts use safe integer cents. The fictional order is ORD-2048: USD 250 paid, USD 50 previously refunded, USD 200 remaining, approval threshold USD 100.

Checks cover valid inputs and clock, required evidence, authorized tool, order/currency agreement, remaining balance, action expiry, action-ID replay, and exact unexpired approval binding. Approval includes the action, agent, requesting principal, tool, order, amount, currency, recipient and expiry. Changing any binding parameter invalidates the old approval. An approval never overrides the refundable balance.

The evaluator returns ALLOW, REQUIRE_APPROVAL or BLOCK, reason codes, checks and detached input snapshots. Editing UI context clears its current decision and exports. JSON can be copied or downloaded; clipboard denial and unavailable downloads have visible fallback messages.

The browser supplies all evidence and approval for the demo. There is no live API interception, authenticated approver, authoritative policy server, payment execution, durable replay ledger or immutable audit store. A decision is not execution. Production work would require trusted evidence, atomic execution, stale-state checks, bypass resistance and audit-integrity design.

## Email composition boundary

The native form is revalidated from FormData before mail composition. Full name is trimmed to 2–100 characters; company 2–160; email is checked for syntax and control characters, max 254. Mode, role, maturity, optional runtime and paid-pilot values are allowlisted. Repeated singleton fields, unknown choices, duplicate multiselect values, uploaded files and absent consent are rejected. Optional use-case text is capped at 2,000 characters with normalized line breaks.

The subject includes only the company name and an allowlisted request mode. User values remain in the encoded email body for the fixed recipient contact@tuanhungvu.com. Valid submission prepares a draft and may open the visitor’s mail handler. The website explicitly reports not sent or received; only the visitor can send it. A read-only request and copy/manual fallback remain available. Editing clears the previous draft.

There is no contact API, database, CRM, booking calendar, delivery retry or confirmation email. No application data is persisted in browser storage or transmitted to a backend. A mailto draft cannot prove handler availability or delivery.

## Metadata and analytics

`NEXT_PUBLIC_SITE_URL` controls canonical URLs and sitemap. Until a non-local origin is set, pages are noindex and robots disallows crawling. Organization schema uses the full company identity; AboutPage and visible FAQ schema describe current content. No unverified legal incorporation date or certification is published.

Vercel Web Analytics is disabled unless `NEXT_PUBLIC_ENABLE_ANALYTICS=true`. Enable it in the hosting project and approve telemetry first. Privacy copy follows the build flag. Custom events record aggregate scenario/decision/contact-mode information, not names, emails, form values, action payloads or monetary amounts. Prepared contact is not a delivered application.

## Checks

`npm test`, `npm run lint`, `npm run typecheck`, `npm run build` and browser checks against the production Docker image. Browser tests cover all 16 current routes, removed locales, company identity, metadata, responsive widths, exact approvals, adversarial conditions, contact tampering, exports and copy fallback. A successful build demonstrates website packaging, not enforcement readiness or email delivery.
