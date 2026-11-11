# 001 — Stop scroll reveal from re-hiding content that already painted

- **Status**: DONE
- **Commit**: 8e4a257
- **Severity**: HIGH
- **Category**: Purpose & frequency / Performance
- **Estimated scope**: 1 file, ~10 lines

## Problem

`src/components/layout/ScrollReveal.astro` is a module script, so it runs after
the browser may already have painted the page. On a 4× CPU-throttled load of
the live homepage, first contentful paint happened at 904ms and the script set
`data-scroll-reveal="pending"` on the in-view `homepage-orientation` section at
921ms: content was visible, vanished (opacity 0, blur 6px) and faded back in
over 560ms. The same happens on Blog, Contact and Psihoterapie.

```ts
/* src/components/layout/ScrollReveal.astro — current */
for (const section of sections) {
  const bounds = section.getBoundingClientRect();
  if (bounds.bottom <= 0) {
    section.dataset.scrollReveal = "visible";
    continue;
  }
  section.dataset.scrollReveal = "pending";
```

The comment above that loop records a deliberate decision: sections inside the
initial viewport keep their entrance on tall screens. Respect it; only stop the
re-hide when the page has already painted.

## Target

When first-contentful-paint has already happened, sections that intersect the
viewport are marked `visible` immediately. Sections below the fold still reveal
on scroll. When the script runs before first paint, behaviour is unchanged.

## Repo conventions to follow

- Reveal states are `pending` → `revealing` → `visible` on `data-scroll-reveal`.
- Timing tokens: `--duration-enter: 560ms`, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` in `src/styles/tokens.css` (unchanged).

## Steps

1. Before the loop, add:
   `const hasPainted = performance.getEntriesByName("first-contentful-paint").length > 0;`
2. Change the early-exit condition to
   `if (bounds.bottom <= 0 || (hasPainted && bounds.top < window.innerHeight))`.

## Boundaries

- Do NOT change the CSS states, durations or easing.
- Do NOT touch sections below the fold.
- If the loop differs from the excerpt, STOP and report.

## Verification

- **Mechanical**: `pnpm build` passes; `npx playwright test tests/scroll-reveal.spec.ts` passes.
- **Feel check**: with DevTools CPU throttling 4× and Slow 4G, reload Blog and
  Contact: the first section never blinks out after appearing. On an
  unthrottled reload the entrance still plays when the script beats first paint.
- **Done when**: no in-view section transitions from painted-visible to `pending`.
