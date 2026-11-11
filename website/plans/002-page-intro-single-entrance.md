# 002 — Give page intros a single entrance

- **Status**: DONE
- **Commit**: 8e4a257
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files, deletion only

## Problem

`PageIntro` sections get two entrances at once: the `page-enter` keyframe
(translateY 0.75rem over 560ms) and the scroll reveal (opacity, blur 6px,
translate 12px over 560ms). The two translations stack and fight.

```astro
<!-- src/components/sections/PageIntro.astro:30 — current -->"page-intro
page-enter",
```

```css
/* src/styles/global.css:445 — current */
.page-enter {
  animation: page-enter var(--duration-enter) var(--ease-out) both;
}
```

`PageIntro` is the only user of `.page-enter`.

## Target

PageIntro uses only the shared scroll reveal. Delete `.page-enter`, its
`@keyframes page-enter`, and its entry in the reduced-motion list.

## Steps

1. `src/components/sections/PageIntro.astro`: `"page-intro page-enter",` → `"page-intro",`.
2. `src/styles/global.css`: delete the `.page-enter { … }` rule, the
   `@keyframes page-enter { … }` block, and the `.page-enter,` line inside the
   `prefers-reduced-motion: reduce` selector list.

## Boundaries

- Do NOT touch `ScrollReveal.astro` here (see plan 001).

## Verification

- **Mechanical**: `grep -rn page-enter src` returns nothing; `pnpm build` passes.
- **Feel check**: load /psihoterapie-si-consiliere/ at 10% animation speed; the
  intro rises once (12px, with fade and blur), not twice.
- **Done when**: only one animation runs on `.page-intro` at load.
