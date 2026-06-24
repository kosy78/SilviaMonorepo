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

