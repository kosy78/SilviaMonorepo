# Regular font weight throughout the website

Date: 2026-09-21
Status: approved direction; implemented locally, not published

The user requested regular or light typography across all pages instead of the
heavier treatment. Use Avenir Regular (400) for headings, body text, navigation,
buttons, labels, dialogs, and reflection states. Keep existing italic emphasis,
font sizes, spacing, colors, artwork, and motion. Semantic `strong` and `b`
elements remain in the content but render at regular weight.

The shared component styles and design-system reference follow the same rule.
Only regular and regular-italic Avenir faces are declared; unused heavier font
files are retained, not deleted. This does not change the font provenance or
licensing review recorded in [[2026-09-21-ui-audit-refinements]].

Canonical implementation: `website/src/styles/fonts.css`,
`website/src/styles/global.css`, and component-owned typography rules.
