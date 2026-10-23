# Silvia Dinu Digital Presence

## Purpose

This repository is the shared workspace for building and operating Silvia Dinu's
digital presence. It is broader than a website repository. It should eventually
contain the website, SEO and editorial content, the anonymous guided reflection
flow, social media planning, paid campaign materials, brand assets, operational
documentation, and the decisions that connect those systems.

Treat this repository as the source of truth. Keep work understandable to both
humans and AI agents, preserve decision history, and avoid scattering canonical
content across unrelated tools.

## Project context

Silvia Dinu is based in Bucharest and offers psychoanalytic psychotherapy and
counseling to adults, young adults, and adolescents aged 16 and over. Sessions
are available in person and online. Public location copy may mention only:

> București, zona Piața Victoriei / Banu Manta

Do not publish an exact office address in V1.

For adolescents aged 16-17, parental or legal guardian consent is required.
Any public explanation of this requirement must be checked for professional and
legal accuracy before publication.

The current recommended public credential wording is:

> Psiholog cu drept de liberă practică  
> Psihoterapeut psihanalitic sub supervizare

The primary services wording is:

> Psihoterapie psihanalitică și consiliere

Training and experience currently available for public context:

- ACPP-B training
- More than 10 years of experience
- Psychoanalytic or psychodynamic orientation

Verify credentials, professional titles, legal statements, and regulatory
claims with Silvia before publishing them. Repository context is not a
substitute for professional or legal review.

## Product direction

The first release is a Romanian-only, trust-first digital presence with:

- a custom website;
- SEO-focused service and editorial content;
- a blog;
- an anonymous guided reflection experience;
- an email-first contact path;
- foundations for Instagram and paid campaigns;
- privacy, legal, and operational documentation.

The project should feel serious, calm, discreet, elegant, and approachable. It
must not resemble a wellness influencer brand, a generic medical template, or a
therapy marketplace.

### Audience and areas of work

The intended audience includes adults, young adults, and adolescents aged 16+,
of any gender. Public content may discuss:

- anxietate;
- depresie;
- simptome psihosomatice;
- dificultăți relaționale;
- identitate;
- stimă de sine;
- tranziții de viață;
- adolescență 16+.

These are areas of work, not promises of treatment outcomes or diagnostic
labels.

### Language and voice

All public-facing website and campaign copy is Romanian and must use correct
Romanian diacritics.

Use `dumneavoastră` as the default form of address. Adolescent-specific
materials may use `tu` only when this is an explicit content decision.

The voice should be:

- calm and emotionally intelligent;
- clear without becoming simplistic;
- professional without sounding institutional;
- elegant and restrained;
- approachable without becoming casual;
- informative rather than persuasive.

Avoid:

- guaranteed or exaggerated outcomes;
- diagnostic claims;
- superiority claims;
- fear, urgency, shame, or emotional pressure;
- sensationalist symptom content;
- generic wellness slogans;
- aggressive conversion language;
- unsupported medical, legal, or psychological claims.

## V1 decisions

- Canonical public domain: `https://despresine.ro`.
- Treat `www.despresine.ro` as an alias or redirect target only, not as the
  canonical URL.
- Current Cloudflare Pages production fallback:
  `https://silvia-dinu-website.pages.dev`. Verify that the canonical domain
  resolves and is attached before describing a deployment as live on
  `despresine.ro`.
- Website language: Romanian only.
- Contact: `silvia.drn@gmail.com` and a minimal contact form.
- No public phone number.
- No public pricing.
- In-person and online sessions receive equal visibility.
- Published legal support pages exist for privacy and cookies. Their original
  V1 baseline was treated as reviewed, but the 2026-07-09 contact-form and email
  delivery changes place the current copy back in review. Re-review before
  public launch and before changing controller identity, retention periods,
  analytics, forms, vendor behavior, or legal/professional claims.
- The public footer includes privacy/cookie links. The ANPC/SAL indicator was
  removed from the current website baseline on 2026-08-29 at the user's
  request; re-review the exact consumer-protection obligations before public
  launch. Do not add SOL/ODR, testimonials, marketplace-style badges, or
  professional logos/affiliations without a new dated decision, verified
  status, and confirmed usage rights. On 2026-10-22, at the user's request,
  the footer gained a quiet monochrome row with the ACPP-B, Universitatea Titu
  Maiorescu (Facultatea de Psihologie), and Colegiul Psihologilor din România
  logos; see
  `obsidian-vault/decisions/2026-10-22-logo-uri-formare-in-subsol.md`. Do
  not add further logos without the same process.
