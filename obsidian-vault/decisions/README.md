---
title: Registrul deciziilor
updated: 2026-07-10
tags:
  - decizii
  - index
---

# Registrul deciziilor

Acest director conține deciziile materiale de produs, conținut, tehnologie și
conformitate. Starea din tabel descrie decizia, nu starea întregii implementări.

| Data       | Decizie                                                                                                                     | Stare                                   | Relații și domeniu activ                                                                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-24 | [[2026-06-24-website-technical-foundation\|Fundația tehnică a website-ului]]                                                | `approved`, parțial înlocuită           | Hostingul Vercel și regula fără CMS au fost înlocuite de [[2026-07-05-cloudflare-pages-si-tinacms\|Cloudflare Pages și TinaCMS]]; Astro, React izolat, MDX și testarea rămân active.                    |
| 2026-06-24 | [[2026-06-24-website-conversion-foundation\|Fundația de conversie a website-ului]]                                          | `approved`                              | Contactul calm și email-first rămân active; formularul minimal este acum cerință V1, dar activarea lui rămâne condiționată de evaluarea fluxului și confidențialității în `operations/contact-form.md`. |
| 2026-07-02 | [[2026-07-02-fundatia-seo-si-indexare\|Fundația SEO și blocarea indexării]]                                                 | `approved`                              | Actualizată de [[2026-07-07-domeniu-canonic-despresine-ro\|Domeniul canonic despresine.ro]]. Blocarea indexării rămâne activă în pre-lansare.                                                           |
| 2026-07-02 | [[2026-07-02-extindere-linkedin\|Extinderea campaniei sociale pe LinkedIn]]                                                 | `approved`                              | Textele și publicarea rămân condiționate de aprobările documentate în decizie.                                                                                                                          |
| 2026-07-05 | [[2026-07-05-cloudflare-pages-si-tinacms\|Cloudflare Pages și TinaCMS pentru blog admin]]                                   | `approved`                              | Înlocuiește numai hostingul și politica CMS din fundația tehnică din 2026-06-24.                                                                                                                        |
| 2026-07-05 | [[2026-07-05-google-analytics-v1\|Google Analytics V1 cu consimțământ explicit]]                                            | `approved`                              | Orice schimbare de analytics, retenție, vendor sau evenimente redeschide revizuirea notice-ului public.                                                                                                 |
| 2026-07-07 | [[2026-07-07-domeniu-canonic-despresine-ro\|Domeniu canonic despresine.ro]]                                                 | `approved`                              | Actualizează domeniul substituent din decizia SEO; este context pentru [[2026-07-08-brand-despre-sine-si-reflectie-ghidata\|brandul DespreSine]].                                                       |
| 2026-07-08 | [[2026-07-08-brand-despre-sine-si-reflectie-ghidata\|Brand DespreSine și Reflecție ghidată]]                                | `approved`                              | Stabilește wordmarkul și limitele produsului; rezultatele sunt detaliate de decizia aflată în revizie de mai jos.                                                                                       |
| 2026-07-08 | [[2026-07-08-footer-legal-si-anpc-sal\|Footer legal și ANPC SAL]]                                                           | `approved` pentru baseline-ul V1 curent | Copy-ul legal curent este tratat ca revizuit pentru V1; nu există în repository dovada unei validări juridice externe. Schimbările materiale impun re-revizuire.                                        |
| 2026-07-08 | [[2026-07-08-reflectie-ghidata-rezultate-locale-si-grafic-radar\|Rezultate locale și distribuție pentru Reflecție ghidată]] | `in-review`                             | Actualizează decizia de brand; formularea și vizualizarea rezultatului nu sunt încă aprobate pentru lansare.                                                                                            |
| 2026-07-09 | [[2026-07-09-formular-contact-cloudflare-email\|Formular minimal de contact prin Cloudflare Email Service]]                 | `in-review`                             | Actualizează fundația de conversie; activarea depinde de verificarea destinației, deploy, test end-to-end și re-revizuirea privacy.                                                                     |
| 2026-07-09 | [[2026-07-09-dezactivare-cloudflare-web-analytics\|Dezactivarea Cloudflare Web Analytics în V1]]                            | `approved`                              | Actualizează decizia GA4; numai GA4 condiționat de consimțământ rămâne analytics V1.                                                                                                                    |
| 2026-07-10 | [[2026-07-10-formare-si-orientare\|Pagina Formare și orientare]]                                                            | `approved`                              | Înlocuiește eticheta „Despre Silvia” în navigație și în titlul paginii; ruta `/despre-silvia/` rămâne stabilă.                                                                                          |

## Lanțuri de actualizare

- [[2026-06-24-website-technical-foundation|Fundație tehnică]] →
  [[2026-07-05-cloudflare-pages-si-tinacms|Cloudflare Pages și TinaCMS]]
  (înlocuire parțială: hosting și CMS).
- [[2026-07-02-fundatia-seo-si-indexare|Fundație SEO]] →
  [[2026-07-07-domeniu-canonic-despresine-ro|Domeniu canonic]] →
  [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand DespreSine]]
  (actualizări de domeniu și identitate publică, nu anularea întregii decizii
  anterioare).
- [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand și limite produs]] →
  [[2026-07-10-formare-si-orientare|Pagina Formare și orientare]]
  (actualizare de denumire și poziționare pentru pagina profesională).
- [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand și limite produs]] →
  [[2026-07-08-reflectie-ghidata-rezultate-locale-si-grafic-radar|Rezultate locale]]
  (`in-review`).

## Convenție

Fiecare decizie trebuie să precizeze data, starea, contextul, opțiunile
analizate, decizia și consecințele. O decizie care înlocuiește sau actualizează
alta trebuie să lege ambele înregistrări și să precizeze domeniul înlocuirii.
Stările folosite sunt `draft`, `in-review`, `approved`, `published` și
`archived`.
