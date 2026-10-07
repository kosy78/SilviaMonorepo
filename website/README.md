# Website DespreSine

Fundația tehnică a website-ului este construită cu Astro, TypeScript, Tailwind
CSS și React pentru insule interactive izolate.

## Comenzi

Rulați comenzile din directorul `website/`, cu versiunea Node cerută în
`package.json` și versiunea pnpm declarată în `packageManager`.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test:blog
pnpm test:e2e
pnpm build
```

`pnpm dev` și `pnpm build` folosesc direct Astro, fără server CMS sau acces
TinaCloud. `pnpm build:production` folosește același build.

`pnpm test:e2e` construiește site-ul din nou și rulează testele pentru Functions
și Playwright. După un build reușit al aceluiași checkout, fără modificări
ulterioare, `pnpm test:e2e:prebuilt` rulează suitele fără încă un build.
`pnpm test:blog` verifică separat un articol publicat și o ciornă, într-un build
temporar; nu publică exemple și nu înlocuiește `dist/` cu conținut de test.

## Structură

- `src/components/ui/` — primitive reutilizabile;
- `src/components/layout/` — antet, subsol și structură de pagină;
- `src/components/sections/` — secțiuni editoriale reutilizabile;
- `src/components/islands/` — componente React interactive izolate, inclusiv
  Reflecția ghidată;
- `src/content/blog/` — articole Markdown;
- `src/pages/` — rute publice;
- `src/styles/` — tokenuri și stiluri globale.

## Scrierea și publicarea articolelor

Articolele se redactează prin Codex sau direct în repository, în
`src/content/blog/`. Nu există o interfață de administrare în browser.
Procedura de mai jos înlocuiește fluxul TinaCMS din 2026-07-05, conform
[deciziei din 2026-09-24](../obsidian-vault/decisions/2026-09-24-simplificare-blog-si-build.md).

### 1. Redactare

Copiați `src/content/blog/draft-template.md` într-un fișier cu nume stabil,
fără spații, de exemplu `titlu-articol.md`. Înlocuiți metadatele și textul, dar
păstrați `draft: true` cât timp articolul nu este aprobat:

```yaml
---
title: Titlul articolului
description: Descrierea scurtă a articolului
publishedAt: 2026-09-24T00:00:00.000Z
draft: true
author: Silvia Dinu
---
```

`title`, `description`, `publishedAt` și `author` sunt obligatorii. Autorul
acceptat este `Silvia Dinu`; nu atribuiți altcuiva un text fără actualizarea
explicită a modelului editorial. `draft` are implicit valoarea `true`, dar
scrieți-o explicit. `updatedAt` este opțional și folosește același format de
dată ca `publishedAt`.

Fișierul `titlu-articol.md` produce ruta `/blog/titlu-articol/` când este
publicat. Păstrați numele și directorul unui articol existent, precum și data
inițială `publishedAt`; folosiți `updatedAt` pentru o revizie ulterioară.
`publishedAt` este o dată editorială, nu un mecanism de programare: un articol
cu dată viitoare și `draft: false` este inclus în următorul build.

Folosiți Markdown obișnuit pentru subtitluri, liste, accentuări și linkuri,
fără componente React sau sintaxă MDX. Titlul principal vine din metadate;
începeți subtitlurile corpului cu `##`.

Pentru media, păstrați originalele aprobate în `brand-assets/`, iar exportul
optimizat pentru web în `public/images/`. O imagine
`public/images/nume-imagine.webp` se inserează astfel:

```md
![Descriere relevantă a imaginii](/images/nume-imagine.webp)
```

Folosiți doar imagini cu drepturi confirmate, fără persoane sau date private
identificabile. Linkurile interne pot folosi rute precum `/contact/`.

### 2. Previzualizare locală

Ciornele sunt excluse din listă, sitemap și rutele de articol în toate
buildurile de producție. Pentru a vedea o ciornă înaintea aprobării, păstrați
`draft: true`, adăugați `localPreview: true` în metadatele ei și porniți
`pnpm dev`. Articolul apare în blog și la ruta sa numai pe serverul de
dezvoltare, cu eticheta „Previzualizare · Ciornă” și `noindex`.

Verificați desktopul, mobilul, diacriticele, linkurile și imaginile.
`localPreview` este implicit `false`; eliminați-l când nu mai aveți nevoie
de previzualizare. `pnpm build` și `pnpm preview` exclud ciornele indiferent
de această opțiune. Nu setați `draft: false` pentru a obține un preview.

### 3. Revizuire

Verificați forma finală cu Silvia: corectitudinea profesională și factuală,
sursele, titlul și descrierea, adresarea cu `dumneavoastră`, diacriticele și
absența promisiunilor de rezultat, diagnosticării sau datelor personale.
Păstrați starea de ciornă până când publicarea este autorizată. O verificare
tehnică reușită nu echivalează cu aprobarea editorială sau profesională.

