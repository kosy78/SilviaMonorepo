# 003 — Bring the hero heading blur under 20px

- **Status**: DONE
- **Commit**: 8e4a257
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file, 1 value

## Problem

The homepage headline enters from `filter: blur(64px)`. Blur cost grows with
radius and is heaviest in Safari and on phones; it runs during first paint,
when the main thread is busiest.

```css
/* src/components/sections/HomepageHero.astro — current */
@keyframes homepage-hero-heading-reveal {
  from { filter: blur(64px); opacity: 0; transform: translate3d(0, 0.5rem, 0); }
```

## Target

`filter: blur(16px)` at the start of the keyframe. Keep the timing (560ms
`--ease-out`, 100ms delay), opacity and translate unchanged.

## Steps

1. In `@keyframes homepage-hero-heading-reveal`, change `blur(64px)` to `blur(16px)`.

## Boundaries

- Do NOT change the CTA reveal (already 8px) or any timing.

## Verification

- **Mechanical**: `pnpm build`; the smoke test asserting `homepage-hero-heading-reveal` still passes.
- **Feel check**: at 10% speed the heading still resolves softly from a haze,
  with no hard edge in the first frames. Check in Safari.
- **Done when**: no transition-time blur in the hero is above 20px.
