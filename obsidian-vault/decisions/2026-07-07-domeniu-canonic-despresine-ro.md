---
title: Domeniu canonic despresine.ro
date: 2026-07-07
status: approved
area: website
updates:
  - 2026-07-02-fundatia-seo-si-indexare
---

# Domeniu canonic despresine.ro

## Context

Fundația SEO folosea domeniul substituent `https://silvia-dinu.example` până la
alegerea domeniului final. Website-ul este deja public pe Cloudflare Pages la
`https://silvia-dinu-website.pages.dev`, iar proiectul are TinaCMS/TinaCloud
pentru administrarea blogului.

## Decizie

- Domeniul public canonic pentru V1 este `https://despresine.ro`.
- `www.despresine.ro` poate fi folosit ca alias sau redirect, dar nu ca domeniu
  canonic în metadata, sitemap sau materiale publice.
- `website/astro.config.mjs` și `website/public/robots.txt` folosesc
  `https://despresine.ro`.
- `robots.txt` rămâne blocat (`Disallow: /`) până când conținutul public,
  titlurile profesionale și textele de confidențialitate sunt aprobate.
- `despresine.ro` și `www.despresine.ro` au fost adăugate în Cloudflare Pages
  pentru proiectul `silvia-dinu-website`.

## Consecințe

- Linkurile publice, social media bios, materialele de campanie și documentația
  operațională trebuie să folosească `https://despresine.ro`.
- `https://silvia-dinu-website.pages.dev` rămâne doar fallback operațional până
  când DNS-ul final este activ.
- Activarea apexului `despresine.ro` necesită adăugarea domeniului ca zonă DNS
  Cloudflare în același cont cu proiectul Pages și configurarea nameserverelor
  la registrar.
- Domeniile sunt încă `pending` în Cloudflare Pages deoarece verificarea
  raportează `CNAME record not set`.
- TinaCloud trebuie să permită `https://despresine.ro` și
  `https://www.despresine.ro` în Site URLs înainte de testarea workflow-ului de
  admin pe domeniul final.
- Deblocarea indexării, trimiterea sitemap-ului în Search Console și lansarea
  campaniilor publice rămân condiționate de aprobările editoriale, profesionale
  și de confidențialitate.

## Surse consultate

- Cloudflare Pages custom domains, accesat 2026-07-07:
  https://developers.cloudflare.com/pages/configuration/custom-domains/