- Visual direction: black and white, editorial, minimal, and typography-led.
- Use no more than one or two professional photographs in the initial site.
- Use `DespreSine` as the public wordmark, with `Silvia Dinu` as the visible
  practitioner subtitle or supporting line. Do not depend on a finished logo.
- Do not use clichéd therapy stock photography.
- Privacy-first architecture is preferred. The current site includes an
  analytics consent layer for Google Analytics. Cloudflare Web Analytics is
  disabled for V1; re-enabling it requires a dated decision and updated privacy
  review.

## Guided reflection

The interactive experience should be presented as `Despre sine: Reflecție
ghidată` in page context and `Reflecție ghidată` in navigation, not as a
clinical quiz or assessment. A working title is:

> Ce pare să ceară atenție acum?

It may help a visitor reflect on whether current difficulties are most visible
in:

- the body or physical symptoms;
- emotional states;
- relationships or recurring patterns.

V1 rules:

- anonymous by default;
- client-side where practical;
- do not store answers;
- do not require an email address;
- do not diagnose, score pathology, or assign a patient type;
- state clearly that the result is not a diagnosis and does not replace a
  professional psychological evaluation;
- offer a gentle, optional path to contact.
- Results may show a local, orientative distribution of answer frequency across
  the three reflection areas. This must remain descriptive, not a severity
  score, diagnostic score, or patient categorization. Avoid chart forms that
  could be mistaken for a clinical assessment.

## Repository map

| Path              | Responsibility                                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `website/`        | Production website, website-owned content, guided reflection implementation, forms, metadata, and deployment configuration.                  |
| `campaigns/`      | Approved campaign briefs, executable social and paid campaign assets, landing-page campaign material, experiments, and results.              |
| `obsidian-vault/` | Strategy and thinking layer: research, drafts, content planning, SEO maps, editorial calendars, and decision records.                        |
| `brand-assets/`   | Approved visual identity files, photography, logos, typography references, templates, and exportable assets.                                 |
| `operations/`     | Legal and privacy notes, account and deployment procedures, domain and hosting records, workflows, and non-secret operational documentation. |

Each top-level directory contains its own `AGENTS.md`. A directory-level file
extends this root file and provides more specific instructions. When
instructions conflict, follow the nearest `AGENTS.md`, except that no child
instruction may weaken the privacy, safety, credential-verification, or
ethical-marketing rules in this file.

## Separation of responsibilities

- `obsidian-vault/` contains working knowledge, exploration, and drafts.
- `campaigns/` contains campaign material ready for review, execution, or
  measurement.
- `website/` contains the runnable product and website-owned source content.
- `brand-assets/` contains visual source files and approved exports.
- `operations/` contains procedures and governance, never application secrets.

When material moves between areas, preserve its source and status. Do not keep
multiple files that all claim to be the canonical version of the same copy.

## Agent working rules

1. Read this file and the nearest directory-level `AGENTS.md` before changing
   files.
2. Inspect existing work before creating a parallel structure.
3. Prefer small, explicit structures over speculative abstractions.
4. Record material product, content, or compliance decisions in the Obsidian
   decision log once that log exists.
5. Distinguish clearly between draft, reviewed, approved, published, and
   archived material.
6. Preserve Romanian diacritics in public copy and filenames when practical,
   while using stable lowercase kebab-case for technical paths.
7. Date research that can become stale and include its source.
8. Verify current advertising platform rules, search guidance, legal
   requirements, and third-party service behavior before relying on them.
9. Never invent facts about Silvia, credentials, clients, outcomes, services,
   availability, or professional affiliations.
10. Do not add patient, client, lead, or visitor health information to this
    repository.

## Privacy and security

- Never commit passwords, API keys, tokens, private keys, session data, or
  production environment values.
- Use example environment files with placeholders when configuration is needed.
- Do not place contact-form submissions, guided-reflection answers, analytics
  exports containing identifiers, or private correspondence in Git.
- Collect the minimum information needed for any form.
- Treat information about mental health as sensitive.
- Do not add analytics, cookies, advertising pixels, databases, or third-party
  embeds without documenting their purpose and privacy implications.
- Do not make legal compliance claims solely because a library or service is
  described as privacy-friendly.

## Quality bar

A change is ready when it is accurate, scoped to the correct directory, easy to
understand, and consistent with the project's tone and privacy constraints.
Website changes should also be accessible, responsive, performant, and tested
in proportion to their risk. Campaign and content work should identify its
audience, objective, status, source, and approval state.
