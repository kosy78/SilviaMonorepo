---
version: 1
slug: competente-introduction
primary_target: website/src/pages/competente.astro
---

## Scope

Refine only the opening introduction of Competențe. Preserve every word,
destination, portrait source and size, the selected full-screen background,
the portrait on the right at desktop, and the stacked profile-first order on
mobile. Later sections and the global visual system are outside scope.

## Direction contract

MODE: Read, with an optional contact action.

THESIS: A composed editorial introduction: the narrative heading leads,
readable prose follows, and the compact portrait and identity provide personal
context on the right.

OWN-WORLD: Existing Avenir, linen, ink, quiet olive, botanical light, and
restrained rounded photography. No new cards, labels, claims, or assets.

STORY: Recognize Silvia, understand her professional context, optionally use
the unchanged contact link, then continue into the existing areas of work.

FIRST VIEWPORT: A centered 60rem introduction measure joins the prose and
160px portrait through a deliberate gutter. The narrative heading is larger
than the supporting name. A linen wash reduces competition from the background
behind the text. Below 768px, the 96px portrait sits beside identity above the
narrative; 40px separates those groups and 24px joins heading and prose.

FORM: Scoped refinement within the incumbent system; code-led implementation.

FINISH: Batched rendered review at desktop, the user's width, tablet, and
mobile; exact copy comparison; detector; independent finish review and
documentation. No new or replaced shipping raster.

## Completion and evidence — 2026-10-08

Disposition: **ship** from the independent finish review; no material fixes.
This is local implementation readiness, not CI, deployment, or public-launch
verification.

- **Persistence and fidelity:** source and captures match this surface contract
  within the incumbent Avenir, linen, ink, olive, and botanical-light system.
  The introduction now has a centered 60rem measure, a stronger narrative
  heading, deliberate prose rhythm, and a linen wash. The portrait remains on
  the right at desktop/tablet and profile-first on mobile; its existing source,
  crop, responsive sizes (160px/96px), and eager loading are preserved. Copy,
  destinations, later sections, and approved image sources/dimensions remain
  unchanged; no shipping raster was added or replaced by this refinement.
- **Captures checked:** all five `viewport-1440.png`, `viewport-1135.png`,
  `viewport-842.png`, `viewport-390.png`, and `viewport-320.png`, plus their
  matching `page-<width>.png` full-page captures in
  `.impeccable/review/competente-introduction/`. Full-page evidence includes
  the areas of work, parental counseling, qualifications, and footer.
- **Implementer-reported local checks:** exact full-page copy tokens match
  `HEAD` after whitespace normalization; Astro, formatting, and build passed;
  22 Functions tests and 199 Playwright tests passed (15 expected skips).
  Portrait position/loading and no horizontal overflow passed at all five
  widths; visible keyboard focus and Enter navigation to `/contact/` passed.
  Initial layout and final all-scope detector results were both `[]`.
  The documenter checked source/capture evidence and did not rerun runtime
  checks or verify CI/deployment.
- **Ceiling, material fixes, and keep:** finish review covered persistence,
  fidelity, ceiling, material fixes, and keep; it requested no material fixes.
  Preserve this composition and stop the scoped polish cycle.
- **Pre-existing documentation drift:** `DESIGN.md` and
  `.impeccable/design.json` button examples describe the older 0.5rem radius
  and medium weight, while the incumbent `HEAD` button uses
  `--radius-control-44` (0.825rem) and regular weight. This drift is reported
  only; product context, global design documentation, sidecar, source,
  unrelated briefs/assets, and deployment were not changed by this handoff.
