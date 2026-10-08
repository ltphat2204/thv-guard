# THV-guard preview architecture

## Current system

This is a Next.js App Router website using React and TypeScript. Localized marketing pages are statically rendered and suitable for CDN distribution. Interactive simulation and contact composition run in browser Client Components; the site does not intercept agent API calls or enforce real transactions.

Next.js uses its **default Node.js runtime**, not an Edge runtime. Serving generated pages through a CDN does not make the application an Edge function, and static rendering does not imply `output: "export"`. There is no contact Route Handler, Server Action, database, email-delivery backend, or application API interception layer in this scope.

## Source responsibilities

| Location | Responsibility |
| --- | --- |
| `src/app/(entry)` | Root entry/redirect to the default English route |
| `src/app/[locale]` | Locale-aware layout and page family: home, product, simulator, architecture, pricing, About us, contact, privacy |
| `src/app/globals.css` | Shared design tokens, layout, responsive controls, and accessibility states |
| `src/components` | Shared UI and the small interactive browser boundaries |
| `src/components/contact-form.tsx` | Native qualification form, request validation, mail composition, clipboard/manual fallback |
| `src/lib/i18n.ts` | Locale types, labels/tags, localized copy helper, company identity, contact recipient, encoded mail-link helper |
| `src/lib/policy.ts` | Pure local refund evaluator, typed action/approval/state/decision contracts, mock fixtures |
| `src/lib/about.ts` | Server-rendered company story in three languages, kept outside the client navigation copy |
| `public/brand` | Blender-authored artwork: `thv-guard-logo.blend`, `thv-shield.png`, `thv-mark.svg` |
| `docs/PROJECT.md` | Product scope, PRD mapping, route matrix, draft pricing, release boundaries |

The routing layer validates locale and supported page slugs. `/en`, `/vi`, and `/zh` render equivalent page families; `zh` is Simplified Chinese and uses `zh-Hans`. Locale is a serializable prop at browser component boundaries. Brand names are retained rather than translated as product claims.

## Preview execution path

1. Next.js renders localized content and the initial UI.
2. The browser hydrates the simulator or contact form when needed.
3. The refund simulator assembles a proposed action from local UI values and combines it with local mock evidence, a supplied clock, and any simulated approval.
4. `evaluate` produces a decision snapshot with checks and reason codes.
5. The UI displays that snapshot. It does not call a live tool, refund API, or storage service.

Architecture-page explanations describe a possible production boundary. They are not evidence that gateway interception, adapters, approval infrastructure, or execution infrastructure already exists.

## Refund evaluator contract

`ProposedAction` includes action ID, agent ID, requesting principal, tool, order ID, integer amount in cents, currency, recipient, and expiry. `TrustedState` includes the order and currency, paid and refunded amounts, previously executed action IDs, and evidence source. `ApprovalBinding` contains an approval ID, an exact action snapshot, and approval expiry. `EvaluationContext` supplies those values and the clock.

Monetary parsing accepts plain nonnegative decimal syntax with at most two decimal places and converts it to safe integer cents. Decisions reject invalid/nonpositive requested amounts, invalid clocks, absent/invalid evidence, an unauthorized tool, order/currency mismatch, excess remaining balance, expired action, replayed action ID, or expired/mismatched approval. Missing approval above the automatic threshold is a separate `REQUIRE_APPROVAL` result, not permission to execute.

The fixture uses USD 250 paid, USD 50 previously refunded, USD 200 remaining, threshold USD 100, order ORD-2048, and tool `issue_refund`. The threshold comparison is inclusive. A bound USD 150 approval cannot authorize a later USD 180 proposal. Every bound action field must remain equal; merely remaining under the balance is insufficient.

`DecisionRecord` includes a decision identifier, principal/agent/action/tool references, monetary context, policy version, approval status, result, reasons, evaluation time, checks, and copies of the input snapshots. `simulationOnly: true` makes the demonstration boundary explicit. Snapshots protect earlier displayed records from later UI edits; they are not cryptographic attestations.

### What is not production enforcement

The browser controls the action, mock evidence, clock, and simulated approval. There is no authenticated approver, verified evidence provider, server-owned policy authority, atomic reservation/execution, durable replay ledger, or immutable audit store. Evaluation and execution are not an implemented transaction. Refreshing the preview does not maintain a protected history.

