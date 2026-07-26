---
title: Parcursul conținutului pe website
date: 2026-07-26
status: approved
area: website
updates:
  - 2026-07-08-brand-despre-sine-si-reflectie-ghidata
  - 2026-07-10-formare-si-orientare
tags:
  - decizie
  - website
  - continut
  - navigatie
  - ux
---

# Parcursul conținutului pe website

## Context

Un audit al ordinii secțiunilor a arătat că homepage-ul prezenta explicația
orientării psihodinamice înaintea unei orientări factuale despre servicii și
lăsa informațiile despre cabinet, online și primul contact după reflecția
ghidată, întrebările frecvente și o previzualizare de articole încă
nepublicate. Pagina Reflecție ghidată începea direct cu prima întrebare, fără o
etapă separată de informare și alegere.

## Opțiuni analizate

1. **Restructurarea parcursului în jurul încrederii**
   - adaugă orientarea factuală imediat după hero;
   - prezintă persoana și cadrul profesional înaintea explicației aprofundate a
     metodei;
   - mută informațiile practice înaintea parcursurilor opționale;
   - afișează articole pe homepage numai când există conținut publicat.

2. **Reordonarea minimă a secțiunilor existente**
   - implică mai puține schimbări;
   - păstrează lipsa unei orientări imediate despre servicii, public și format.

## Decizie

- Se aplică restructurarea în jurul încrederii.
- Hero-ul homepage-ului rămâne neschimbat.
- Ordinea homepage-ului este: orientare despre servicii, public și format;
  Silvia Dinu; explicația orientării psihodinamice; cadrul practic; Reflecție
  ghidată; întrebări frecvente; footer-ul cu traseul de contact.
- Modulul editorial de pe homepage nu este afișat cât timp nu există articole
  revizuite și publicate. Pagina Blog păstrează o stare goală explicită.
- Navigația ordonează `Psihoterapie și consiliere` înainte de `Formare și
orientare`, păstrând denumirea și ruta aprobate pentru pagina profesională.
- Cardul Silviei de pe homepage trimite direct la `/despre-silvia/`.
- Pagina Reflecție ghidată prezintă înaintea întrebărilor o etapă explicită
  despre caracterul local, anonim, opțional și non-diagnostic al parcursului.
- Pagina de servicii prezintă contextul profesional al Silviei înaintea
  explicației aprofundate a orientării.
- Paginile juridice și comportamentul formularului sau al analytics nu se
  schimbă prin această decizie.

## Consecințe

- Vizitatorul poate identifica serviciile, publicul și formatele înainte de a
  evalua metoda sau de a începe un parcurs interactiv.
- Ordinea din DOM trebuie să coincidă cu ordinea vizuală și cu navigarea prin
  tastatură; CSS nu simulează reordonarea.
- Copy-ul nou reutilizează exclusiv informații deja prezente în website și nu
  introduce titluri, servicii, rezultate sau afirmații profesionale noi.
- Orice articol promovat pe homepage trebuie să fie publicat și disponibil la
  linkul afișat.

## Surse

- Auditul local al website-ului și aprobarea utilizatorului pentru opțiunea A,
  2026-07-26.
- [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand DespreSine și
    Reflecție ghidată]].
- [[2026-07-10-formare-si-orientare|Pagina Formare și orientare]].
- Implementare canonică: `website/src/pages/` și
  `website/src/components/sections/`.
