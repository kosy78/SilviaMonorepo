---
title: Lansare publică, SEO și descoperire în căutarea AI
date: 2026-10-08
status: published
area: website
---

# Lansare publică, SEO și descoperire în căutarea AI

Utilizatorul a cerut explicit eliminarea parolei și lansarea site-ului, cu
sitemap, indexare în motoare de căutare și acces pentru ChatGPT Search.
La 2026-10-09, utilizatorul a confirmat aprobarea Silviei pentru versiunea
finală și a autorizat continuarea: „Yes, Silvia has approved! go”.
Implementarea este publicată și verificată local, în CI și pe domeniul canonic.
Lansarea s-a făcut prin PR #23 la 2026-10-09, iar PR #24 a corectat ruta
fișierului de verificare Google pentru comportamentul Cloudflare Pages.
Verificările de producție și
rezultatele Search Console/Bing sunt consemnate separat în documentul
operațional.

## Implementarea publicată

- Domeniul canonic `https://despresine.ro` devine public fără credentiale.
  Preview-urile rămân protejate; `www` și fallback-ul stabil Pages
  redirecționează către domeniul canonic.
- Paginile publice devin accesibile crawlerilor în `robots.txt`.
  `OAI-SearchBot` este permis explicit pentru ChatGPT Search; `GPTBot` este
  blocat separat deoarece cererea privește descoperirea prin căutare.
- Sitemap-ul existent rămâne generat din build și exclude suprafețele interne,
  rezultatul reflecției, ciornele și redirectul vechi.
- Metadata și JSON-LD descriu site-ul, Silvia Dinu și articolul folosind
  informații existente. Nu se adaugă adresă exactă, titluri profesionale,
  afilieri, evaluări sau promisiuni de rezultate.
- Autorul articolului devine vizibil și trimite către `/competente/`.
- Formularul include avertismentul privind datele sensibile și un link la
  politica de confidențialitate. Nu se schimbă colectarea sau destinația datelor.

Aceste alegeri pregătesc eligibilitatea tehnică pentru căutare. Nu constituie
o promisiune de indexare, poziție, recomandare sau citare în răspunsuri AI.
Nu se introduce `llms.txt`: principalele pagini sunt deja HTML static și
semantic, iar Google nu cere fișiere sau markup special pentru funcțiile AI.

## Verificare și operare

Rezultatele locale și pașii de release/submission se consemnează în
[[../../operations/domain-and-launch]]. După publicare se verifică domeniul
canonic fără autentificare, metadatele, robots, sitemap, redirecturile,
preview-urile protejate și răspunsurile pentru agenți de căutare. Un răspuns
obținut prin imitarea unui user-agent nu dovedește singur accesul din rețeaua
reală a acelui crawler.

La 2026-10-09, proprietatea URL-prefix Search Console este verificată și
sitemap-ul a fost trimis; proprietatea de domeniu rămâne neverificată.
Google a acceptat cererea de indexare a homepage-ului. Citirea sitemap-ului
nu este încă confirmată: raportul inițial afișează `Couldn't fetch`.
Testul live Google confirmă însă că sitemap-ul este accesibil și că preluarea
reușește; cauza erorii inițiale nu este confirmată.
Bing este verificat, sitemap-ul este în `Success` și toate cele nouă URL-uri
publice au fost trimise. Politicile Cloudflare permit crawlerii de căutare și
agenții AI, iar antrenarea AI rămâne blocată. Nu au fost schimbate aceste
politici. Nu se raportează „indexat” fără dovezi dintr-un motor de căutare
sau din raportul proprietății.

## Surse primare, consultate la 2026-10-08 și 2026-10-09

- [OpenAI: crawleri și agenți](https://developers.openai.com/api/docs/bots):
  `OAI-SearchBot` gestionează descoperirea în Search, separat de `GPTBot`.
  OpenAI recomandă acces pentru intervalele IP publicate; schimbările robots
  pot necesita aproximativ 24 de ore pentru propagare.
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features):
  aceleași cerințe SEO de bază, fără schemă sau fișiere AI speciale și fără
  garanție de indexare.
- [Google: Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article):
  autor identificabil prin nume și URL, titlu, imagine reprezentativă și
  date de publicare/revizuire reale.
- [Google: Sitemaps report](https://support.google.com/webmasters/answer/7451001),
  consultat la 2026-10-09: testarea live din URL Inspection confirmă accesul
  Google; la erori de preluare Google reîncearcă pentru câteva zile.
