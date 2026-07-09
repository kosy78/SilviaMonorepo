---
title: Fundația SEO și blocarea indexării înainte de lansare
date: 2026-07-02
status: approved
area: website
updated_by:
  - 2026-07-07-domeniu-canonic-despresine-ro
---

# Fundația SEO și blocarea indexării înainte de lansare

## Context

Website-ul nu avea infrastructura de bază pentru motoarele de căutare: lipseau
`site` din configurația Astro, URL-urile canonice, metadatele Open Graph,
sitemap-ul, `robots.txt`, favicon-ul și o pagină 404. În același timp,
conținutul public este încă draft, iar domeniul final nu este decis.

## Decizie

- Se adaugă fundația SEO completă: URL-uri canonice, metadate Open Graph și
  Twitter, sitemap generat prin `@astrojs/sitemap`, `robots.txt`, favicon
  tipografic simplu și o pagină 404 în tonul website-ului.
- Configurația folosește domeniul substituent `https://silvia-dinu.example`
  până la decizia privind domeniul final.
- `robots.txt` blochează indexarea (`Disallow: /`) până când domeniul final
  este stabilit și conținutul este verificat de Silvia. Blocarea protejează
  împotriva indexării unor afirmații profesionale neaprobate.
- Se adaugă un workflow GitHub Actions care rulează verificările de tip,
  formatarea, build-ul de producție și testele Playwright la fiecare push și
  pull request.

## Consecințe

- Checklist-ul de lansare este menținut în `operations/domain-and-launch.md`;
  schimbarea domeniului substituent și deblocarea indexării fac parte din
  lansare.
- `og:image` și datele structurate rămân în afara acestei etape: prima
  necesită materiale vizuale aprobate, a doua formulări verificate ale
  titlurilor profesionale.
- Testele de fum acoperă acum și pagina 404.

## Actualizare 2026-07-07

Domeniul canonic a fost decis ca `https://despresine.ro`; detaliile sunt în
[[2026-07-07-domeniu-canonic-despresine-ro]]. Decizia de blocare a indexării
rămâne activă pe durata pre-lansării. Copy-ul actual al paginilor de
confidențialitate și cookies este tratat de brief ca revizuit pentru baseline-ul
V1; orice schimbare privind operatorul, retenția, analytics, formularul,
vendorii sau afirmațiile legale/profesionale redeschide revizuirea înainte de
deblocarea indexării.
