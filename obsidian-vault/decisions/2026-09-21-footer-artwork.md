# Footer artwork

Date: 2026-09-21
Status: approved direction; implemented locally, not published

Replace the shared footer's sofa with the leafy background and face collage supplied in [Figma node 164:871](https://www.figma.com/design/sfLncGRdv2zfIrMkgcyGny/SD-Monorepo?node-id=164-871), accessed 2026-09-21, at the user's request. Fade the full-width background from the warm footer surface downward, and center the faces above it. Preserve the horizontal flip shown in the reference. Keep the collage legible and fully visible on mobile.

Preserve footer copy, navigation, contact links, and analytics settings. Both images are decorative, served locally, and optimized through Astro. No new third-party requests or tracking are introduced.

Canonical implementation: `website/src/components/layout/SiteFooter.astro`. Exact Figma source assets: `website/src/assets/footer/leaves.png` and `website/src/assets/footer/faces.png`.
