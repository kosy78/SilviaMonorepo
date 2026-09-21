# Header logo interaction

Date: 2026-09-21
Status: approved direction; implemented locally, not published

Use the exact black-and-white variant from [Figma component set 131:740](https://www.figma.com/design/sfLncGRdv2zfIrMkgcyGny/SD-Monorepo?node-id=131-740), accessed 2026-09-21, as the header logo's default. On pointer hover over the brand or visible keyboard focus, crossfade to the pastel Variant3. Return to monochrome when interaction ends. Touch navigation continues to work with one tap; reduced motion switches instantly.

Exact exports: nodes 131:741 and 131:747, stored as `website/src/assets/brand/logo-monochrome.png` and `website/src/assets/brand/logo-variant-3.png`. Keep the existing 38px header mark size and home destination. The footer and other brand assets are outside this change's scope.

Canonical implementation: `website/src/components/layout/SiteHeader.astro`.

Follow-up, 2026-09-21: the user superseded the pastel hover state with [Variant4, node 165:545](https://www.figma.com/design/sfLncGRdv2zfIrMkgcyGny/SD-Monorepo?node-id=165-545). Use the exact exported blue-and-green artwork in `website/src/assets/brand/logo-variant-4.png`. Keep the existing monochrome default and smooth crossfade, triggered by hovering either the icon or wordmark, with the same keyboard-focus and reduced-motion behavior. The node's motion context contains no timeline tracks.

Scope extension, 2026-09-21: apply the same treatment to every visible website logo. The visible marks are the shared header and footer; both now crossfade to Variant4 when the icon or brand text is hovered or keyboard-focused. Preserve the footer's existing default logo and 52px size. Make its brand a home link so the interaction is keyboard accessible. Favicons remain static browser metadata.
