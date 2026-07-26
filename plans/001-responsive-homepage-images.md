# 001 — Deliver responsive homepage images

- **Status**: DONE
- **Commit**: 09016e3
- **Severity**: MEDIUM
- **Category**: Loading performance
- **Estimated scope**: 8 files moved or edited; approximately 80–120 lines

## Problem

The homepage ships six raster source files from `website/public/images/homepage/`
without responsive candidates or modern-format sources. Their current source size
is approximately 1.6 MB:

- `hero-watercolor.png`: 672 KB, 772×1024
- `card-body.png`: 268 KB, 1122×1402
- `card-relations.png`: 316 KB, 1122×1402
- `card-changes.png`: 252 KB, 1122×1402
- `card-difficulties.jpg`: 24 KB, 420×558
- `reflection-accent.jpg`: 92 KB, 598×897

The hero currently sends the same PNG to every viewport:

```astro
<!-- website/src/components/sections/HomepageHero.astro:13 — current -->
<img
  class="homepage-hero__art absolute inset-0 h-full w-full"
  src="/images/homepage/hero-watercolor.png"
  alt=""
  width="772"
  height="1024"
  fetchpriority="high"
  decoding="async"
/>
```

The three area illustrations also send their full 1122px PNG even when rendered
at approximately 151–350 CSS pixels:

```astro
<!-- website/src/components/sections/HomepageAreas.astro:62 — current -->
<img
  src={area.image}
  alt=""
  width="1122"
  height="1402"
  loading="lazy"
  decoding="async"
/>
```

This wastes bandwidth, especially on mobile, and increases the cost of the hero
image that is eligible to become the Largest Contentful Paint element.

This plan targets the current working tree based on commit `09016e3`. At the time
the plan was written, the homepage components and all six image files were
modified or untracked. Do not execute this plan from a clean `09016e3` checkout
unless those homepage changes and assets have first been committed or otherwise
made available in the execution worktree.

## Target

Use Astro 7's built-in `Picture` component and existing Sharp image service. Do
not add a dependency or a separate conversion script.

Move the six source images from:

```text
website/public/images/homepage/
```

to:

```text
website/src/assets/homepage/
```

Import each image as local `ImageMetadata` and render it through:

```astro
import { Picture } from "astro:assets";

<Picture
  src={image}
  formats={["avif", "webp"]}
  widths={[/* exact candidates specified below */]}
  sizes="/* exact layout sizes specified below */"
  quality={80}
  alt=""
/>
```

Astro must generate AVIF first, WebP second, and retain the original source
format as the fallback `<img>`. Preserve empty alt text because all six images
are decorative and their adjacent headings/copy already communicate the content.

Use these exact candidates:

| Image | `widths` | `sizes` |
| --- | --- | --- |
| Hero watercolor | `[390, 640, 772]` | `"100vw"` |
| Intro/difficulties | `[280, 360, 420]` | `"(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc((100vw - 3.5rem) / 2), 440px"` |
| Body, relations, changes | `[240, 360, 560, 720]` | `"(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) calc((100vw - 3.5rem) / 2), 280px"` |
| Reflection accent | `[280, 420, 598]` | `"(max-width: 639px) calc(100vw - 2.5rem), 449px"` |

Keep the hero eager and high priority:

```astro
loading="eager"
fetchpriority="high"
decoding="async"
```

Keep every image in `HomepageAreas.astro` lazy and automatic priority:

```astro
loading="lazy"
fetchpriority="auto"
decoding="async"
```

Required transfer budgets, measured with cache disabled:

- At a 390px viewport, the selected hero resource must be no more than 150 KB.
- At a 1440px viewport, the selected hero resource must be no more than 250 KB.
- After scrolling the entire homepage at 390px, transferred homepage image bytes
  must be no more than 900 KB total.
- The selected resource width for each 390px area card must be 720px or smaller;
  the browser must not download the original 1122px PNG as its primary source.
- The change must introduce no layout shift: generated `<img>` elements retain
  intrinsic width and height and existing containers retain their current size.

## Repo conventions to follow

- Components use Astro frontmatter imports and colocated component CSS.
- Decorative images use `alt=""`; preserve that accessibility decision.
- Below-fold homepage images already use `loading="lazy"` and
  `decoding="async"`; retain those attributes.
- The hero already uses `fetchpriority="high"`; retain it because it is an LCP
  candidate.
- Existing image geometry is controlled by selectors such as
  `.homepage-area-card__image img`; do not rewrite the layout around the new
  `<picture>` wrapper.
- Astro 7.0.7 and Sharp 0.34.5 are already available through the current
  dependency graph. Do not add `sharp` directly unless a future dependency
  change makes the existing image service unavailable and the user explicitly
  approves that scope change.

## Steps

1. Move all six files from `website/public/images/homepage/` to
   `website/src/assets/homepage/`. Preserve filenames. Do not keep public-folder
   duplicates.
