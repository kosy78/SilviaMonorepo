---
name: DespreSine
description: A quiet editorial system for a private, trust-first psychotherapy practice.
colors:
  linen: "oklch(0.982 0.009 83)"
  ink: "oklch(0.195 0.015 55)"
  card-linen: "oklch(0.992 0.006 83)"
  quiet-olive: "oklch(0.355 0.06 125)"
  quiet-olive-foreground: "oklch(0.985 0.006 83)"
  linen-wash: "oklch(0.942 0.014 80)"
  linen-muted: "oklch(0.948 0.012 80)"
  quiet-text: "oklch(0.49 0.019 60)"
  olive-soft: "oklch(0.925 0.03 125)"
  olive-soft-foreground: "oklch(0.305 0.05 125)"
  linen-border: "oklch(0.87 0.015 75)"
  olive-focus: "oklch(0.48 0.065 125)"
  destructive: "oklch(0.577 0.235 27.325)"
typography:
  display:
    fontFamily: "Avenir, Avenir Next, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.25rem, 7vw, 6.25rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Avenir, Avenir Next, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 4vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Avenir, Avenir Next, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.0625rem, 1.5vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Avenir, Avenir Next, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.01em"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.875rem"
spacing:
  control: "0.25rem"
  compact: "0.75rem"
  default: "1rem"
  spacious: "1.5rem"
  section: "clamp(4rem, 8vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.quiet-olive}"
    textColor: "{colors.quiet-olive-foreground}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1rem"
    height: "2.75rem"
  button-outline:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.625rem 1rem"
    height: "2.75rem"
  card:
    backgroundColor: "{colors.card-linen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1rem"
  tag-section:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.quiet-text}"
    rounded: "9999px"
    padding: "0.25rem 0.625rem"
    height: "1.5rem"
---

# Design System: DespreSine

## Overview

**Creative North Star: "The Quiet Consulting Room"**

DespreSine should feel like entering a private room prepared for attention:
warm but unsentimental, quiet without becoming vacant, and composed without
appearing institutional. Linen surfaces provide calm ambient light; Quiet Olive
marks action, focus, and living detail; black-brown ink keeps the experience
serious and legible. Botanical photography and moving shadows may introduce
time and atmosphere, but never decorative spectacle.

The system is editorial in rhythm and restrained in interface behavior. It
uses generous space, low visual noise, one typographic family, soft tonal
layering, and clear semantic controls. Product copy remains the primary source
of emotional warmth; components support it with calm predictability.

**Key Characteristics:**

- Linen-first surfaces with rare, purposeful Quiet Olive emphasis.
- Avenir across display, body, and controls, differentiated by scale and rhythm.
- Generous editorial spacing and readable line lengths.
- Rounded, lightly outlined surfaces with flat resting states.
- Botanical light and photography used as atmosphere, not proof or decoration.
- Brief, compositor-safe motion with reduced-motion equivalents.

## Colors

The palette combines warm Linen neutrals with a restrained vegetal olive; ink
and borders stay soft enough for an editorial page while retaining strong text
and focus contrast.

### Primary

- **Quiet Olive:** the rare action and emphasis color for primary controls,
  focus-adjacent states, and selected semantic emphasis.
- **Olive Focus:** the visible keyboard-focus and interaction ring role.

### Secondary

- **Linen Wash:** low-contrast grouped surfaces and supporting control states.
- **Olive Soft:** selected or contextual emphasis where a filled primary would
  be too forceful.

### Neutral

- **Linen:** the canonical page background and dominant visual field.
- **Card Linen:** the slightly lighter card and popover surface.
- **Ink:** primary text and high-contrast selection treatment.
- **Quiet Text:** secondary copy, metadata, and helper text.
- **Linen Border:** dividers, outlines, and quiet component boundaries.

**The Rare Olive Rule.** Quiet Olive is a semantic accent, not a decorative
wash. Its scarcity preserves calm and makes actions easier to recognize.

**The Linen Continuity Rule.** Adjacent sections separate primarily through
space, content, and tonal layering; full-width divider lines are exceptional.

## Typography

**Display Font:** Avenir, with Avenir Next, Helvetica Neue, Arial, and sans-serif
fallbacks.

**Body Font:** Avenir, with the same fallback stack.

**Character:** One humanist sans-serif voice keeps the site contemporary and
unaffected. Hierarchy comes from generous scale changes, controlled line
length, italic emphasis, and restrained weight—not from mixing type families.

### Hierarchy

- **Display:** regular, tightly tracked, near-solid line height for hero and
  page-defining statements.
- **Headline:** regular, balanced, and compact for editorial section titles.
- **Body:** regular with generous leading; long-form reading stays within the
  `44rem` reading measure.