### 4. Publicare și confirmare

După aprobare, setați `draft: false`, confirmați data publicării și rulați
`pnpm check` și `pnpm test:e2e`. Inspectați articolul construit cu
`pnpm preview`. Commitul și push-ul pe `main` declanșează Cloudflare Pages.

Așteptați deploymentul asociat commitului și verificați articolul la URL-ul
său, linkul din `/blog/` și prezența în sitemap. Confirmați că ciornele rămân
inaccesibile. Cât timp protecția de prelansare este activă, verificarea paginii
necesită sesiunea autorizată; nu eliminați parola pentru a publica un articol.

Variabilele TinaCloud nu sunt necesare pentru build. Retragerea conexiunii și a
configurației vechi de cont este urmărită separat în
[procedura operațională](../operations/hosting-and-cms.md).

## Cloudflare

Cloudflare Pages construiește branch-ul `main` din `website/`, cu
`pnpm build` și output `dist/`. Setările proiectului din Cloudflare Dashboard
rămân configurația operațională pentru Git builds; nu este necesar TinaCloud.
Procedura pentru cache, declanșarea build-urilor, verificare și rollback este în
[hosting-and-cms.md](../operations/hosting-and-cms.md).

Comenzi utile:

```sh
pnpm cf:whoami
pnpm deploy:cloudflare
pnpm deploy:contact-mailer
```

Deploy-ul canonical pentru producție trebuie configurat în Cloudflare Pages prin
conectarea repository-ului GitHub, nu prin încărcări manuale repetate.

Domeniul public canonic este `https://despresine.ro`. `www.despresine.ro` poate
fi folosit ca alias sau redirect, dar metadata, sitemap-ul și linkurile publice
trebuie să folosească domeniul apex.

### Formularul de contact

Formularul trimite `POST /api/contact` către Pages Function-ul protejat de
aceeași autentificare Basic Auth ca restul site-ului. Function-ul validează
requestul și apelează Workerul intern `despresine-contact-mailer` prin bindingul
`CONTACT_MAILER`. Workerul are numai bindingul Cloudflare Email Service necesar
pentru livrarea către destinația verificată și nu are rută publică
`workers.dev`.

Configurația-sursă a Workerului este în
`workers/wrangler.contact-mailer.jsonc`. Bindingul `CONTACT_MAILER` trebuie să
existe în configurațiile Pages Production și Preview. Nu adăugați în Git
adrese de test, submissions, parole sau alte valori secrete.

Verificați rezoluția DNS și atașarea domeniilor custom în Pages la fiecare
validare de deployment. Un build reușit sau răspunsul fallback-ului Pages nu
confirmă singur că versiunea este disponibilă pe domeniul canonic.

## Starea conținutului

Textele incluse în scaffold sunt drafturi de lucru. Titlurile profesionale,
formulările despre experiență și orice afirmație profesională sau juridică
trebuie verificate cu Silvia înainte de publicare.

## Figma

Designurile aprobate vor fi implementate prin maparea variabilelor Figma în
`src/styles/tokens.css`, apoi prin ajustarea componentelor reutilizabile. Nu
adăugați valori vizuale izolate într-o pagină dacă ele reprezintă un token sau
un pattern comun.

## Date și servicii externe

Website-ul poate încărca Google Analytics 4 folosind streamul public V1
`G-D490J31F6H`. Variabila publică `PUBLIC_GA_MEASUREMENT_ID` poate suprascrie
această valoare la build time, dacă streamul GA4 se schimbă.

Implementarea GA4 este condiționată de consimțământ explicit:

- setările de consimțământ pornesc cu `analytics_storage` refuzat;
- scriptul Google Analytics este injectat numai după apăsarea butonului
  `Accept analytics`;
- semnalele de advertising și personalizare sunt dezactivate în configurația
  tagului;
- URL-urile trimise către GA4 sunt curățate de query string și fragment;
- evenimentul custom permis în V1 este `contact_email_clicked`, fără emailul
  vizitatorului, mesaj, nume sau context clinic.

Configurația operațională și implicațiile de confidențialitate sunt documentate
în `operations/analytics-and-consent.md`. Orice extindere cu pixeli de
advertising, formulare urmărite, remarketing sau evenimente legate de reflecția
ghidată necesită o decizie separată și revizuire explicită.

Pagina Contact folosește `PUBLIC_GOOGLE_MAPS_API_KEY` pentru harta Google Maps
JavaScript stilizată pe baza modelului CC0 „Flat Pale” din Snazzy Maps. Cheia
este vizibilă în browser prin natura API-ului și trebuie restricționată la
originile aprobate și la Maps JavaScript API; valoarea reală nu se comite în
Git. Dacă variabila lipsește, pagina păstrează iframe-ul Google Maps ca fallback.
