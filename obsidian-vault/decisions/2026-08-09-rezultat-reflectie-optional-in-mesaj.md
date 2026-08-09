---
title: Rezultatul reflecției inclus opțional în mesaj
date: 2026-08-09
status: in-review
area: website
updates:
  - 2026-07-08-reflectie-ghidata-rezultate-locale-si-grafic-radar
  - 2026-07-09-formular-contact-cloudflare-email
tags:
  - decizie
  - website
  - reflectie-ghidata
  - contact
  - confidentialitate
---

# Rezultatul reflecției inclus opțional în mesaj

## Context

După afișarea rezultatului Reflecției ghidate, vizitatorul poate dori să ofere
Silviei acel punct de plecare fără să copieze manual textul și fără să transmită
toate răspunsurile individuale. Interacțiunea trebuie să rămână opțională,
clară și separată de calcularea rezultatului.

## Decizie

- Rezultatul nu este inclus implicit. Vizitatorul bifează explicit opțiunea
  „Includeți rezultatul reflecției în mesaj”.
- Se transferă numai titlul rezultatului, explicația scurtă, distribuția
  alegerilor și nota non-diagnostică. Răspunsurile individuale nu sunt
  transferate sau trimise.
- Transferul dintre pagina rezultatului și formular folosește temporar
  `sessionStorage`, izolat la același origin și aceeași filă, fără parametri în
  URL, `window.name` sau `localStorage`. Datele sunt șterse imediat ce formularul
  le-a citit. Sunt transferate numai datele derivate descrise mai sus, nu
  răspunsurile individuale.
- Formularul arată vizibil că rezultatul este inclus și oferă acțiunea
  „Eliminați rezultatul” înainte de trimitere.
- Pages Function validează o limită de 2.000 de caractere și transmite câmpul
  către Worker numai când este prezent. Nu se adaugă bază de date, analytics
  sau logging custom.
- Secțiunea amplă de surse de pe rezultat devine o dezvăluire discretă,
  „Surse și limite”, lângă nota non-diagnostică.

## Consecințe și revizuire

Rezumatul rezultatului poate reprezenta informație sensibilă când este legat de
adresa de email a persoanei. Politica de confidențialitate și procedura
formularului trebuie să descrie fluxul real, iar copy-ul și baza profesională
sau juridică trebuie re-revizuite înainte de lansarea publică. Implementarea și
această decizie rămân `in-review` până la aprobarea Silviei.

## Canonical

- rezultat și opt-in: `website/src/components/islands/GuidedReflection.tsx`;
- confirmare și eliminare în formular:
  `website/src/components/contact/ContactForm.astro`;
- validare și livrare: `website/functions/[[path]].js` și
  `website/workers/contact-mailer.js`;
- procedură: `operations/contact-form.md`.
