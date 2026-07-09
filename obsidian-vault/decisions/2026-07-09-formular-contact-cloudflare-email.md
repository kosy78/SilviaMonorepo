---
title: Formular minimal de contact prin Cloudflare Email Service
date: 2026-07-09
status: in-review
area: website
updates:
  - 2026-06-24-website-conversion-foundation
tags:
  - decizie
  - website
  - contact
  - confidentialitate
---

# Formular minimal de contact prin Cloudflare Email Service

## Context

Calea `mailto:` rămâne utilă, dar poate eșua pentru vizitatorii fără un client
de email configurat. Brief-ul V1 cere și un formular minimal, fără transformarea
website-ului într-un sistem de lead-uri sau într-o bază de date.

## Decizie

- Formularul solicită numai emailul ca informație obligatorie. Numele, formatul
  întâlnirii și câteva detalii strict practice sunt opționale.
- Formularul nu include câmp pentru diagnostic, simptome, istoric sau mesaj
  clinic și recomandă evitarea informațiilor sensibile.
- Requestul este validat server-side de Cloudflare Pages Function, protejat prin
  same-origin, limite de lungime și un câmp-capcană.
- Pages Function apelează un Worker intern prin service binding. Workerul trimite
  emailul cu Cloudflare Email Service către adresa verificată a Silviei.
- Website-ul nu persistă mesajul în bază de date, analytics sau repository.
- Adresa directă `silvia.drn@gmail.com` rămâne fallback.
- Protecția Basic Auth și blocarea indexării rămân active în timpul revizuirii.

## Activare

La 2026-07-09, Email Routing a fost activat pentru `despresine.ro`, destinația
`silvia.drn@gmail.com` a fost verificată, Workerul intern a fost deployat fără
rută publică `workers.dev`, iar service bindingul Pages a fost configurat în
Production și Preview. Deploymentul protejat a trecut, iar endpointul răspunde
cu `401` fără credentiale, conform porții de pre-lansare. Testele locale acoperă
succesul, eroarea, validarea și accesibilitatea. Activarea pentru vizitatori
rămâne condiționată de un test de livrare autentificat cu date fictive și de
re-revizuirea copy-ului de confidențialitate.

## Canonical

- UI: `website/src/components/contact/ContactForm.astro`;
- validare și endpoint: `website/functions/[[path]].js`;
- livrare email: `website/workers/contact-mailer.js`;
- procedură: `operations/contact-form.md`.

## Surse

- Cloudflare Email Service, accesat 2026-07-09:
  https://developers.cloudflare.com/email-service/
- Configurarea send bindings, accesat 2026-07-09:
  https://developers.cloudflare.com/email-service/configuration/send-bindings/
- Limite și destinații verificate, accesat 2026-07-09:
  https://developers.cloudflare.com/email-service/platform/limits/
