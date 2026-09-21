# Contact artwork and reflection background

Date: 2026-09-21
Status: user-approved direction; implemented locally, not published

Add the exact transparent line illustration from Figma node 165:543 beneath
the contact form, aligned with the map's lower edge on desktop. Preserve the
exported PNG; exclude transparent margins through a layout crop, without
redrawing or recoloring it. Treat it as decorative with empty alternative text.
The Figma comments panel contained no comments when checked on this date.

Use the same photograph, top alignment, cover sizing, fade mask, and mobile
right alignment as `/reflectie-ghidata/` for the contact section background.
Keep the existing letter card and its transparent mobile treatment. Form
behavior, map integration, privacy handling, and Romanian copy are unchanged.

Source: https://www.figma.com/design/sfLncGRdv2zfIrMkgcyGny/SD-Monorepo?node-id=165-543
Implementation: `website/src/pages/contact.astro`.
Asset: `website/src/assets/homepage/contact-unwinding-line.png`.

Verification: desktop/mobile visual review, 14 focused browser tests, type-check,
Astro build, formatting, and whitespace checks passed. Form submissions were
mocked in tests; no real message was sent. This is local preview evidence only.
