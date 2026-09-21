# Section entrances on scroll

Status: approved direction; implemented locally, not published.

The user requested the existing blur appearance effect across sections as visitors
scroll down. Public pages share one progressive-enhancement observer in
`website/src/components/layout/ScrollReveal.astro`, included by `BaseLayout.astro`.

- Offscreen content sections enter once per page visit: opacity 0 to 1, blur 6px
  to 0, and vertical translation 12px to 0, using the existing 560ms entrance
  duration and ease-out token.
- Nested sections animate independently rather than animating their parent too.
- Initially visible sections also play their entrance, including both homepage
  cards on tall screens. Only sections already above a restored scroll position
  skip the entrance. The existing homepage hero retains its own animation, and
  the footer content follows the same scroll entrance.
- Interactive island states keep their own transitions. Hover effects remain intact.
- Reduced motion, keyboard focus, anchor navigation, printing, and disabled
  JavaScript keep content immediately readable. Completed sections release their
  filter and translation styles; there is no continuous scroll animation loop.

No content, artwork, spacing, or colors change as part of this decision.
