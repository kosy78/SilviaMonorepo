# Website

## Scope

This directory owns the production website for Silvia Dinu. It will contain the
runnable application, website-owned content, reusable interface components,
guided reflection implementation, contact form, SEO metadata, public assets,
tests, and deployment configuration.

Read `/AGENTS.md` before working here. Its project facts, voice, privacy rules,
and ethical constraints apply to every website change.

## V1 experience

The planned navigation is:

- Acasă
- Despre Silvia
- Psihoterapie și consiliere
- Arii de lucru
- Reflecție ghidată
- Blog
- Contact

Supporting pages should include a blog article template, privacy policy, and a
cookie policy only if the implemented technology requires one.

The homepage should establish trust, explain the practice clearly, make
in-person and online sessions equally visible, and offer an email-first contact
path without applying pressure.

## Current technical direction

The initial architecture decision is recorded in
`/obsidian-vault/decisions/2026-06-24-website-technical-foundation.md`.
Use these as V1 defaults:

- Astro;
- TypeScript in strict mode;
- Tailwind CSS;
- React only for interactive islands;
- Astro Content Collections with Markdown or MDX for the blog;
- TinaCMS for the blog authoring admin, backed by repository files;
- Astro Actions for future serverless contact handling;
- Cloudflare Pages-compatible static deployment;
- no database unless a demonstrated requirement justifies one;
- client-side guided reflection logic;
- privacy-first analytics only after explicit review.

Do not introduce a database, custom authentication system, large component
framework, tracking stack, or complex state layer preemptively. Any expansion of
the CMS beyond the blog authoring workflow must document the need and tradeoff
first.

## Design rules

- Start in black and white.
- Use strong typography, generous whitespace, and a refined editorial rhythm.
- Prefer semantic structure and quiet interaction over decorative effects.
- Use a simple `DespreSine` wordmark, with `Silvia Dinu` as a visible
  practitioner subtitle or supporting line, until approved identity assets
  exist.
- Limit V1 photography to one or two approved professional photographs.
- Avoid stock imagery, therapy clichés, bright palettes, visual noise, and
  generic SaaS styling.
- Meet WCAG-oriented accessibility expectations for contrast, keyboard use,
  focus states, form labels, reduced motion, and meaningful document structure.
- Design mobile-first and verify important flows at multiple viewport sizes.

## Content rules

- Public copy is Romanian with correct diacritics.
- Default to `dumneavoastră`.
- Keep credentials and service wording consistent with the root context.
- Never expose an exact office address, phone number, or pricing in V1.
- Do not imply that a visitor has a condition.
- Do not promise outcomes or use fear-based conversion copy.
- Separate factual service information from editorial interpretation.
- Add sources and review dates for claims that depend on external research.

## Guided reflection rules

The `Reflecție ghidată` flow is reflective, not diagnostic.

- Do not store answers in V1.
- Do not require sign-in or email capture.
- Avoid clinical scoring, labels, severity claims, and patient archetypes.
- Keep results supportive and non-prescriptive.
- Display an appropriate non-diagnostic disclaimer.
- Make contact optional and clearly separate from the result.
- Ensure the flow works with keyboard navigation and assistive technology.

## Forms and data

The primary contact address is `silvia.drn@gmail.com`.

The contact form should ask only for information required to respond. Do not ask
for diagnosis, medical history, detailed symptoms, emergency information, or
other sensitive narrative unless a reviewed operational need is established.

Provide clear success and error states. Prevent secrets and personal submissions
from appearing in logs, fixtures, screenshots, test snapshots, or source
control.

The website is not an emergency service. Any crisis or emergency wording must
be specifically researched, locally appropriate, and reviewed before
publication.

## SEO and performance

- Use `https://despresine.ro` as the canonical production site URL.
  `https://silvia-dinu-website.pages.dev` is an operational fallback only.
- Use descriptive page titles, metadata, headings, internal links, canonical
  URLs, and structured data only when accurate.
- Optimize for useful, people-first Romanian content, not keyword repetition.
- Treat psychology and mental-health topics as high-trust content requiring
  careful authorship and review.
- Keep JavaScript and third-party requests minimal.
- Optimize images, fonts, and loading behavior.
- Do not add schema, testimonials, reviews, or credentials that cannot be
  substantiated.

## Verification

For implementation changes, run the repository's available formatting,
type-checking, linting, tests, and production build. Manually verify affected
pages and flows when visual or interactive behavior changes.
