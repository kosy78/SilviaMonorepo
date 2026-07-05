---
title: Google Analytics V1 cu consimțământ explicit
date: 2026-07-05
status: approved
area: website
---

# Google Analytics V1 cu consimțământ explicit

## Context

Website-ul are nevoie de măsurare minimă pentru a înțelege dacă paginile și
parcursul spre contact funcționează. În același timp, proiectul tratează
informațiile despre sănătate mintală ca sensibile și are o direcție
privacy-first.

Decizia inițială de fundație tehnică nota că analytics nu era inclus în
scaffold. Cerința curentă este să pregătim Google Analytics pentru website.

## Opțiuni analizate

- Fără analytics: confidențialitate maximă, dar fără feedback despre pagini,
  conținut și parcursul spre contact.
- Analytics privacy-first self-hosted: control mai bun, dar introduce operare,
  mentenanță și interpretare suplimentară în V1.
- Google Analytics 4 încărcat fără consimțământ: implementare simplă, dar
  nepotrivită pentru un site românesc/EU cu tematică de sănătate mintală.
- Google Analytics 4 încărcat doar după consimțământ: măsurare de bază, cu
  suprafață de date redusă și tradeoff explicit de confidențialitate.

## Decizie

Website-ul va include o integrare GA4 pentru streamul public V1
`G-D490J31F6H`, condiționată de:

- posibilitatea de a suprascrie streamul prin `PUBLIC_GA_MEASUREMENT_ID` la
  build time;
- consimțământ explicit în browser înainte de încărcarea `gtag.js`;
- advertising storage, advertising personalization, user data și Google signals
  refuzate/dezactivate;
- URL-uri trimise fără query string sau fragment;
- un singur eveniment custom V1: `contact_email_clicked`, fără date personale
  sau conținut clinic.

Nu se urmăresc răspunsuri din reflecția ghidată, conținut de formulare, emailuri
ale vizitatorilor, nume, telefon sau user ID-uri.

## Consecințe

- Datele vor fi incomplete față de un setup analytics fără consimțământ, dar mai
  potrivite cu direcția privacy-first.
- Campaign attribution prin query string/UTM este limitat în V1 deoarece
  `page_location` este curățat. Orice extindere pentru campanii trebuie să
  definească parametri permiși și să evite date sensibile.
- Website-ul are nevoie de revizuirea politicii de confidențialitate și, dacă
  este cazul, a unei politici de cookies înainte de lansarea publică finală.
- Setările contului GA4 privind retenția, data sharing, accesul utilizatorilor
  și traficul intern trebuie documentate în `operations/analytics-and-consent.md`
  înainte de folosirea operațională.

## Surse consultate

- Google Tag Platform consent mode pentru websites, accesat 2026-07-05:
  https://developers.google.com/tag-platform/security/guides/consent
- Google Analytics GA4 configuration reference, accesat 2026-07-05:
  https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- Google Analytics GA4 events setup, accesat 2026-07-05:
  https://developers.google.com/analytics/devguides/collection/ga4/events
- Google Analytics EU, Switzerland, UK data and privacy, accesat 2026-07-05:
  https://support.google.com/analytics/answer/12017362
- Google Analytics PII best practices, accesat 2026-07-05:
  https://support.google.com/analytics/answer/6366371