A production implementation would have to establish those trust boundaries and fail closed when authoritative evidence or enforcement is unavailable. Approval must remain bound to the exact action at execution time, and replay and concurrent spending checks must be enforced where execution occurs. These are outstanding requirements, not deployed capabilities or recommendations to add dependencies to this website.

## Contact composition boundary

`ContactForm({ locale })` is a named Client Component export. It uses native inputs, selects, radio buttons, checkboxes, fieldsets, and a form submit handler. Required native constraints improve immediate usability; `buildContactRequest(FormData, locale)` validates again at the composition boundary because controls and `FormData` can be modified.

Validation includes:

- Trimmed full name: 2–100 characters; company: 2–160 characters.
- Work email: format check, maximum 254 characters, no control characters or injected newlines.
- Allowlisted mode, role, maturity, and optional runtime values; repeated singleton fields are rejected.
- Actions and difficult controls read with `FormData.getAll`, at least one per group, allowed values only, no duplicate values, no uploaded-file values.
- Optional concrete use case: at most 2,000 characters after trimming; multiline input is retained with normalized newlines. Other control characters and invalid surrogate text are rejected.
- Optional paid-pilot interest accepts only the allowlisted Yes / Maybe / No values. Consent requires exactly one explicit affirmative value.

Single-line fields reject control characters rather than silently placing them into headers. The subject uses only the product name and a validated, translated mode label, never arbitrary user input. `mailLink(subject, body)` from `src/lib/i18n.ts` percent-encodes the subject and body for a fixed recipient, **contact@tuanhungvu.com**. User-entered content stays in the body and cannot introduce additional query parameters or email headers.

On a valid submission, the component keeps a read-only request in browser memory and attempts to open a `mailto:` URL. The status says **not sent or received** and instructs the user to send the message themselves. No browser signal proves that a handler opened or that mail was delivered. The native form action also targets `mailto:` rather than posting personal details to a website endpoint; the always-visible direct email link is the reliable manual path when scripting or handler support is unavailable.

The copy button writes to the clipboard only on the user's explicit action. When clipboard access is absent, denied, or fails, an accessible error is shown and the read-only text is focused/selected for manual copying. Validation errors and compose/copy status are localized and announced with live regions. Editing the form clears a previously prepared draft in the UI so it is not mistaken for the updated request.

There is no honeypot, server rate limiter, or bot-submission queue because there is no server submission endpoint. There is also no delivery retry mechanism, confirmation email, CRM sync, booking-calendar integration, or lead database. Adding any of these would change the agreed user-composed-email scope.

## Privacy and observability

Contact values and simulator inputs are not persisted to browser storage, sent to an application backend, or placed in a site database. A user can explicitly copy a draft or choose to send it through their own email application; its handling then follows that application's and provider's behavior. Hosting/platform access logs are separate from application form submission and should not be confused with lead capture.

Vercel Web Analytics is installed but **disabled by default**. Set `NEXT_PUBLIC_ENABLE_ANALYTICS=true` only after enabling Web Analytics for the Vercel project and approving telemetry. The localized privacy disclosure switches at build time with this flag. Tracking covers page views and aggregate simulator starts/results, scenario switches, simulated approvals, architecture expansion, and prepared-contact modes. No form values, email addresses, names, action payloads, or transaction amounts are sent as custom properties. The default build loads no analytics script and sends no analytics events. A prepared contact event is not an application received or a booking completed.

## Configuration and checks

The website does not require API keys, database credentials, payment credentials, or email-service secrets. `NEXT_PUBLIC_SITE_URL` controls the public origin used by shared site metadata; its fallback is `http://localhost:3000`. Set an approved deployment origin before publishing canonical metadata. Public environment variables must never hold secrets.

Use the existing project commands:

```sh
npm run dev
npm run test
npm run lint
npm run build
```

Tests should preserve the important trust-boundary examples: automatic threshold, missing evidence, excess balance, expiry, replay, exact approval binding after an edit, invalid money syntax, and contact data tampering. Browser acceptance should additionally exercise every locale, keyboard access, validation announcements, absent mail handler, and denied clipboard access. No automated check can claim mail receipt from successful `mailto:` construction.

The production build and static route output verify website packaging, not enforcement readiness. Deployment approval, confirmed launch status, commercial approval, and production security validation remain separate gates.
