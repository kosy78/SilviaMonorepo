---
title: Formular de contact actualizat și hartă Google Maps cu încărcare explicită
date: 2026-08-31
status: in-review
area: website
updates:
  - 2026-07-09-formular-contact-cloudflare-email
tags:
  - decizie
  - website
  - contact
  - confidentialitate
  - google-maps
---

# Formular de contact actualizat și hartă Google Maps cu încărcare explicită

## Context

Feedbackul vizual din 2026-08-31 cere un titlu și un text introductiv noi,
numele obligatoriu, un câmp general pentru mesaj fără exemplu precompletat,
eliminarea textelor duplicate de sub formular și o hartă pentru zona Piața
Victoriei / Banu Manta.

## Decizie

- Numele și emailul sunt obligatorii și validate în browser și în Pages
  Function. Mesajul rămâne opțional și limitat la 400 de caractere.
- Câmpul este etichetat „Mesajul/ Solicitarea dvs”, fără placeholder,
  și păstrează recomandarea scurtă de a evita informațiile sensibile.
- Adresa directă de email este prezentă în introducere. Nota despre livrarea în
  email și post-scriptumul duplicat sunt eliminate din formular.
- Pagina afișează numai zona publică „București, zona Piața Victoriei / Banu
  Manta”; adresa exactă nu este publicată.
- Google Maps nu se încarcă automat. Iframe-ul primește sursa numai după acțiunea
  explicită „Încărcați harta Google”, iar website-ul nu păstrează această
  alegere.
- Încărcarea hărții este separată de consimțământul Google Analytics. Politicile
  publice descriu conexiunea directă la Google și rămân `in-review` înainte de
  lansare.

## Consecințe și revizuire

Harta introduce Google Maps ca vendor terț numai după acțiunea vizitatorului.
Copy-ul formularului, necesitatea numelui și formulările de confidențialitate
trebuie re-revizuite înainte de lansarea publică. Implementarea nu schimbă
protecția Basic Auth, blocarea indexării, endpointul same-origin sau lipsa unei
baze de date pentru mesaje.

## Canonical

- pagină și hartă: `website/src/pages/contact.astro`;
- formular: `website/src/components/contact/ContactForm.astro`;
- validare: `website/functions/[[path]].js`;
- politici publice: `website/src/pages/politica-cookies.astro` și
  `website/src/pages/politica-de-confidentialitate.astro`;
- procedură: `operations/contact-form.md`.

## Surse

- feedback browser furnizat de utilizator, 2026-08-31;
- Google Privacy Policy, accesată 2026-08-31:
  https://policies.google.com/privacy
