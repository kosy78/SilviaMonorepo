---
name: DespreSine
description: A calm editorial system for a trust-first psychotherapy practice.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.147 0.004 49.25)"
  primary: "oklch(0.216 0.006 56.043)"
  secondary: "oklch(0.97 0.001 106.424)"
  muted-foreground: "oklch(0.553 0.013 58.071)"
  border: "oklch(0.923 0.003 48.717)"
  ring: "oklch(0.709 0.01 56.259)"
  chart-violet-1: "oklch(0.811 0.111 293.571)"
  chart-violet-2: "oklch(0.606 0.25 292.717)"
  chart-violet-3: "oklch(0.541 0.281 293.009)"
  chart-violet-4: "oklch(0.491 0.27 292.581)"
  chart-violet-5: "oklch(0.432 0.232 292.759)"
  destructive: "oklch(0.577 0.245 27.325)"
typography:
  display:
    fontFamily: "Playfair Display Variable, Playfair Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(3rem, 8.2vw, 7.25rem)"
    fontWeight: 400
    lineHeight: 0.93
    letterSpacing: "-0.04em"
  section:
    fontFamily: "Playfair Display Variable, Playfair Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.035em"
  editorial:
    fontFamily: "Source Serif Pro, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Geist Variable, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist Variable, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0.01em"
rounded:
  control: "10px"
  soft-control: "10px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
  section: "clamp(3.5rem, 8vw, 7.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  button-hero:
    textColor: "{colors.background}"
    rounded: "{rounded.soft-control}"
    padding: "12px 20px"
    height: "48px"
  badge-kicker:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
    height: "28px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
    height: "48px"
---

# Design System: DespreSine

## Overview

**Creative North Star: "Duna structure, DespreSine soul."**

DespreSine combines the structural discipline of a contemporary editorial product with the softness and humanity already present in its watercolor imagery. The system is calm, serious, discreet, and approachable: typography carries the emotional tone, thin rules organize information, and controls remain direct and familiar.

Duna is a reference for spacing, open responsive grids, and systematic reuse—not for fintech motifs, dashboards, saturated product chrome, or generic component-library styling. Shadcn primitives are owned source code and must be visually reconciled with this system before use.

**Key Characteristics:**

- Typography-led hierarchy with generous, deliberate whitespace.
- White and warm off-white surfaces separated by one-pixel rules.
- Violet appears where the watercolor identity already earns it.
- Small pills are reserved for short kickers and states; primary actions stay compact rectangles.
- Static Astro surfaces remain hydration-free; React is reserved for meaningful interaction.

## Colors

The palette is the exact shadcn Stone preset selected in `b4vf0yLwvq`, paired with its Violet chart ramp. Stone supplies the warm editorial neutrals; Violet remains a restrained bridge to the existing watercolor identity.

### Primary

- **Deep Stone:** The default primary-action surface and strongest neutral emphasis.
- **Violet 3:** A selective identity color for the hero, guided reflection, and closely related accents.

### Secondary

- **Violet 1:** A low-intensity accent for reflective state markers and chart foundations.

### Neutral

- **Background:** The default page and control surface.
- **Muted Foreground:** Secondary copy that still meets readable contrast.
- **Border:** Dividers, field borders, and rule-based grids.
- **Secondary / Muted:** Subtle grouping without adding elevation.
- **Ring:** The preset's quiet Stone focus color, reinforced by the site's two-stage focus treatment.

**The Violet Rarity Rule.** Violet belongs to the established watercolor/reflection world; it does not become a generic accent on every control.

## Typography

**Display Font:** Playfair Display Variable (with Playfair Display, Georgia, and serif fallbacks)  
**Editorial Font:** Source Serif Pro (with Georgia fallback)  
**Body Font:** Geist Variable (with Geist and system sans-serif fallbacks)

**Character:** Playfair gives the practice an elegant, reflective voice. Source Serif Pro supports image-led editorial sections, while Geist keeps navigation, forms, and practical information direct and legible.

### Hierarchy

- **Display:** Regular, fluid sizing, tight leading and size-specific negative tracking for primary page statements.
- **Section:** Regular, compact editorial headings that clearly step down from display type.
- **Editorial:** Comfortable serif reading text for expressive homepage compositions.
- **Body:** Geist sans-serif at a readable measure, normally no wider than 65–75 characters.
- **Label:** Medium-weight sans-serif with minimal positive tracking for controls and field labels.

