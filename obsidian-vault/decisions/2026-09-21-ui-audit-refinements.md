# UI audit refinements

Date: 2026-09-21
Status: approved direction; implemented locally, not published

Following the layout, typography, and UI polish audit, the user requested implementation:

- Reduce the long Competențe introduction on mobile while preserving its text and desktop scale.
- Share a unitless 1.5 line-height between the homepage Silvia paragraph and exploration invitation copy.
- Fade the Silvia card's hover ring using the same timing as the neighboring cards.
- Replace the Competențe portrait's tinted border with a neutral 1px inset black outline at 10% opacity.
- Serve Avenir locally as WOFF2 instead of depending on an installed system font.

The user explicitly instructed proceeding with Avenir already in use after being informed that no web-font source or license record was in the repository. The six WOFF2 files were converted with FontTools from `/System/Library/Fonts/Avenir.ttc`: Roman (400), Medium (500), and Black (800), with their oblique counterparts. They retain the source glyph coverage, including Romanian diacritics. This records asset provenance and the user instruction; it does not establish a separate licensing verification.

Canonical font declarations: `website/src/styles/fonts.css`. Font assets: `website/public/fonts/avenir-*.woff2`. Existing backgrounds, artwork, copy, and animation designs are preserved.
