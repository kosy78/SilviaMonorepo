---
target: "contact page: combine Îmi puteți scrie with Un prim mesaj and simplify UX/content"
total_score: 31
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-07-26T17-34-03Z
slug: website-src-pages-contact-astro
---
# Contact page UX and content audit

Method: dual-agent (A: `/root/contact_design_review` · B: `/root/contact_detector_review`)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Loading, success, and error states are clear; validation remains native-browser dependent. |
| 2 | Match between system and real world | 4 | Calm Romanian wording and practical format choices match the visitor's mental model. |
| 3 | User control and freedom | 3 | Visitors can use the form or direct email, but the two routes compete instead of forming a hierarchy. |
| 4 | Consistency and standards | 3 | Controls and typography are cohesive; two consecutive contact introductions create an inconsistent action sequence. |
| 5 | Error prevention | 3 | Required email, limits, autocomplete, and privacy guidance are solid; optional practical fields can still invite unnecessary disclosure. |
| 6 | Recognition rather than recall | 3 | Requirements and next steps are visible, but visitors must infer which contact route is preferred. |
| 7 | Flexibility and efficiency | 3 | Autocomplete, compact choices, and email fallback support both quick and deliberate contact. |
| 8 | Aesthetic and minimalist design | 3 | The page is calm and restrained, but repeats its opening before the task begins. |
| 9 | Error recovery | 3 | Failure preserves the form and offers direct email; messages are actionable and plain-language. |
| 10 | Help and documentation | 3 | Privacy guidance and “Ce urmează” answer the right questions, but are not placed at the commitment point. |
| **Total** | | **31/40** | **Good foundation; simplify the entry sequence.** |

## Design Specificity Verdict

The page feels authored for DespreSine rather than category-interchangeable. The Playfair-led hierarchy, open ruled layout, restrained palette, and sensitive reassurance match the site's editorial character. The generic part is the task sequence: visitors encounter a large “Îmi puteți scrie.” introduction, a prominent direct-email block, then a second large “Un prim mesaj” introduction before reaching the form.

The deterministic scan returned `[]` with exit code 0: no coded anti-patterns in `website/src/pages/contact.astro` or `website/src/components/contact/ContactForm.astro`. The rendered overlay logged three candidates, but exposed no rule names or locations and was not corroborated by the scoped CLI scan; these are shell/visual candidates, not actionable contact-source findings.

## Overall Impression

The form mechanics are trustworthy and the copy is unusually considerate. The single biggest opportunity is to stop introducing the same action twice. The page should feel like one calm invitation followed immediately by one clear way to act.

## What's Working

- “Nu este nevoie să explicați întreaga situație…” reduces oversharing pressure at exactly the right emotional moment.
- Only email is required; name, format, and availability remain optional, supporting data minimisation.
- Submission handling is sound: loading text, accessible status feedback, preserved values on failure, a concise success message, and direct-email recovery.

## Priority Issues

### [P1] Two headings introduce one action

**What:** “Îmi puteți scrie.” and “Un prim mesaj” are separated by a full section boundary but have the same purpose.

**Why it matters:** a hesitant visitor has to re-orient immediately before the form. On mobile, this pushes the first required field well below the reassuring opening.

**Fix:** keep “Îmi puteți scrie.” as the only page heading. Put the reassurance and form in the same section, without a divider or second headline.

**Suggested command:** `$impeccable distill`

### [P1] Direct email and the form compete

**What:** the email block and form are presented as equally prominent primary paths.

**Why it matters:** the visitor must choose a channel before knowing which path the page recommends.

**Fix:** make the form the clear primary path and present direct email as a quiet one-line alternative near the form, or make email primary and deliberately demote the form. Do not keep both at equal visual weight.

**Suggested command:** `$impeccable clarify`

### [P2] Optional detail creates social pressure

**What:** name, format, and availability are all visible before submission.

**Why it matters:** “optional” fields can still feel expected in a therapeutic context and delay the primary action.

**Fix:** either keep them visible but subordinate them clearly, group format and availability under “Detalii practice, dacă doriți,” or reduce the form to email plus one optional availability field.

**Suggested command:** `$impeccable distill`

### [P2] “Ce urmează” is detached from the commitment

**What:** the response expectation is in the left column while submit and privacy information are at the bottom of the right column.

**Why it matters:** what happens next and what happens to the data are the two reassurances most useful at submission time.

**Fix:** place a compact response-expectation sentence immediately above or below the submit control, with the privacy statement directly beneath.

**Suggested command:** `$impeccable layout`

## Persona Red Flags

**Jordan, first-time visitor:** the direct email route followed by a separate form introduction may imply that one channel is more appropriate, or that both are expected. The form's labels are clear, but the action hierarchy is not.

**Sam, accessibility-dependent visitor:** labelled native controls, grouped radio choices, focus styling, and live status feedback are strong. The main remaining weakness is reliance on native-browser field validation rather than consistently placed inline messages.

**Casey, distracted mobile visitor:** the stacked layout is legible and touch targets are appropriate, but the submit action sits after two introductions, “Ce urmează,” and several optional decisions. The task is longer than its one-required-field promise.

## Minor Observations

- The H1 period and second heading's different cadence reinforce the sense of two editorial openings.
- The normal-state email address should have one semantic role; repeating it in the failure message remains useful recovery.
- The success message's first-person voice should remain intentionally consistent with the personal H1.

## Questions to Consider

- Should the form be the recommended path, with email as fallback, or should direct email be the primary path?
- Are format and availability useful before availability is confirmed, or can they wait for the reply?
- Can the page make one promise—“Este suficient să întrebați dacă există disponibilitate”—and remove every sentence that repeats it?

## Recommended Single-Section Hierarchy

1. H1: “Îmi puteți scrie.”
2. Reassurance: availability is enough; no situation history or sensitive details are needed.
3. One form-led action, with email as the only required field.
4. Optional practical details, clearly subordinate.
5. Compact expectation: reply includes availability, fee, and practical details.
6. Privacy sentence and policy link.
7. Quiet direct-email alternative.
