# Layout and typography audit refinements

Status: approved for implementation; implemented locally, not deployed by this task.

## Decision

Following the read-only layout → typography → UI audit, the user requested
implementation of the five findings on 2026-09-21.

- Give the competencies biography more room at tablet widths by reducing the
  portrait's share of the grid, retaining the desktop portrait cap and gap.
- Set all three first-session descriptions to the shared `.text-body` style:
  16px with unitless 1.6 line-height.
- Use `.heading-long` for the identified long headings, with a fluid 32–52px
  scale and unitless 1.4 line-height. The competencies statement retains the
  narrower mobile size introduced by concurrent approved work, with the same
  1.4 line-height. Keep short display headings on their existing styles.
- Use weight 400 for the parental-counseling opening paragraph.
- Use 1.5px chevron strokes beside regular-weight support-area labels.

The long-heading treatment covers the competencies statement, first-session
heading, homepage psychotherapy heading, psychotherapy page introduction,
contact title, privacy title, and reflection-result title. The design-system
page includes specimens for the shared heading and body styles.

Canonical implementation: `website/src/styles/global.css` and the affected
page/section components. No public copy, artwork, contact behavior, or
reflection logic is changed by this decision. Other tasks' concurrent font,
surface, and alignment work remains independently owned.

## Validation boundary

Validate the current combined checkout in the browser at mobile, tablet, and
desktop widths, plus type checking, formatting, existing relevant tests, and
the Astro build. The full TinaCMS build stalled before emitting startup output;
that attempt was stopped. Astro build success does not establish CMS or
deployment readiness.

Validation completed: type checking and formatting passed; Astro built all 11
pages; all 22 function tests passed. The smoke, design-system, and guided
reflection suites ran against a separate built preview on port 4339: 87 passed,
1 skipped, and 2 failed. Both failures are the pre-existing single-H1 assertion
on `/competente/` (desktop and mobile); that page already had two H1 elements
before this implementation. The result-heading minimum-size assertion now
reflects the shared 32px mobile scale.

Browser checks covered 320, 393, 768, and 1440px on affected routes, plus
1024px on competencies, with no document overflow observed. The completed
reflection title was verified at all four main widths. These are local checks,
not live deployment or CMS-build evidence.
