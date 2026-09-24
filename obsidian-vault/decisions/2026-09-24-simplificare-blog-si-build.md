---
title: Simplificarea blogului și a build-ului
date: 2026-09-24
status: approved
area: website
supersedes:
  - 2026-07-05-cloudflare-pages-si-tinacms
  - 2026-06-24-website-technical-foundation
supersession_scope: blog-authoring-format-and-build-only
---

# Simplificarea blogului și a build-ului

## Context

TinaCMS adaugă un admin și un pas de generare înaintea build-ului Astro, deși
articolele sunt deja păstrate în repository. Cosmin a confirmat că publicarea
prin Codex sau fișiere Git este suficientă și a aprobat etapele 1 și 2 ale
planului auditat: eliminarea CMS-ului și îmbunătățirea build-ului/verificărilor.
Etapa 3, curățarea opțională a shadcn și a activelor, este exclusă explicit.

## Opțiuni analizate

- Păstrarea TinaCMS și optimizarea doar a cache-ului: menține adminul și
  dependența de serviciul extern, care nu mai sunt necesare fluxului ales.
- Eliminarea TinaCMS și păstrarea MDX: reduce costul adminului, dar păstrează o
  integrare nefolosită de conținutul existent.
- Markdown simplu în Astro Content Collections: păstrează conținutul în Git și
  elimină pașii de build nejustificați de fluxul curent.

## Decizie

Blogul folosește fișiere `.md` în `website/src/content/blog/`, redactate prin
Codex sau direct în repository. Eliminăm TinaCMS, generarea adminului,
integrarea MDX și cerința de variabile TinaCloud pentru build.

Păstrăm schema editorială, datele și rutele existente. `draft` rămâne implicit
`true`; publicarea se face numai după revizuire și aprobare, prin
`draft: false`, commit și deployment. Data `publishedAt` nu programează
publicarea. Nu introducem un admin alternativ, backend sau bază de date.

Astro rămâne fundația website-ului. Cloudflare Pages continuă să construiască
branch-ul `main` din `website/`, cu output `dist/`. Îmbunătățirile permise
includ cache-ul Pages și Astro din CI, anularea verificărilor depășite,
filtrarea atentă a schimbărilor relevante și paralelizarea testelor numai după
măsurare. Filtrele trebuie să includă articolele Markdown și toate intrările de
build, fără blocarea verificărilor obligatorii ale pull request-urilor.

Comanda de testare uzuală păstrează un build proaspăt; o variantă explicită
pentru output deja construit este permisă. Verificarea blogului trebuie să
exercite un articol publicat, listarea, metadata, sitemap-ul și excluderea unei
ciorne, folosind conținut temporar separat de artefactul de producție.

## Domeniul înlocuirii

Această decizie înlocuiește numai administrarea TinaCMS din
[[2026-07-05-cloudflare-pages-si-tinacms|Cloudflare Pages și TinaCMS]] și alegerea
MDX pentru blog din
[[2026-06-24-website-technical-foundation|Fundația tehnică inițială]]. Hostingul
Pages, Astro, insulele React, testarea și regulile de confidențialitate rămân.
Înregistrările anterioare se păstrează ca istoric.

Nu schimbăm shadcn, componentele vizuale, activele, designul, copy-ul public,
protecția de prelansare sau serviciul de email. Workerul redundant
`silvia-dinu-website` a fost identificat separat de Pages: nu avea domenii/rute
sau triggere runtime active, iar build-ul Git din rădăcina repository-ului eșua
înainte de deploy. La 2026-09-24 a fost deconectat numai repository-ul Git al
acestui Worker, cu persistența verificată în Dashboard. Resursa Workers este
păstrată, iar Pages și `despresine-contact-mailer` rămân în uz.

## Consecințe și verificare

Fluxul editorial pierde adminul din browser, dar păstrează istoricul Git și
review-ul explicit. Instrucțiunile canonice sunt în
[website/README.md](../../website/README.md); starea configurației externe și
procedura de rollback sunt în
[operations/hosting-and-cms.md](../../operations/hosting-and-cms.md).

Ciornele și modificările editoriale relevante trebuie confirmate înainte de
retragerea conexiunii TinaCloud. Eliminarea CMS-ului din cod, eliminarea lui din
artefactul publicat și retragerea configurației din cont sunt verificări
distincte. Păstrăm un deployment anterior reușit pentru revenire.

Măsurăm separat timpul build-ului rece/cu cache, timpul de la push la
publicarea Pages și timpul până la încheierea CI. Reducerea dependențelor nu
este, singură, o măsură a vitezei de publicare. Starea `approved` a acestei
note consemnează decizia utilizatorului, nu confirmă un deployment finalizat.

Verificările locale din 2026-09-24 au măsurat 8,84 s pentru build-ul complet
fără cache de imagini și 1,53 s cu cache; instalarea în checkout curat a durat
3,4 s folosind store-ul pnpm existent, iar testul izolat al blogului 1,59 s.
Verificarea codului a raportat 0 erori. Detaliile și limitele măsurătorilor sunt
în procedura operațională, fără comparații directe cu viteza CI sau Pages.

Suita completă pe output deja construit a durat local 120,31 s cu un worker și
60,73 s cu doi. Ambele rulări au trecut aceleași 196 de teste Playwright, cu
14 omisiuni intenționate pentru viewport, fără eșecuri sau reluări; Functions a
trecut în ambele cazuri. Pe baza acestei măsurători, CI folosește 2 workers;
verificarea efectivă pe runnerul remote rămâne de făcut după push.

Verificarea GitHub API a celor 9 branch-uri remote a găsit numai același șablon
de articol și niciun `public/uploads/`; nu au fost identificate alte ciorne sau
media salvate în repository. Textele nesalvate în browser nu sunt acoperite de
această verificare. Resturile generate de Tina din checkout-uri vechi se curăță
o singură dată; regulile `.gitignore` se păstrează pentru a preveni adăugarea lor
accidentală în Git.

## Sursă

Instrucțiunile și aprobarea lui Cosmin din conversația de implementare din
2026-09-24: publicare prin Codex/repository; implementarea etapelor 1 și 2;
excluderea etapei 3.