- **Label:** medium, compact, and minimally tracked for tags and controls.

**The One Voice Rule.** Use the incumbent Avenir stack for public interface and
editorial roles. Create contrast through scale, spacing, and occasional italic
emphasis rather than introducing another font.

**The Light Weight Rule.** Avoid excessive boldness. Body copy and display
headings remain open and calm; medium weight is reserved for labels, actions,
and short credibility anchors.

## Layout

The public site uses a centered `76rem` content measure and fluid page gutters
from `1.25rem` to `3rem`. Section rhythm is deliberately large, scaling from
`4rem` to `7rem`, while prose is constrained to a `44rem` reading width.
Compositions often pair a broad editorial text area with photography or a
secondary panel, then collapse into a single vertical reading sequence on
smaller screens.

The fixed header sits above the content without becoming a permanent opaque
bar; its backdrop and boundary appear after scroll or while mobile navigation
is open. Major responsive shifts occur around content-driven breakpoints,
including the mobile/tablet card collapse near `56rem`, the navigation change
below `70rem`, and the wide hero treatment at `82rem`.

**The Breathing-Room Rule.** Preserve section space before adding borders,
shadows, decorative bands, or additional containers. Empty space is structural.

## Elevation & Depth

The system is flat by default. Depth comes from tonal separation, translucent
layering over imagery, thin outlines, and soft backdrop blur. Shadows appear
sparingly on floating controls, active overlays, and hover feedback; they do
not define every card.

**The Flat-at-Rest Rule.** A static surface should not look lifted unless it
must float over media or another interactive layer. Hover and open states may
introduce subtle elevation to confirm response.

## Shapes

Controls use gently curved corners derived from a `0.625rem` base radius. Cards
and major panels use the larger `0.875rem` radius; tags are fully pill-shaped.
Borders are thin and low-contrast. Photographic regions may be clipped by their
container when the crop supports composition.

Avoid mixing many unrelated corner sizes in one composition. A card's children
inherit or visually align with its outer radius rather than creating nested,
competing silhouettes.

## Components

### Buttons

- **Shape:** gently curved, minimum `44px` primary touch height.
- **Primary:** Quiet Olive fill with Linen text; reserved for committed actions.
- **Outline:** Linen surface with a quiet border for secondary actions.
- **Hover / Focus:** short state transitions, strong visible focus ring, and a
  restrained one-pixel/scale press response.
- **Ghost:** used for low-emphasis navigation or utility controls, not primary
  conversion actions.

### Tags

Tags are quiet editorial labels, not badges competing for attention. Section
tags use Linen, a thin border, Quiet Text, and a `24px` pill height. Dark status
tags may mark unavailable or preparation states; semantic success uses the
dedicated success palette.

### Cards / Containers

Cards use Card Linen or contextual muted surfaces, a large radius, and either a
thin outline or tonal separation. They are flat at rest. Internal padding
begins around `1rem` and expands to `2.5rem` for editorial feature panels.

### Inputs / Fields

Inputs use a transparent or Linen surface, thin semantic border, medium radius,
and a visible olive focus ring. Invalid states use the destructive role with a
plain-language message; disabled states lower contrast without hiding labels.

### Navigation

Navigation uses small, direct labels with the current page indicated by an
underline. The desktop header remains visually transparent over the hero; the
mobile menu becomes a full-width Linen panel with clear open/close state and
Escape support.

### Reflection Promo

The guided-reflection promotion is a signature split composition: calm copy on
Linen beside slow botanical light, merging through a soft gradient. Its visible
copy must explain anonymity, non-storage, orientative status, and the
non-diagnostic boundary before asking the visitor to begin.

## Do's and Don'ts

### Do:

- **Do** use Linen as the dominant surface and Quiet Olive for rare semantic
  emphasis.
- **Do** create hierarchy with scale, line length, space, and copy before adding
  decorative containers.
- **Do** use approved professional photography and botanical light sparingly.
- **Do** keep public interactions keyboard-accessible, responsive, and complete
  under reduced-motion and reduced-transparency preferences.
- **Do** make privacy and non-diagnostic limits visible at sensitive decisions.

### Don't:

- **Don't** introduce bright palettes, therapy clichés, clinical-dashboard
  styling, generic wellness imagery, or marketplace trust patterns.
- **Don't** use Quiet Olive as a broad decorative background or color every
  interactive element.
- **Don't** add a second public type family without replacing this documented
  system through an explicit design decision.
- **Don't** stack borders, shadows, and nested rounded containers when spacing
  or tonal layering communicates the relationship.
- **Don't** use motion as spectacle or allow it to obscure content and controls.
