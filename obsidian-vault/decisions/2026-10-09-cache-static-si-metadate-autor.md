---
title: Cache pentru asseturi versionate și metadata autorului
date: 2026-10-09
status: approved
area: website
---

# Cache pentru asseturi versionate și metadata autorului

Utilizatorul a cerut reîncercarea sitemap-ului Google și implementarea
optimizărilor utile după lansarea publică. Copy-ul și designul aprobate rămân
aceleași.

## Schimbări

- Asseturile Astro cu hash în nume primeau live `max-age=0, must-revalidate`,
  ceea ce obliga browserul să le revalideze. Pages Functions aplică un an de
  cache cu `immutable` numai pe domeniul public, pentru GET/HEAD și răspunsuri
  200/304 ale acestor asseturi. Hash-ul se schimbă odată cu fișierul.
  Preview-urile, documentele HTML, sitemap-urile, robots, API-ul, fișierele fără
  hash și erorile nu primesc această regulă.
- `article:author` din Open Graph primește URL-ul existent al profilului,
  `https://despresine.ro/competente/`, în locul numelui ca valoare. Autorul
  vizibil și JSON-LD rămân aceleași.
- Nu se introduc dependențe, analytics, cookies, conținut nou, titluri
  profesionale sau markup AI suplimentar.

## Google sitemap

Indexul a fost retrimis și sitemap-ul direct a fost trimis separat. Google
confirmă ambele trimiteri. Testul live pentru XML-ul direct reușește și sursa
Google conține cele nouă URL-uri. Raportul de procesare încă afișează
`Couldn't fetch`; nu se pretinde că sitemap-ul este procesat sau site-ul indexat.
Rezultatele și dovezile sunt în [[../../operations/domain-and-launch]].

Nu se adaugă date `lastmod` de la fiecare build sau date de modificare
deduse din publicarea originală. Acestea trebuie să reflecte schimbări reale,
documentate ale conținutului.

## Verificare

Testele Functions acoperă cache-ul public, păstrarea corpului/ETag, răspunsul
304, excluderile și protecția preview. Testele de publicare și SEO verifică URL-ul
autorului în HTML. Publicarea se verifică separat prin CI, deploymentul Pages și
headerele de pe domeniul canonic.

## Surse primare, consultate la 2026-10-09

- [Cloudflare Pages: headers](https://developers.cloudflare.com/pages/configuration/headers/):
  cache persistent pentru asseturi fingerprinted; headerele răspunsurilor
  Functions trebuie aplicate în cod.
- [Open Graph protocol](https://ogp.me/): `article:author` desemnează profilul
  autorului.
- [Google: Sitemaps report](https://support.google.com/webmasters/answer/7451001):
  verificarea preluării prin test live și reîncercările Google după erori.
- [Google: Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap):
  `lastmod` este util numai dacă este corect și reflectă modificări semnificative.
