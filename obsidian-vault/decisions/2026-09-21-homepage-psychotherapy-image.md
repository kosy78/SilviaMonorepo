# Homepage psychotherapy illustration

Date: 2026-09-21
Status: approved direction; implemented locally, not published

Use the green illustration supplied in [Figma node 131:522](https://www.figma.com/design/sfLncGRdv2zfIrMkgcyGny/SD-Monorepo?node-id=131-522), accessed 2026-09-21, inside the homepage psychotherapy card. This replaces the faded grayscale background treatment for this section only, at the user's explicit request.

Keep the existing Romanian copy and destination. Show the illustration without a gradient, transparency, or blending. Follow the reference's 263:340 image frame and 22px inset; use a 38px outer radius and a concentric 16px image radius (38 minus 22), adapting to a stacked layout on mobile.

Follow-up approved on the same date: add the decorative Ψ icon above the heading from [Figma node 152:631](https://www.figma.com/design/sfLncGRdv2zfIrMkgcyGny/SD-Monorepo?node-id=152-631). Start the card in grayscale; on pointer hover or visible keyboard focus, reveal color and play the authored 3.05-second loop. Its overlay fades from 0 to 1 and the glyph scales from 1 to 0.9 over the first 16.295% of the loop, with cubic-bezier(0.5, 0, 0.5, 1) easing, then holds. Leaving the card resets the animation. Reduced-motion users receive the static color state without movement. Touch screens retain the static default and normal single-tap navigation. Keep the previously selected green illustration; the new request concerns the icon and hover behavior.

Canonical implementation: `website/src/components/sections/HomepageOrientation.astro`.

Later same-day correction requested by the user: the shared design system takes precedence over the one-off 38px Figma corner radius. Use `--radius-xl`, matching the shared Card primitive and the homepage Silvia card. Keep the 22px image inset and derive its radius as `max(0, outer radius - inset)`; at the current token size this yields square image corners. The existing borderless resting state, token-colored hover hairline, and keyboard focus outline already match the adjacent homepage card and remain unchanged. This supersedes the 38px/16px radius pair above; content, layout, and motion are unchanged.
Exact downloaded asset: `website/src/assets/homepage/psychotherapy-orientation-green.png`.

Later same-day media replacement approved by the user: replace the green two-head illustration with the supplied five-second cloud/head video. The optimized local asset is `website/public/videos/psychotherapy-clouds.mp4`, with its first frame as `psychotherapy-clouds-poster.jpg`. Preserve the source download unchanged. This supersedes the green-image selection above, not the card geometry or Ψ animation. Playback is muted, inline, and looping only while the card is hovered or visibly keyboard-focused; leaving resets to the first frame. Reduced motion keeps the still frame, and touch retains normal single-tap link navigation. No external video service or embed is introduced.

Final same-day color clarification: only the top-left Ψ graphic starts in grayscale and reveals color on interaction. The card background and video/poster remain in full color at rest and during hover. This supersedes the earlier whole-card grayscale treatment; playback, motion, and corner geometry are unchanged.

Subsequent same-day polish: reduce the complete Ψ artwork and its layout box to 85% of the original 63px size (53.55px). Resting opacity is 85%; hover and visible keyboard focus restore 100%. Preserve the authored child animation. To restore rounded, concentric media corners while retaining the shared `--radius-xl` outer radius, replace the 22px inset with the shared Card's four-spacing-unit inset (16px). The media radius remains derived as outer minus inset (currently 4.16px). This supersedes the square-media-corner result above.

Later same-day layout correction: show the video edge-to-edge within its media
column, matching the Silvia portrait treatment. Remove the media inset and
independent corner radius; the shared outer card radius clips the video at the
outer corners. Keep padding on the text area only. Preserve the media column
proportion, mobile stacking order, full color, and all existing hover/focus
playback and reduced-motion behavior. This supersedes the inset geometry above.
