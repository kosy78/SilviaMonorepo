---
title: Harta Google Maps cu încărcare automată pe pagina Contact
date: 2026-09-04
status: in-review
area: website
updates:
  - 2026-08-31-formular-contact-si-harta-google-maps
tags:
  - decizie
  - website
  - contact
  - confidentialitate
  - google-maps
---

# Harta Google Maps cu încărcare automată pe pagina Contact

## Context

Feedbackul vizual din 2026-09-04 cere afișarea automată a hărții orientative
pentru zona Piața Victoriei / Banu Manta și o integrare cromatică mai discretă
în paleta Linen + Quiet Olive.

## Opțiuni analizate

1. Păstrarea butonului de încărcare explicită.
   - păstrează conexiunea la Google după o acțiune a vizitatorului;
   - nu răspunde cererii de a vedea harta direct în pagina Contact.

2. Încărcare automată prin Maps JavaScript API, cu un stil Snazzy Maps.
   - harta devine vizibilă fără un pas suplimentar;
   - controalele implicite pot fi eliminate, iar harta poate folosi direct
     paleta Linen + Quiet Olive;
   - necesită o cheie Google Maps publică, restricționată pentru browser.

## Decizie

- Cu `PUBLIC_GOOGLE_MAPS_API_KEY` configurată, pagina folosește Maps JavaScript
  API cu toate controalele implicite dezactivate și fără gesturi sau puncte de
  interes interactive. Fără cheie, iframe-ul Google Maps rămâne fallback.
- Harta păstrează numai zona publică Piața Victoriei / Banu Manta, fără adresă
  exactă; o zonă discretă de aproximativ 450 m înlocuiește un pin precis.
- Stilul pornește de la modelul CC0 „Flat Pale” din Snazzy Maps și îl adaptează
  la Linen + Quiet Olive, cu punctele de interes ascunse, un contur discret și
  estompare la margini. Nu introduce un alt furnizor, tracking sau date noi.
- Cheia Google Maps este vizibilă în browser prin natura API-ului, nu se comite
  în Git și trebuie restricționată la originile aprobate și Maps JavaScript API.
- Politicile publice de cookies și confidențialitate descriu încărcarea
  automată și conexiunea directă la Google Maps.

## Consecințe și revizuire

Această decizie înlocuiește numai acțiunea explicită pentru Google Maps din
decizia de la 2026-08-31. Încărcarea automată este un schimb de comportament al
unui vendor terț: copy-ul legal și mecanismul de informare trebuie re-revizuite
înainte de lansarea publică. Nu schimbă consimțământul pentru Google Analytics,
formularul, adresa publicată, protecția Basic Auth sau blocarea indexării.

## Canonical

- hartă și stil: `website/src/pages/contact.astro`;
- politici publice: `website/src/pages/politica-cookies.astro` și
  `website/src/pages/politica-de-confidentialitate.astro`;
- comportament acoperit: `website/tests/smoke.spec.ts`.

## Surse

- feedback browser furnizat de utilizator, 2026-09-04;
- Snazzy Maps, „Flat Pale”, CC0:
  https://snazzymaps.com/style/14889/flat-pale
- Google Maps Platform, „Set up the Maps JavaScript API”, accesată 2026-09-04:
  https://developers.google.com/maps/documentation/javascript/get-api-key
- Google Privacy Policy:
  https://policies.google.com/privacy
