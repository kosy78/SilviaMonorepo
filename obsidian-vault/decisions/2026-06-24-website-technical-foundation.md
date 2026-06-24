---
title: Fundația tehnică a website-ului
date: 2026-06-24
status: approved
area: website
---

# Fundația tehnică a website-ului

## Context

Website-ul este în principal editorial și orientat către conținut. În V1,
interactivitatea semnificativă va fi limitată la reflecția ghidată și formularul
de contact. Designurile de pagină vor fi realizate ulterior în Figma.

## Decizie

Fundația tehnică V1 folosește:

- Astro și TypeScript în mod strict;
- React numai pentru componente interactive izolate;
- Tailwind CSS și variabile CSS pentru tokenurile de design;
- Astro Content Collections și MDX pentru articole;
- Astro Actions pentru viitoarea procesare serverless a formularului;
- Vercel pentru găzduire;
- pnpm pentru administrarea dependențelor;
- Playwright pentru verificări în browser.

Componentele statice și structura paginilor vor rămâne componente Astro. React
nu va fi încărcat pentru conținutul editorial care nu are nevoie de stare în
browser.

## Motivație

Astro livrează implicit HTML static și permite încărcarea JavaScript-ului numai
pentru insulele interactive. Această arhitectură corespunde obiectivelor de
performanță, accesibilitate și confidențialitate ale proiectului, fără a limita
implementarea ulterioară a reflecției ghidate.

## Consecințe

- Nu se introduce un CMS, o bază de date sau o bibliotecă mare de componente.
- Conținutul blogului rămâne în repository.
- Tokenurile din Figma vor fi mapate în variabilele CSS și tema Tailwind.
- Serviciul de livrare a mesajelor de contact va necesita o decizie separată,
  inclusiv o evaluare a implicațiilor de confidențialitate.
- Analytics nu este inclus în fundația inițială.

## Alternative analizate

Next.js App Router rămâne o alternativă validă dacă produsul dezvoltă
autentificare, programări, personalizare semnificativă sau funcționalități
server-side extinse. Pentru cerințele V1, suprafața suplimentară a framework-ului
nu este justificată.
