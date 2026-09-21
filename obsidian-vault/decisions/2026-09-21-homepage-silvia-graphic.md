# Homepage Silvia card graphic

Date: 2026-09-21
Status: approved direction; implemented locally, not published

Use the transparent tangled-line-to-circle artwork from [Figma node 165:510](https://www.figma.com/design/sfLncGRdv2zfIrMkgcyGny/SD-Monorepo?node-id=165-510), accessed 2026-09-21, left-aligned between the homepage Silvia Dinu introductory paragraph and credentials. Display it at 384px wide, scaling down on narrow screens. Restore the original `--muted` card background.

This supersedes the earlier implementation of the colorful heads from node 165:478 and its pale background, which the user rejected.

Keep the existing Romanian text, portrait, link, and hover behavior. The artwork is decorative, locally served, and optimized by Astro. Implementation: `website/src/components/sections/HomepageAbout.astro`; source: `website/src/assets/homepage/silvia-reflection-graphic.png`.

Follow-up layout, 2026-09-21: the user's attached reference supersedes the placement above. Place the graphic first, above the Silvia Dinu heading and introductory paragraph, with the credentials anchored at the bottom of the copy column. Exclude the export's transparent margins in CSS so the visible artwork aligns with the text; its desktop visible width is 314px. Keep the portrait on the right on desktop and the existing stacked layout on mobile.