**The Two-Voice Rule.** Display serif carries reflection and identity; Geist carries action and practical clarity. Source Serif appears only where the composition is explicitly editorial.

## Layout

The system is mobile-first and uses fluid page gutters (`clamp(1.25rem, 4vw, 4rem)`) around a 74rem content container. Large sections use generous fluid vertical spacing. Desktop compositions prefer open two- or three-column grids separated by hairline rules; mobile layouts collapse into one readable column with the same rules preserving sequence and grouping.

The homepage area section is the reference expression: one large editorial introduction, three open image-and-copy columns, and one wider reflection feature. Content should not be forced into uniform floating cards when a rule-separated grid communicates the same structure more honestly.

**The Open Grid Rule.** Use whitespace and one-pixel rules to establish relationships before introducing a boxed surface.

## Elevation & Depth

The system is flat by default. Depth comes from watercolor imagery, tonal surface changes, and clear foreground/background contrast rather than stacked shadows. Shadows are reserved for functional floating layers such as the consent panel; keyboard focus uses a crisp two-stage ring rather than an ambient glow.

**The Functional Elevation Rule.** A shadow must explain that a surface floats above the document; it is never a default decoration for content groups.

## Shapes

Controls use the preset's medium `0.625rem` radius. Full pills are limited to compact badges and status labels. Editorial images are clipped lightly or left square, and thin borders stay one pixel.

## Components

### Buttons

- **Shape:** Preset-standard 10px corners, 48px default touch target, and compact horizontal padding.
- **Primary:** Ink surface with paper text; hover reverses to paper with an ink border.
- **Outline:** Paper surface with a hairline border that darkens on hover.
- **Hero / Reflection:** The same 10px system radius; Violet gradient or translucent Stone treatment only in the watercolor context.
- **Focus / Press:** A high-contrast focus ring and immediate, subtle press scale; reduced-motion users receive color feedback without transform.

Astro links consume the shared button variant function directly. React `Button` is used for actual buttons inside interactive islands; this prevents unnecessary hydration and avoids cross-framework slot composition.

### Chips

- **Style:** Compact 28px badges with pill geometry, short text, and restrained tracking.
- **Use:** Section kickers and brief status labels only—not navigation, long prose, or primary actions.

### Cards / Containers

- **Corner Style:** No default card shell. Editorial groups are normally open and rule-separated.
- **Background:** Paper, Soft Paper, or Watercolor Wash according to information hierarchy.
- **Shadow Strategy:** Flat at rest.
- **Border:** One-pixel Hairline Gray when separation is necessary.

### Inputs / Fields

- **Style:** 48px minimum height, Background surface, 10px radius, and a one-pixel Border token.
- **Focus:** Border shifts to ink and the shared high-contrast focus ring appears.
- **Error / Disabled:** Error uses the semantic destructive tone; disabled fields retain readable text and a soft-paper surface.
- **Composition:** Forms use FieldGroup, Field, FieldLabel, FieldDescription, Input, Textarea, Button, and Alert while preserving native form semantics.

### Navigation

Navigation remains lightweight and content-first. Labels are direct Romanian nouns, links provide 44px minimum targets, and the mobile menu uses the existing native button/disclosure behavior rather than a heavier menu primitive.

### Guided Reflection Choice

Reflection options remain native radio inputs inside full-width labels. Selection uses ink and paper inversion, keyboard focus encloses the whole choice, and answers stay local to the React island. Do not replace this with a diagnostic-looking score control.

## Do's and Don'ts

### Do:

- **Do** preserve the watercolor artwork and editorial typography as the recognizable identity.
- **Do** use semantic tokens and shared variants before adding one-off utility combinations.
- **Do** keep static pages hydration-free and measure bundle impact when an interactive primitive is proposed.
- **Do** use one-pixel rules, open grids, and generous spacing to create structure.
- **Do** maintain 44–48px control targets, strong focus visibility, reduced motion, and reduced transparency fallbacks.

### Don't:

- **Don't** copy Duna's fintech language, dashboard patterns, metrics, or product chrome.
- **Don't** introduce generic shadcn card grids, toasts, dialogs, or navigation components without a demonstrated need.
- **Don't** turn every label or action into a pill.
- **Don't** add gradients, glass, blur, or shadows outside the established watercolor or functional overlay context.
- **Don't** fabricate testimonials, outcomes, metrics, credentials, prices, or clinical claims to fill a layout.
