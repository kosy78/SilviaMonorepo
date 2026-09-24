# Website

## Scope

This directory owns the production website for Silvia Dinu. It will contain the
runnable application, website-owned content, reusable interface components,
guided reflection implementation, contact form, SEO metadata, public assets,
tests, and deployment configuration.

Read `/AGENTS.md` before working here. Its project facts, voice, privacy rules,
and ethical constraints apply to every website change.

## V1 experience

The public navigation is:

- Acasă
- O primă explorare
- Psihoterapia psihanalitică
- Competențe
- Blog
- Contact

Supporting public pages include a blog article template, privacy policy, and
cookie policy. The privacy and cookie pages are part of the published V1 legal
surface; update them before changing analytics, forms, hosting behavior,
embedded services, data collection, retention wording, or controller details.

The homepage should establish trust, explain the practice clearly, make
in-person and online sessions equally visible, and offer an email-first contact
path without applying pressure.

Its primary reading order is: hero; optional guided reflection; concise service,
audience, and format orientation; Silvia's professional context; a clearly
labeled preview of blog themes still in preparation; practical format and
first-contact information; then the footer contact path. Blog previews must not
present unpublished topics as available articles or link to nonexistent article
pages.

The footer includes the public credential wording, general Bucharest location,
email-first contact links, and privacy/cookie links. The ANPC/SAL indicator was
removed from the current website baseline on 2026-08-29 at the user's request;
re-review the exact consumer-protection obligations before public launch. Do
not add SOL/ODR, testimonials, review widgets, marketplace-style trust badges,
pricing, phone numbers, or professional logos/affiliation claims without a new
reviewed decision, verified status, and confirmed usage rights.

## Current technical direction

The initial architecture decision is recorded in
`/obsidian-vault/decisions/2026-06-24-website-technical-foundation.md`, with the
current publishing workflow in
`/obsidian-vault/decisions/2026-09-24-simplificare-blog-si-build.md`.
Use these as V1 defaults:

- Astro;
- TypeScript in strict mode;
- Tailwind CSS;
- React only for interactive islands;
- selective, source-owned shadcn primitives under `src/components/ui/`, based
  on the approved `b4vf0yLwvq` Stone/Violet preset and adapted only where the
  DespreSine experience requires accessibility, performance, or editorial
  variants;
- Astro Content Collections with plain Markdown for the blog, edited through
  Codex or repository files; no browser admin or TinaCloud build dependency;
- Cloudflare Pages Functions for the minimal contact endpoint and an internal
  service binding to a dedicated email-delivery Worker;
- Cloudflare Pages-compatible static deployment;
- no database unless a demonstrated requirement justifies one;
- client-side guided reflection logic;
- privacy-first analytics only after explicit review.

The Cloudflare Pages project is GitHub-backed and deploys production from
`main`, with `website/` as the root directory and `dist/` as the build output.
Local Wrangler authentication may not be available; pushing `main` triggers the
production Pages build. After deployment, verify both the Pages deployment URL
and the canonical domain.

Do not introduce a database, custom authentication system, CMS, large component
framework, tracking stack, or complex state layer preemptively. A future CMS
must document a demonstrated authoring need and its build and maintenance cost.

## Design rules

- Start in black and white.
- Use strong typography, generous whitespace, and a refined editorial rhythm.
- Prefer semantic structure and quiet interaction over decorative effects.
- Use `@tabler/icons-react` for interface icons when an icon materially helps
  comprehension or interaction. Do not add a second UI icon library or replace
  logos, favicons, or third-party marks with Tabler icons. Mark decorative
  icons as hidden from assistive technology and give icon-only controls an
  accessible label.
- Use a simple `DespreSine` wordmark, with `Silvia Dinu` as a visible
  practitioner subtitle or supporting line, until approved identity assets
  exist.
- Limit V1 photography to one or two approved professional photographs.
- Avoid stock imagery, therapy clichés, bright palettes, visual noise, and
  generic SaaS styling.
- Meet WCAG-oriented accessibility expectations for contrast, keyboard use,
  focus states, form labels, reduced motion, and meaningful document structure.
- Design mobile-first and verify important flows at multiple viewport sizes.
- Keep `/design-system/` as an unlinked, `noindex` internal reference without
  public-site chrome or analytics. Its token and component inventories are
  generated from source; when a component API or variant changes, update the
  curated specimen and run `tests/design-system.spec.ts` before integration.

## Content rules

- Public copy is Romanian with correct diacritics.
- Default to `dumneavoastră`.
- Keep credentials and service wording consistent with the root context.
- Never expose an exact office address, phone number, or pricing in V1.
- Do not imply that a visitor has a condition.
- Do not promise outcomes or use fear-based conversion copy.
- Separate factual service information from editorial interpretation.
- Add sources and review dates for claims that depend on external research.
- Blog articles live in `src/content/blog/*.md`. Keep `draft: true` until the
  final text is reviewed and publication is authorized. Drafts have no generated
  article page and are excluded from the blog listing and sitemap.
- Preserve an existing article's filename and directory, which determine its
  URL, and its original `publishedAt`; use `updatedAt` for a later revision.
  A future `publishedAt` does not schedule publication: `draft` controls it.
- Follow `README.md` for writing, local preview, review, media, and publishing.

## Guided reflection rules

The `Reflecție ghidată` flow is reflective, not diagnostic.

- Do not store answers in V1.
- Do not require sign-in or email capture.
- Avoid clinical scoring, labels, severity claims, and patient archetypes.
- Keep results supportive and non-prescriptive.
- Display an appropriate non-diagnostic disclaimer.
- Make contact optional and clearly separate from the result.
- Ensure the flow works with keyboard navigation and assistive technology.
- Results are calculated locally in the browser and may show a simple frequency
  distribution across body, emotional states, and relationships. Keep this
  framed as a count of selected answers, not as severity, likelihood, pathology,
  or clinical measurement. Avoid chart forms that resemble clinical scoring.
- Source-backed explanatory notes used in results must include dated sources in
  the implementation or an associated decision record. Do not imply that those
  sources validate the reflection as a clinical instrument.

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
- If `despresine.ro` does not resolve or is not attached to the Cloudflare Pages
  project, treat that as an operational blocker to claiming the canonical domain
  is live, even if the Pages deployment URL works.
- Use descriptive page titles, metadata, headings, internal links, canonical
  URLs, and structured data only when accurate.
- Optimize for useful, people-first Romanian content, not keyword repetition.
- Treat psychology and mental-health topics as high-trust content requiring
  careful authorship and review.
- Keep JavaScript and third-party requests minimal.
- Keep static Astro surfaces hydration-free. Astro links may consume exported
  component variants directly; reserve hydrated React components for real
  interaction, and measure bundle impact before adding new primitives.
- Google Analytics is the only V1 analytics path and loads only after explicit
  consent. Cloudflare Web Analytics is disabled; re-enabling it requires a new
  decision and privacy review.
- Optimize images, fonts, and loading behavior.
- Do not add schema, testimonials, reviews, or credentials that cannot be
  substantiated.

## Verification

For implementation changes, run the repository's available formatting,
type-checking, linting, tests, and production build. Manually verify affected
pages and flows when visual or interactive behavior changes.

`pnpm test:e2e` builds fresh before running the function and browser suites.
Use `pnpm test:e2e:prebuilt` only after a successful build of the same checkout
with no subsequent source changes. Use `pnpm test:blog` when changing article
loading, rendering, metadata, or publication filtering; its disposable fixture
build must not become a deployment artifact. Do not reuse an unrelated local
preview server as evidence for the current checkout.
