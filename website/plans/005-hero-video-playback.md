# 005 — Load and play the hero video only when it can be seen

- **Status**: DONE
- **Commit**: 8e4a257
- **Severity**: MEDIUM
- **Category**: Performance / Accessibility
- **Estimated scope**: 1 file + 1 test assertion

## Problem

```astro
<!-- src/components/sections/HomepageHero.astro — current -->
<video
  class="homepage-hero__video"
  data-homepage-hero-video
  autoplay
  muted
  loop
  playsinline
  preload="metadata"></video>
```

- With `prefers-reduced-motion: reduce`, CSS hides the video and the script
  pauses it, but `autoplay` has already started a 450kB download (verified on
  the live site).
- After scrolling past the hero, the video keeps decoding off-screen. The
  closing video (`HomepageClosing.astro`) already pauses out of view; the hero
  does not.

## Target

- Markup: remove `autoplay`, set `preload="none"`.
- Script: play only when the hero intersects the viewport AND motion is
  allowed; otherwise pause. `play()` starts the download on demand.

## Repo conventions to follow

Imitate `src/components/sections/HomepageClosing.astro` (`inView` flag +
`sync()` + IntersectionObserver + reduced-motion `change` listener).

## Steps

1. Remove `autoplay`; change `preload="metadata"` to `preload="none"`.
2. In the hero script, track `heroInView` with an IntersectionObserver on the
   hero section and call the existing `syncVideoPlayback` from it. In
   `syncVideoPlayback`, pause (keep `data-ready`) when `!heroInView`.
3. Update `tests/smoke.spec.ts` so it expects no `autoplay` and `preload="none"`.

## Boundaries

- Do NOT change the opacity fade on `canplay` or the poster/image fallback.

## Verification

- **Mechanical**: `pnpm build`; hero smoke tests pass.
- **Feel check**: the video still fades in over the image on load. Scroll down,
  and in DevTools the video element reports `paused === true`. With reduced
  motion emulated, the Network panel shows no `.mp4` request.
- **Done when**: zero `.mp4` bytes load under reduced motion.
