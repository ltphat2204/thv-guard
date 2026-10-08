# Tuan Hung Vu Technologies

Shared design system for Tuan Hung Vu Technologies Pte. Ltd. This rebrand updates the existing website in place, without changing its policy-engine or form trust boundaries.

## Identity

- Sole public brand: **Tuan Hung Vu Technologies Pte. Ltd.**
- Navbar lockup: “Tuan Hung Vu” above “Technologies Pte. Ltd.”; its accessible name is the full company name.
- Origin belongs once in the About story: the business began in 2023 and grew from an AI-security hackathon in Singapore. Do not repeat the location as a promotional slogan.
- Company credential: “Accelerated by BLOCK71”, shown briefly in the homepage proof line and About company facts. Do not invent an accelerator logo, program cohort, award, funding arrangement or government endorsement.
- Factual address: “Ayer Rajah Industrial Estate, Singapore”, shown in About, Contact and the footer. This is contact information, not a slogan. No street, unit, building or postal code has been supplied.
- All commercial prices use USD; the team-pilot planning tier is USD 249/month. Keep indicative-pricing and production-availability caveats.
- Languages: English (default) and Simplified Chinese only.
- Company symbol: original folded T/H/V monogram, deep navy with a vermilion rising ribbon. No shield, checkmark badge, government seal, or stock certification artwork.

## Genre and structure

Modern-minimal, company-first, confident and restrained. Marketing follows a Split Studio family: company positioning beside a real deterministic workflow illustration. Simulator pages remain workbenches. About and privacy remain readable documents. Reuse existing route and component ownership.

The full company lockup is prominent. The demo is subordinate to the company identity, not the brand itself. Keep existing clear commercial and research-preview caveats.

## Palette

Light-first warm white surfaces, deep ink-blue text, muted slate, a restrained vermilion accent. Dark mode uses the same roles and hue, without violet or neon cyan. All website colors reference `tokens.css`. Functional allow/approval/block colors remain independent of the brand accent and are paired with text.

- Paper: `oklch(98% 0.005 85)`
- Surface: `oklch(96% 0.007 85)`
- Ink: `oklch(24% 0.045 250)`
- Muted: `oklch(46% 0.025 250)`
- Accent: `oklch(52% 0.17 30)`
- Accent ink: `oklch(98% 0.005 85)`

## Typography and spacing

Geist Sans for company lockup, headings and body. Geist Mono for code and decision records only. Roman headings, responsive display capped below 5rem, tabular prices, 4-point semantic spacing scale. No gradient text or manufactured metrics. Company lockup must remain readable at 320px; move language selection into the mobile menu if necessary.

## Interaction

Native controls and disclosure elements, 44px minimum touch targets, instant visible focus rings, no hover-only navigation. Preserve the simulator's deterministic evaluation, exact-action approval binding and context invalidation. Email is composed, never falsely reported as delivered.

Motion stays limited to the action-flow explanation with pause and reduced-motion support. No WebGL, animated decorative logo, fake browser chrome, or new animation library.

## Files

- `tokens.css`: executable source of palette, fonts, spacing, easing and radius roles.
- `src/app/globals.css`: shared component and responsive implementation.
- `public/brand/company-mark.svg`: primary vector mark.
- `public/brand/company-monogram.png`: rendered brand study.
- `public/brand/company-monogram.blend`: original Blender source.

Retired artwork is archived outside `public/` in ignored local artifacts, not used by the site.

## Portable exports

Use `tokens.css` directly in native CSS projects. For Tailwind v4, map color/font tokens directly into `@theme` and map `--space-*` to `--spacing-*`. For DTCG pipelines, represent each color as `$type: color` with its OKLCH string and each font as `$type: fontFamily`. For shadcn, map paper→background/card, ink→foreground, accent→primary, accent-ink→primary-foreground, rule→border, input-rule→input, focus→ring. No alternative palette may be introduced by an individual page.
