# Psychotherapy page Ψ animation

Date: 2026-09-21
Status: revised after browser feedback; implemented locally, not published

Add the animated graphic from [Figma node 152:631](https://www.figma.com/design/sfLncGRdv2zfIrMkgcyGny/SD-Monorepo?node-id=152-631), accessed 2026-09-21, beneath the service page heading. Reuse the existing head and overlay assets and the exact authored 3.05-second loop: overlay opacity 0 to 1 and Ψ scale 1 to 0.9 over the first 16.295%, using cubic-bezier(0.5, 0, 0.5, 1), then hold to the loop boundary.

Implementation choice for this decorative, non-interactive placement: keep the original 63px size and 32px gap below the heading, but keep the graphic static until the service-page intro section is hovered. Reduced-motion users see no animation; the color treatment appears only while the intro section is hovered. Keep the homepage's existing 53.55px size, grayscale resting state, hover/focus trigger, and video playback behavior.

Both placements share `website/src/components/ui/PsiGraphic.astro`. `PageIntro.astro` exposes a `heading-after` slot for the service page placement. The internal design system includes a specimen. No new dependency or public copy is introduced.
