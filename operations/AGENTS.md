# Operations

## Scope

This directory contains the non-secret procedures and governance needed to
operate the digital presence. It may eventually cover:

- legal, professional, and GDPR research notes;
- privacy and data-flow documentation;
- domain, DNS, hosting, and deployment procedures;
- account ownership and recovery procedures without secret values;
- contact-form handling procedures;
- publishing and review checklists;
- incident and rollback procedures;
- vendor decisions;
- environment-variable documentation using placeholders;
- recurring maintenance tasks.

Current V1 operational facts to preserve in procedures:

- The website is deployed through Cloudflare Pages from the GitHub `main`
  branch, with `website/` as the project root and `dist/` as the output.
- `https://despresine.ro` is the canonical public domain, but every launch or
  deployment verification must confirm DNS resolution and Cloudflare Pages custom
  domain attachment. The Pages `.pages.dev` URL is an operational fallback, not
  the canonical public URL.
- The public website includes privacy and cookie policy pages, an analytics
  consent layer for Google Analytics, and Cloudflare Pages Web Analytics may be
  injected by the hosting project. Privacy and cookie documentation must account
  for all active analytics paths.
- The public footer includes an ANPC/SAL online indicator linked to
  `https://reclamatiisal.anpc.ro/`; do not add SOL/ODR or other legal/trust
  indicators without fresh dated research and review.

## Operating principles

- Document who owns a system, what it is for, and how it is maintained.
- Record dates for rules, policies, prices, and service behavior that can
  change.
- Prefer authoritative sources for legal, professional, privacy, and platform
  requirements.
- Distinguish a research note from reviewed legal or professional advice.
- Keep procedures actionable and test them after material changes.
- Record approval requirements for public credentials, service descriptions,
  privacy text, tracking, campaigns, and sensitive forms.

## Secrets and personal data

Never store:

- passwords;
- API keys or tokens;
- private keys;
- recovery codes;
- production `.env` files;
- session cookies;
- private client or lead information;
- contact-form submissions;
- guided-reflection answers;
- confidential email content.

Document secret names, purpose, owner, rotation expectation, and storage system,
but use placeholders instead of values.

## Privacy and compliance

Before adding a form, analytics tool, advertising pixel, embed, email provider,
database, or automation, document:

- purpose;
- data collected;
- lawful and professional basis requiring review;
- processor or vendor;
- data destination and retention;
- user-facing notice or consent requirement;
- access and deletion procedure;
- security and operational owner;
- decision date and reviewer.

Do not claim that the project is compliant merely because a checklist is
complete. Legal and professional requirements must be reviewed by qualified
people where appropriate.

## Publication controls

Public credentials, age requirements, privacy notices, emergency language,
testimonials, tracking behavior, and advertising claims require explicit review.
Deployment procedures should include verification, rollback, and ownership
information. Keep the exact office address private unless Silvia explicitly
approves a later change to the V1 rule.

When public legal or privacy text changes after review, update both the website
implementation and the corresponding Obsidian decision record or operational
note so future agents can tell what was reviewed, what changed, and when.
