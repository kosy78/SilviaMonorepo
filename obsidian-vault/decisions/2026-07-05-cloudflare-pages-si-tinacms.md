---
title: Cloudflare Pages și TinaCMS pentru blog admin
date: 2026-07-05
status: approved
area: website
supersedes:
  - 2026-06-24-website-technical-foundation
---

# Cloudflare Pages și TinaCMS pentru blog admin

## Context

Fundația inițială a website-ului prevedea Astro, MDX, conținut în repository și
deploy compatibil Vercel. A apărut o cerință nouă: Silvia trebuie să poată scrie,
edita și publica articole de blog printr-o interfață de administrare ușor de
folosit, fără cost lunar pentru V1.

## Opțiuni analizate

- Continuarea cu MDX editat manual în repository: cost zero, dar dificil pentru
  un editor non-tehnic.
- Backend custom cu autentificare și bază de date: flexibil, dar disproporționat
  pentru V1 și cu responsabilități mari de securitate, backup și mentenanță.
- CMS headless extern cu bază de date proprie: interfață bună, dar mută
  conținutul canonic în afara repository-ului.
- TinaCMS/TinaCloud cu fișiere MDX în GitHub: interfață de editare, autentificare
  gestionată de TinaCloud și conținut păstrat în repository.

## Decizie

Website-ul va fi pregătit pentru Cloudflare Pages ca hosting principal, cu
TinaCMS/TinaCloud Free pentru administrarea articolelor din blog.

Cloudflare Pages va construi site-ul din directorul `website/`, cu:

- build command: `pnpm build`;
- output directory: `dist`;
- production branch: `main`.

TinaCMS va administra colecția `website/src/content/blog/` și va păstra
articolele ca fișiere MDX în GitHub. Publicarea unui articol se face prin
comutarea câmpului `draft` și declanșarea unui rebuild Cloudflare.

## Consecințe

- Partea din decizia din 2026-06-24 referitoare la Vercel este înlocuită de
  Cloudflare Pages.
- Regula „fără CMS preemptiv” rămâne validă pentru alte zone, dar blog adminul
  este acum o cerință demonstrată.
- Nu se introduce o bază de date custom pentru V1.
- Adminul Tina necesită configurarea unui proiect TinaCloud și a variabilelor
  `NEXT_PUBLIC_TINA_CLIENT_ID` și `TINA_TOKEN` în Cloudflare Pages.
- Visual editing-ul Astro din `@tinacms/astro` nu este introdus acum, deoarece
  pachetul curent nu declară compatibilitate cu Astro 7. Adminul de editare a
  articolelor este suficient pentru V1.

## Surse consultate

- Cloudflare Pages build configuration, accesat 2026-07-05:
  https://developers.cloudflare.com/pages/configuration/build-configuration/
- Cloudflare Pages limits, accesat 2026-07-05:
  https://developers.cloudflare.com/pages/platform/limits/
- TinaCMS Astro setup, accesat 2026-07-05:
  https://tina.io/docs/frameworks/astro
- TinaCMS Cloudflare Pages deployment, accesat 2026-07-05:
  https://tina.io/docs/tinacloud/deployment-options/cloudflare-pages
