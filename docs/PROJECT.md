# THV-guard project

## Status and ownership

THV-guard is a solution by **Tuan Hung Vu Technologies Pte. Ltd.**, a Singapore-origin, Singapore enterprise-backed startup that grew out of an AI-security hackathon in Singapore. The business story begins in 2023; the exact event name, awards, event date, legal incorporation date, and other regional offices have not been supplied. No specific enterprise backer, investor name, customer reference, certification, or third-party logo has been supplied or independently established; the website must not invent one.

This repository is a **research preview and interactive product concept**, not a launched production enforcement service. Its purpose is to explain action-level governance for AI agents, demonstrate a deterministic policy decision, and invite demo, sales, and design-partner conversations. A simulated `ALLOW` decision does not execute an action or establish a security guarantee.

## Product thesis

Agent actions need a control boundary between proposed intent and tools that can change external systems. Prompt instructions alone do not establish authorization, approvals, spending limits, or trustworthy audit evidence. THV-guard explores a policy layer that evaluates a concrete action against trusted evidence and returns `ALLOW`, `BLOCK`, or `REQUIRE_APPROVAL` before execution.

The preview distinguishes this proposed enforcement layer from model prompting, agent orchestration, and observability. Those categories are complementary, not interchangeable, and comparison copy is conceptual rather than a tested claim about named vendors.

## PRD-to-preview mapping

| Requirement area | Preview implementation | Scope boundary |
| --- | --- | --- |
| Thesis and problem | Localized home-page explanation of agent action risk | No fabricated security incidents or launch claims |
| Company story | About us page beginning in 2023 and explaining why business logic needs a guard | The year anchors the business story, not a verified legal incorporation date; no invented milestones, clients, or achievements |
| Five capabilities | Business-aware policies, action-bound approvals, evidence-driven decisions, structured decision records, and integration-oriented design | Capability descriptions are research direction; only identified local-demo behavior is implemented, not deployed integrations |
| Refund, procurement, and finance use cases | Home-page scenario explanations | Only the refund case has a detailed interactive simulator |
| Policy decision demonstration | Refund simulator showing checks, reasons, approval binding, and a decision record | Local mock data; no payment provider, customer ledger, or real refund |
| Architecture transparency | Architecture page with expandable responsibility, input, output, failure, and ownership details | Proposed production responsibilities are distinguished from local implementation |
| Positioning and comparison | Home-page comparison of existing identity, tool permissions, runtime threat detection, and prompt-injection controls with the proposed transaction-verification focus | Complementary controls, not a vendor benchmark or claim that competitors lack a capability |
| Pricing | Research, team-pilot, and enterprise draft tiers | Indicative only; subject to approval and scoping |
| FAQ and contact | Six home-page FAQ entries, contact CTA, dedicated qualification form | User-composed email, not automatic lead capture or delivery |
| Internationalization | English, Vietnamese, and Simplified Chinese route families | Framework and company brand names remain unchanged |
| Brand assets | Blender-authored shield/logo assets and source file in `public/brand` | Own brand artwork, not an investor, certification, or customer badge |
| Privacy | Dedicated localized privacy page and explicit form notice | No application database or third-party tracking currently |

## Routes and languages

`/` redirects to `/en`. Each locale has the same page family:

| Page | English | Vietnamese | Simplified Chinese |
| --- | --- | --- | --- |
| Home | `/en` | `/vi` | `/zh` |
| Product | `/en/product` | `/vi/product` | `/zh/product` |
| Simulator | `/en/simulator` | `/vi/simulator` | `/zh/simulator` |
| Architecture | `/en/architecture` | `/vi/architecture` | `/zh/architecture` |
| Pricing | `/en/pricing` | `/vi/pricing` | `/zh/pricing` |
| About us | `/en/about` | `/vi/about` | `/zh/about` |
| Contact | `/en/contact` | `/vi/contact` | `/zh/contact` |
| Privacy | `/en/privacy` | `/vi/privacy` | `/zh/privacy` |

The `zh` route uses Simplified Chinese (`zh-Hans`), not an unspecified or Traditional Chinese variant. Shared company identity and contact address come from `src/lib/i18n.ts`.

