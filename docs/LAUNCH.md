# THV-guard release checklist

## Before any public preview

- [ ] Confirm the production domain and set `NEXT_PUBLIC_SITE_URL`; rebuild and verify canonical, hreflang, sitemap, Open Graph images, robots, and indexability.
- [ ] Approve indicative pricing (Research S$0, Team pilot S$249/month, Enterprise custom), entitlements, and public commercial copy. No billing is implemented.
- [ ] Confirm exact Singapore enterprise backing wording. Do not add a funder name, logo, government endorsement, or certification without approved evidence.
- [ ] Confirm THV-guard is the solution and Tuan Hung Vu Technologies Pte. Ltd. is the company.
- [ ] Review Vietnamese and Simplified Chinese translations with native speakers.
- [ ] Confirm contact@tuanhungvu.com is monitored, and manually send/receive a test enquiry using an email application. The website only composes mail.
- [ ] Decide whether to enable Vercel Web Analytics; default is off. Approve privacy wording before setting `NEXT_PUBLIC_ENABLE_ANALYTICS=true`.
- [ ] Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:browser` against the production build.
- [ ] Review `npm audit` and update development lint tooling when the upstream braces vulnerability is fixed. Production dependencies must pass `npm audit --omit=dev`.
- [ ] Recheck mobile layouts, keyboard focus, native disclosure controls, reduced motion, simulator explanations, invalid inputs, replay and evidence blocks, and email-copy fallback.

## Explicitly not launched

Production policy engine; live API/MCP/gateway integrations; authenticated human approvals; signed artifacts; execution-time state verification; atomic transaction execution; durable replay protection; audit-integrity guarantees; compliance certification; automatic booking or email delivery.

A public preview launch means the website and local simulator are available, **not** that these future product capabilities are deployed.

## Product validation, not fabricated traction

The supplied PRD proposes 8 qualified technical leads, 5 deep technical conversations, 3 concrete limitations in current solutions, and 1 committed design partner as a validation gate. These are research targets, not achieved metrics. Qualification requires an active/planned write-action workflow, a concrete policy gap, and architectural influence. Maintain those records outside this codebase; no CRM or lead database is provisioned here.
