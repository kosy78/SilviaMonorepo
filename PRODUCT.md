# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary visitors are adults, young adults, and adolescents aged 16 and over who are considering psychoanalytic psychotherapy or counselling in Bucharest or online. They may arrive uncertain, emotionally burdened, or simply looking for a trustworthy way to understand the practice before deciding whether to make contact.

## Product Purpose

DespreSine gives visitors a calm, accurate introduction to Silvia Dinu's practice, explains psychoanalytic psychotherapy and counselling, offers an anonymous guided reflection, and provides an optional email-first path to contact. Success means that a visitor can understand the offer, assess whether it may fit their situation, and choose a next step without pressure.

## Positioning

DespreSine is a practitioner-led, trust-first presence rather than a therapy marketplace, clinical assessment product, or wellness-influencer brand. Its guided reflection supports private orientation without diagnosis, scoring pathology, storing answers, or requiring contact details.

## Operating Context

- Romanian-only public website at `https://despresine.ro`.
- Sessions may be in person in București, zona Piața Victoriei / Banu Manta, or online.
- Primary contact is email-first through `silvia.drn@gmail.com` and a minimal contact form.
- Blog content is authored through TinaCMS and stored in the repository.
- The website remains behind its pre-launch access gate until a separate launch decision.

## Capabilities and Constraints

- Astro with TypeScript, Tailwind CSS, and React only for interactive islands.
- Cloudflare Pages-compatible static deployment; no database in V1.
- Guided-reflection answers are processed locally and are not stored.
- No public phone number, pricing, exact office address, testimonials, diagnostic claims, or promises of outcomes.
- Credentials, professional titles, legal statements, and regulatory claims require confirmation before publication.
- Public-facing copy uses correct Romanian diacritics and `dumneavoastră` by default.

## Brand Commitments

The public identity is `DespreSine`, with Silvia Dinu named as the practitioner. The experience is calm, serious, discreet, elegant, emotionally intelligent, and approachable without becoming casual or promotional. It preserves the existing editorial and watercolor character while using Duna as a reference for structural discipline, responsive composition, and systematic component reuse rather than as a visual identity to copy.

## Evidence on Hand

- Approved website copy and factual project context live in this repository.
- Existing watercolor assets, line illustrations, wordmark mark, typography files, and implemented page compositions live under `website/src` and `website/public`.
- The current site contains no approved testimonials, public pricing, outcome claims, or clinical-assessment evidence; future work must not fabricate them.

## Product Principles

- Trust before conversion.
- Explain without diagnosing.
- Offer meaningful choice without pressure.
- Collect and expose the minimum information necessary.
- Prefer durable, accessible, low-complexity implementation.

## Accessibility & Inclusion

The website must support keyboard use, visible focus, meaningful semantic structure, readable contrast, reduced motion, reduced transparency, and responsive use from narrow mobile screens upward. Critical information and contact paths must not depend on motion, hover, color alone, or a specific device size.