## Refund demonstration

The fixture is order **ORD-2048**, in **USD**: paid amount **250**, previously refunded **50**, remaining refundable balance **200**, and automatic approval threshold **100**. These USD simulation amounts are distinct from the SGD marketing prices.

The evaluator checks input validity, available trusted-state evidence, tool authorization, order/currency matching, remaining balance, expiry, replay, and approval binding. A valid action at or below USD 100 can return `ALLOW`; above that threshold, a valid action without approval returns `REQUIRE_APPROVAL`; invalid or conflicting evidence returns `BLOCK`.

An approval binds to the exact proposed action, not just its general intent. Approving a USD 150 refund and changing it to USD 180 demonstrates `BLOCK` for a mismatched binding even though USD 180 remains within the mock refundable balance. Identity, tool, order, currency, recipient, action identifier, and expiry are also part of the binding. The browser provides both evidence and approval for this demonstration, so neither is a production trust anchor.

The decision record is a local snapshot for inspection. It is not a signed, durable, tamper-evident audit log, and no real tool or payment endpoint is called.

## Draft pricing

All website tier prices are **SGD**:

- **Research demo: SGD 0.** Public research-preview experience, not a promise of a free production service.
- **Team pilot: SGD 249/month, indicative only.** Draft starting point for a scoped conversation, not an approved offer or active subscription.
- **Enterprise: custom.** Scope and commercial terms require discussion.

Prices, entitlements, contractual terms, and production availability are pending approval. There is no checkout, billing system, purchased entitlement, or confirmed launch date in this repository.

## Contact scope and delivery

All demo bookings, sales inquiries, and design-partner requests are addressed to **contact@tuanhungvu.com**. The default mode is **Book demo**; the alternatives are **Contact sales** and **Design partner**.

Required fields are full name, work email, company, role, agent maturity, at least one proposed action, at least one difficult control, and consent to sharing details and follow-up. Runtime/framework, concrete use case, and paid-pilot interest are optional. Paid-pilot interest is not a purchase commitment.

The form validates native controls and the resulting `FormData`, prepares an encoded `mailto:` link, and asks the browser to open the user's local email application. It explicitly states that the request is **not sent or received**. The user must send the email themselves. Handler availability and delivery cannot be confirmed by the website.

A direct email link is always visible. After valid submission, a read-only request and **Copy request** button provide a fallback when no mail handler opens. Clipboard failure leaves the text available for manual selection and copying. No backend, email delivery service, database, CRM integration, or server-side booking system is provisioned. Form details are not stored by the application. The user's email software and provider handle a message only according to the user's chosen actions.

Do not include credentials, confidential payloads, or personal customer records in contact messages. See `docs/ARCHITECTURE.md` for input validation and browser trust boundaries.

## Running and verifying

```sh
npm ci
npm run dev
npm run test
npm run lint
npm run build
```

`npm run dev` serves the local preview. `npm run test` exercises the local policy checks; `npm run test:browser` checks responsive pages and the simulator/contact-validation flows against a running production build. `npm run lint` checks source quality; `npm run build` verifies the production build. A successful build is not evidence of production enforcement or email delivery. `npm run start` serves the completed Next.js build locally.

Before accepting a preview, check all three locale families, keyboard navigation, visible decision states, approval-edit mismatch, invalid form submissions, exact contact recipient, and manual copy fallback. Never report a prepared mail draft as a delivered message.

## Release boundary

The present deliverable is the multilingual website and local demonstration. It intentionally excludes live agent interception, authenticated trusted-state retrieval, production approval identity, atomic execution/replay protection, durable audit storage, billing, automated email delivery, and real integration credentials.

Production claims require the corresponding enforcement implementation, security verification, approved commercial terms, and approved company evidence first. A CDN-hosted marketing preview is not itself an enforcement deployment. Vercel Web Analytics and aggregate interaction events are implemented behind `NEXT_PUBLIC_ENABLE_ANALYTICS=true`, disabled by default. Enable Web Analytics in the hosting project and approve telemetry before setting the flag; the privacy disclosure changes with it. No personal form values or action payloads are included in custom events. There is no advertising tracking.
