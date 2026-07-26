---
target: homepage audit (copy frozen)
total_score: 25
max_score: 32
na_heuristics: 7,9
p0_count: 0
p1_count: 0
timestamp: 2026-07-25T21-20-26Z
slug: website-src-pages-index-astro
---
# Homepage audit

Method: dual-agent (A: homepage_design_review · B: repo_pattern_review)

## Design health score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 3/4 | Navigation and FAQ state are clear; external mailto completion is outside the page. |
| 2 | Match with the real world | 4/4 | Calm Romanian language and non-diagnostic framing fit the audience. |
| 3 | User control and freedom | 3/4 | Skip link, explicit routes, and Escape-close navigation work; contact uses two destination patterns. |
| 4 | Consistency and standards | 3/4 | Strong visual system, with some semantic and CTA-pattern drift. |
| 5 | Error prevention | 3/4 | Sensitive-detail guidance and consent choice are strong. |
| 6 | Recognition rather than recall | 3/4 | Routes and labels are visible; practical reassurance arrives late in a long page. |
| 7 | Flexibility and efficiency | n/a | Persuade/experience surface. |
| 8 | Aesthetic and minimalist design | 3/4 | Authored editorial feel; large inactive blog cards add avoidable visual weight. |
| 9 | Error recovery | n/a | No error-producing flow is completed on the homepage. |
| 10 | Help and documentation | 3/4 | The FAQ answers first-contact questions clearly. |
| **Total** |  | **25/32** | **Good (78%)** |

## Design specificity verdict

The homepage feels authored for DespreSine, not like generic AI output. Playfair Display, Geist, the Silvia portrait, painterly imagery, contour drawing, and restrained violet create a coherent trust-first world. The risk is repetition: several consecutive sections use oversized serif headings, pale illustrated panels, and card-like shells. The blog placeholders are where that coherence begins to feel template-driven.

The deterministic CLI detector returned zero findings for both the full imported homepage target set and the typography-only scan. The browser overlay reported 13 runtime flags: 10 nested-card false positives caused by shadcn CardHeader/CardFooter structure, one intentional violet-accent false positive, one false positive on an inline legal link, and one valid signal for the 40px consent buttons.

## Priority issues

### [P2] Reduced-motion preference is only partially honored

The hero runs scroll-linked parallax and the global stylesheet enables smooth scrolling and page-entry translation without a reduced-motion override. The psychodynamic component does include one, so the behavior is inconsistent. Add a non-animated path for the hero, smooth scrolling, and page-entry treatment while preserving hierarchy.

Suggested command: `$impeccable animate`

### [P2] Initial consent actions miss the project's 44px target bar

Both analytics choice buttons measure 40px high at desktop and 390px mobile. They pass the WCAG 2.5.8 24px minimum but miss this project's explicit 44px standard. Use the default button size or `min-h-11`, then test both initial actions before consent is stored.

Suggested command: `$impeccable adapt`

### [P2] Important card titles are visually headings but semantically generic divs

The shared CardTitle primitive renders a div. Blog topics and the two practical steps therefore disappear from heading navigation even though FAQ questions correctly appear as H3 elements. Allow a semantic heading element or wrap these instances in H3 while preserving the component styling.

Suggested command: `$impeccable harden`

### [P2] The blog placeholders carry more visual weight than present utility

Three large article-like cards are intentionally labeled as in preparation and are not links. The state is honest, but the visual treatment promises a reading path that does not yet exist and temporarily makes the blog louder than the core service story. Quiet or condense the placeholder composition until articles are published; preserve current wording.

Suggested command: `$impeccable distill`

### [P2] Blog descriptions use a 15px reading role

The descriptions are substantive prose but compute to 15px, below the established 16px ordinary body floor. Raise only the typographic role and keep the current text unchanged.

Suggested command: `$impeccable typeset`

## Persona red flags

- **Jordan, first-time visitor:** the three blog cards look actionable but are intentionally static; three ideas of a first step compete across the hero, reflection, and practical sections.
- **Casey, distracted mobile visitor:** the page is 8,396px tall at 390px, and the consent actions are only 40px high. The page has no horizontal overflow and primary CTAs otherwise meet the 44px target.
- **Sam, accessibility-dependent visitor:** Axe reports zero violations and the skip link, focus indicators, nav labels, and FAQ semantics are strong. The remaining risks are unguarded scroll/entry motion and visual card headings omitted from the semantic outline.

## Minor observations

- The homepage uses only two established faces. Core prose is 17–18px with comfortable line height and measure.
- Two section backgrounds are hard-coded rather than tokenized; this is low risk for the current light-only experience but weakens future theme integrity.
- The email-first hero CTA is consistent with the established product direction; the later contact-page CTA is a resilience path, not automatically a defect.
- `pnpm format:check` currently fails only on the already-modified Tina lockfile; this is unrelated to the homepage audit and was left untouched.

## Questions to consider

1. Should the next pass prioritize accessibility mechanics, or visual hierarchy and typography?
2. Should the inactive blog preview cards remain visually prominent until articles exist, or become a quieter teaser while keeping all wording unchanged?
3. Should a later implementation cover only the top three issues, or all five P2 findings?
