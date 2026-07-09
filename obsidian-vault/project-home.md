---
title: Acasă — proiect DespreSine
date: 2026-07-09
updated: 2026-07-09
status: in-review
phase: pre-launch
owner: de-confirmat
tags:
  - proiect
  - dashboard
  - pre-lansare
---

# Acasă — proiect DespreSine

> [!important] Faza curentă
> Proiectul este în **pre-lansare**. Website-ul rămâne protejat cu parolă, iar
> indexarea rămâne blocată până la închiderea porților de lansare de mai jos.
> Credentialele de acces nu se salvează în repository.

Acest dashboard indică starea curentă și trimite către sursa canonică; nu
dublează textele publice sau procedurile operaționale.

## Surse canonice

| Arie                                | Sursă canonică                                                                                           | Stare curentă                                                 | Responsabil / revizuire                                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Reguli de produs, siguranță și voce | `AGENTS.md`                                                                                              | baseline V1 aprobat                                           | modificări: de confirmat cu Silvia                                                                             |
| Implementarea publică               | `website/`                                                                                               | în revizie înainte de lansare                                 | responsabil tehnic: de confirmat; aprobare publicare: Silvia, de confirmat                                     |
| Copy legal public curent            | `website/src/pages/politica-de-confidentialitate.astro` și `website/src/pages/politica-de-cookies.astro` | tratat de brief ca revizuit pentru baseline-ul V1 curent      | autoritatea/revizorul extern nu sunt consemnate; re-revizuire obligatorie la schimbarea domeniului de aplicare |
| Decizii materiale                   | [[decisions/README\|Registrul deciziilor]]                                                               | activ                                                         | responsabil de actualizare: de confirmat                                                                       |
| Hosting, domeniu și lansare         | `operations/hosting-and-cms.md` și `operations/domain-and-launch.md`                                     | în lucru                                                      | responsabil operațional: de confirmat                                                                          |
| Formular de contact                 | `operations/contact-form.md`                                                                             | implementat local; destinația Cloudflare așteaptă verificarea | responsabil tehnic și revizor privacy: de confirmat                                                            |
| Analytics și consimțământ           | `operations/analytics-and-consent.md`                                                                    | implementat tehnic; verificări operaționale rămase            | owner cont și revizor setări: de confirmat                                                                     |
| Strategie, cercetare și drafturi    | `obsidian-vault/`                                                                                        | mixt; starea este notată pe fiecare document                  | autor/revizor: conform notei sau de confirmat                                                                  |
| Campanii executabile                | `campaigns/`                                                                                             | separat de drafturile din vault                               | aprobare înainte de publicare: de confirmat                                                                    |
| Active vizuale aprobate             | `brand-assets/`                                                                                          | sursa canonică pentru exporturi aprobate                      | owner și aprobare: de confirmat                                                                                |

> [!note] Domeniul revizuirii legale V1
> Brief-ul din `AGENTS.md` tratează copy-ul actual al paginilor de
> confidențialitate și cookies ca revizuit pentru publicarea V1 în forma
> curentă. Această stare internă nu dovedește și nu afirmă o validare juridică
> externă. Identitatea operatorului, retenția, analytics, formularul,
> comportamentul vendorilor și orice afirmație legală sau profesională redeschid
> revizuirea înainte de publicarea modificării.

## Porți de lansare

### Protecție și infrastructură

- [x] Domeniul canonic `https://despresine.ro` este activ în Cloudflare Pages.
- [x] Apexul, `www` și fallback-ul Pages răspund cu `401` fără credentiale.
- [x] `robots.txt` blochează indexarea.
- [ ] Configurați redirectul final `www.despresine.ro` către apex.
- [ ] Finalizați configurarea și verificarea TinaCloud pe domeniile finale.
- [ ] Păstrați protecția cu parolă până când toate porțile de mai jos sunt
      închise.

### Conținut, produs și confidențialitate

- [ ] Silvia confirmă formulările publice despre titluri profesionale,
      experiență, formare și servicii.
- [ ] Explicația publică pentru adolescenții de 16–17 ani este verificată
      profesional și juridic înainte de publicare.
- [ ] Formularul minimal de contact este finalizat, testat și documentat conform
      `operations/contact-form.md`.
- [ ] După stabilizarea formularului, copy-ul de confidențialitate și cookies
      este re-revizuit pentru fluxul real, vendor, logging și retenție.
- [ ] Copy-ul și rezultatele Reflecției ghidate trec din `in-review` în
      `approved`, fără limbaj de diagnostic sau scor clinic.
- [ ] Blogul are articole aprobate pentru lansare sau intrarea sa este scoasă
      temporar din navigația principală.
- [ ] Fotografia profesională, dacă este folosită, are aprobare și drepturi de
      utilizare consemnate.

### Verificare finală

- [ ] Verificați fluxurile de contact, consimțământ analytics, retragerea
      consimțământului și absența trackingului înainte de acceptare.
- [ ] Verificați accesibilitatea, responsive designul, performanța, metadatele,
      URL-urile canonice, sitemap-ul și pagina 404 pe deploymentul protejat.
- [ ] Confirmați toate căile analytics active, inclusiv orice Cloudflare Web
      Analytics reactivat ulterior. Pentru V1, Cloudflare Web Analytics este
      dezactivat și numai GA4 condiționat de consimțământ rămâne activ.
- [ ] Decideți și consemnați cine autorizează eliminarea parolei și deblocarea
      indexării.
- [ ] Eliminați parola numai după aprobarea explicită a lansării; deblocați
      indexarea ca pas separat și verificabil.

## Legături rapide

- [[decisions/README|Registrul deciziilor]]
- [[decisions/2026-07-08-footer-legal-si-anpc-sal|Footer legal și ANPC SAL]]
- [[decisions/2026-07-08-reflectie-ghidata-rezultate-locale-si-grafic-radar|Rezultatele Reflecției ghidate]]
- [[decisions/2026-07-09-formular-contact-cloudflare-email|Formularul minimal de contact]]
- [[decisions/2026-07-09-dezactivare-cloudflare-web-analytics|Cloudflare Web Analytics dezactivat]]
- `operations/domain-and-launch.md`
- `operations/hosting-and-cms.md`
- `operations/analytics-and-consent.md`
- `operations/contact-form.md`