2. In `website/src/components/sections/HomepageHero.astro`, import `Picture` from
   `astro:assets` and import
   `../../assets/homepage/hero-watercolor.png` as `heroWatercolor`.
3. Replace the hero `<img>` with the following properties while preserving its
   existing class and decorative alt text:

   ```astro
   <Picture
     class="homepage-hero__art absolute inset-0 h-full w-full"
     src={heroWatercolor}
     formats={["avif", "webp"]}
     widths={[390, 640, 772]}
     sizes="100vw"
     quality={80}
     alt=""
     loading="eager"
     fetchpriority="high"
     decoding="async"
   />
   ```

4. Confirm the `class` is emitted on the fallback `<img>`. If Astro 7 emits it
   elsewhere, use the documented `Picture` image-attribute API; do not change
   the `.homepage-hero__art` CSS selector or introduce a layout wrapper hack.
5. In `website/src/components/sections/HomepageAreas.astro`, import `Picture`
   and import the other five images from `../../assets/homepage/`.
6. Replace string paths in the `areas` array with the imported metadata objects.
   Keep the existing title and description values unchanged.
7. Replace the difficulties image with `Picture`, using
   `widths={[280, 360, 420]}` and the exact intro `sizes` value from the Target
   table.
8. Replace each mapped area-card image with `Picture`, using
   `widths={[240, 360, 560, 720]}` and the exact area-card `sizes` value from the
   Target table.
9. Replace the reflection accent image with `Picture`, using
   `widths={[280, 420, 598]}` and the exact reflection `sizes` value from the
   Target table.
10. Set `formats={["avif", "webp"]}`, `quality={80}`, `alt=""`,
    `loading="lazy"`, `fetchpriority="auto"`, and `decoding="async"` on all
    five below-fold `Picture` instances.
11. Verify that existing selectors ending in `img` still apply to the fallback
    image within each generated `<picture>`. Adjust only selector reach if
    necessary; preserve existing object-fit, positioning, transforms, and card
    geometry.
12. Search the repository for `/images/homepage/`. The search must return no
    stale runtime references before deleting or considering the old public path
    fully retired.

## Boundaries

- Do NOT modify copy, card order, image artwork, crop direction, or alt semantics.
- Do NOT combine this with the hero-distortion or responsive-card-layout fixes.
- Do NOT change animation behavior or motion timing.
- Do NOT add a CDN, image SaaS, client-side image loader, or service worker.
- Do NOT add new dependencies or a custom image-generation script.
- Do NOT lazy-load the hero.
- Do NOT remove explicit image sizing or allow the page to shift while images
  decode.
- Do NOT include generated `website/dist/` files in source control.
- If the source paths, component markup, or current image dimensions differ from
  this plan, STOP and report the drift instead of improvising.

## Verification

- **Mechanical**:
  1. Run `pnpm --dir website check`; expect zero Astro/TypeScript diagnostics and
     a passing formatting check.
  2. Run `pnpm --dir website build:astro`; expect a successful static build.
  3. Run
     `find website/dist/_astro -type f \( -name '*.avif' -o -name '*.webp' \) -print`;
     expect generated AVIF and WebP files for all six source images.
  4. Run `rg -n '/images/homepage/' website/src website/public`; expect no stale
     runtime references.
  5. Run
     `pnpm --dir website exec playwright test tests/smoke.spec.ts tests/mobile-resilience.spec.ts --project=desktop-chromium --project=mobile-chromium --reporter=line`;
     expect all applicable tests to pass.
- **Browser check**:
  1. At 390×844 with cache disabled, reload the homepage and inspect the hero
     request. Confirm the browser selects an AVIF or WebP candidate no wider than
     640px unless device pixel ratio requires the 772px source.
  2. Scroll through every card and confirm lazy requests occur near the viewport,
     not during the initial hero load.
  3. Inspect `currentSrc`, `srcset`, and `sizes` for the hero, each area image, and
     the reflection accent. Confirm candidate selection matches the Target table.
  4. Repeat at 768px and 1440px. Confirm artwork cropping and object positioning
     are visually unchanged from the pre-change page.
  5. Throttle to Slow 4G, disable cache, and reload. Confirm the hero remains
     visible without layout jump and the page becomes visually useful before
     below-fold images download.
- **Performance check**:
  1. Record transferred bytes for homepage images at 390px and 1440px.
  2. Confirm the three transfer budgets in the Target section.
  3. Compare against the 1.6 MB baseline and require at least a 45% reduction in
     full-page transferred homepage image bytes at 390px.
- **Done when**: all six sources are managed local Astro assets; AVIF and WebP
  candidates are generated; the browser chooses viewport-appropriate candidates;
  loading priority and visual geometry are unchanged; the transfer budgets pass;
  and no original public-path references remain.
