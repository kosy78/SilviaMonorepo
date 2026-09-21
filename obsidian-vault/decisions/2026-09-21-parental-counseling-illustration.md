# Parental counseling illustration

Date: 2026-09-21
Status: approved direction; implemented locally, not published

Add the supplied family-and-therapist illustration from [Figma node 164:878](https://www.figma.com/design/sfLncGRdv2zfIrMkgcyGny/SD-Monorepo?node-id=164-878), accessed 2026-09-21, beneath the Consiliere parentală heading in the Competențe page. Keep the existing copy and two-column desktop layout; on mobile, stack the heading, illustration, and introduction.

Preserve the downloaded image unchanged. Use CSS to frame its visible 590 × 410px artwork within the 736 × 1104px transparent source canvas, avoiding large empty margins. The illustration is decorative, locally served, and optimized by Astro.

Canonical implementation: `website/src/pages/competente.astro`; exact source asset: `website/src/assets/competencies/parental-counseling.png`.
