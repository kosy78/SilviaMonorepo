# Homepage reflection section

Date: 2026-09-21
Status: approved direction; implemented locally, not published

Update the homepage “O primă explorare” section to the composition surrounding
[Figma node 152:513](https://www.figma.com/design/sfLncGRdv2zfIrMkgcyGny/SD-Monorepo?node-id=152-513),
accessed 2026-09-21. Its birch-tree background sits behind the inset cream card
at node 152:695, with a water texture and the exported decorative answer preview
from node 152:701. The file's comments endpoint returned no comments; the section
nodes have no annotations.

Use the supplied copy with Romanian diacritics, and retain the existing link to
`/reflectie-ghidata/`. The illustrated answer choices are decorative, not form
controls. On smaller screens, stack the illustration below the text and button.
Use the shared card radius and ActionLink component. This change is scoped to
the homepage; the shared service-page reflection card is unchanged.

Canonical implementation: `website/src/components/sections/HomepageAreas.astro`.
Exact downloaded images live in `website/src/assets/homepage/` as
`reflection-birch-background.png`, `reflection-water-texture.png`, and
`reflection-answer-preview.png`; Astro generates optimized delivery images.

Local verification: inspected at 393px, 915px, and 1512px; the button opens the
existing reflection flow. Accessibility, updated homepage smoke checks, formatting,
and 22 function tests passed. Broader service-page checks exposed an unrelated
existing citation-spacing mismatch. Type-check and build attempts were stopped
after stalling; a complete production build remains unverified.

Same-day motion follow-up: animate only the highlighted answer-row illustration
when the card is hovered or its link has visible keyboard focus. The reference
is mask group 152:701, with animated row wrappers 152:738, 152:736, and 152:737.
The Figma motion context (accessed 2026-09-21) moves left/right padding from 0px
to 10px over 587.92ms, using cubic-bezier(0.5, 0, 0.5, 1) and
cubic-bezier(0.7, -0.4, 0.4, 1.4); the selected green row stays fixed. Replace the
flattened preview with decorative layers and the exact exported bar textures
and mask so each row can animate independently. Hold the endpoint while hovered;
on exit, reverse from the current animation position without a jump or loop.
Reduced motion retains the static starting state; touch does not trigger hover.
The added Psi icon visible in the current Figma card is outside this highlighted
animation request and is not added here. Local motion regression tests cover
hover, hold, reversal partway through playback, keyboard focus, reduced motion,
button navigation, and mobile overflow.

Motion verification: six applicable motion tests and 21 applicable smoke/accessibility
checks passed (three device-specific skips), with desktop and mobile visual review.
`pnpm typecheck` completed with zero diagnostics, formatting passed, and
`pnpm build:astro` built all 11 pages. This supersedes the earlier unverified
Astro/type-check status. The full `pnpm build` still stalls in TinaCMS generation.

Same-day service-page adoption: replace the old door-image reflection card on
`/psihoterapie-si-consiliere/` with the existing exploration card, as requested
against Figma node 152:695. The shared implementation now lives in
`website/src/components/ui/ExplorationPromoCard.astro`, including the same copy,
answer-row animation, reduced-motion behavior, and destination. `HomepageAreas`
retains its existing full-width photograph wrapper; the service page uses only
the inner card. This supersedes the earlier homepage-only scope and component
ownership. Keep the service-page introduction and citations unchanged. The
internal design-system page includes a specimen of the shared component.

Service-page adoption verification: 27 applicable motion, design-system, and
focused smoke checks passed (five device-specific skips), with desktop/mobile
visual review. Type-check reported zero diagnostics, formatting passed, and
`pnpm build:astro` built all 11 pages. The existing service citation assertion
now checks rendered text so its deliberate line break counts as whitespace;
no introduction copy or citation layout was changed. Local only, not deployed.

Same-day card hover follow-up: retain the answer-row playback and add the
requested subtle whole-card expansion (1.01 scale), the neighboring cards' 2px
lift, and their 1px `--border` hover outline. Reuse `--duration-state` and
`--ease-out`; return smoothly to rest on pointer exit. Apply the same treatment
when the action link has visible keyboard focus. Keep the resting border
transparent without changing layout dimensions. Reduced motion retains the
outline without movement; touch does not activate hover. The shared
`website/src/components/ui/ExplorationPromoCard.astro` owns this styling, so the
homepage and design-system specimen stay consistent.

Same-day width follow-up: at the user's request, align the homepage exploration
card with the psychotherapy, Silvia, and first-session cards. `HomepageAreas`
now uses the shared `Container` and removes the exploration card's separate
maximum width only within this homepage section. Preserve its full-width
background, vertical spacing, and hover behavior. At rest, all four cards have
matching widths and left/right edges at 320, 393, 768, 1024, 1440, and 1920px,
with no horizontal document overflow. Local only, not deployed.
