# 004 — Shorten the FAQ answer entrance to UI speed

- **Status**: DONE
- **Commit**: 8e4a257
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file, 1 token

## Problem

Opening a FAQ answer runs a 560ms blur-in. FAQ toggles are repeated UI, so they
belong under 300ms. The rule's own comment says it should match the line-reveal
text, which uses `--duration-state` (220ms).

```css
/* src/styles/global.css — current */
[data-slot="accordion-content"][data-state="open"] .faq-answer {
  animation: faq-answer-enter var(--duration-enter) var(--ease-out) both;
}
```

## Target

`animation: faq-answer-enter var(--duration-state) var(--ease-out) both;`
(`--duration-state: 220ms`, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`).

## Steps

1. Replace `var(--duration-enter)` with `var(--duration-state)` in that rule only.

## Boundaries

- Do NOT change `--duration-enter` itself; scroll reveal still uses it.

## Verification

- **Mechanical**: `pnpm build` passes.
- **Feel check**: opening several answers quickly feels immediate; the text
  still arrives with a soft blur, matching the Competențe accordion lines.
- **Done when**: the FAQ answer animation duration computes to 0.22s.
