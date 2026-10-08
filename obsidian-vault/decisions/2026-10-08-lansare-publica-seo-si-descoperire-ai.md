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
Implementarea este pregătită și verificată local și în CI. Publicarea
a fost finalizată prin PR #23 la 2026-10-09. Verificările de producție și
rezultatele Search Console/Bing sunt consemnate separat în documentul
operațional.

## Implementarea pregătită

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

Search Console este accesibil, iar proprietatea URL-prefix are fișierul Google
de verificare pregătit în `website/public/`; proprietatea de domeniu rămâne
neverificată. Verificarea și trimiterea sitemap-ului nu sunt încă finalizate.
Bing Webmaster Tools și filtrele de
crawleri Cloudflare rămân de verificat. Nu se raportează „indexat” fără
dovezi dintr-un motor de căutare sau din raportul proprietății.

## Surse primare, consultate la 2026-10-08

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
