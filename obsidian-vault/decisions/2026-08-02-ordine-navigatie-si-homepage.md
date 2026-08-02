---
title: Ordinea navigației și a secțiunilor homepage
date: 2026-08-02
status: approved
area: website
supersedes:
  - 2026-07-26-parcurs-continut-website
tags:
  - decizie
  - website
  - continut
  - navigatie
  - ux
---

# Ordinea navigației și a secțiunilor homepage

## Context

Ordinea publică a fost revizuită pentru ca reflecția ghidată să devină prima
opțiune după pagina principală, urmată de informațiile despre serviciu și de
competențele profesionale ale Silviei Dinu.

Această decizie înlocuiește ordinea aprobată în
[[2026-07-26-parcurs-continut-website|Parcursul conținutului pe website]].

## Decizie

- Navigația publică este: `Acasă`; `O primă explorare`; `Psihoterapia
psihanalitică`; `Competențe`; `Blog`; `Contact`.
- Ordinea homepage-ului este: hero; `Ce pare să ceară atenție acum?`;
  `Psihoterapie psihanalitică și consiliere`; `Competențe` / Silvia Dinu;
  Blog; Contact.
- Blocul de întrebări frecvente nu mai apare pe homepage.
- Blocul Blog poate prezenta teme marcate explicit `În pregătire`, fără a le
  prezenta drept articole publicate și fără linkuri către articole inexistente.
- Ordinea din DOM coincide cu ordinea vizuală și cu navigarea prin tastatură.
- Noua rută publică este `/competente/`; ruta anterioară
  `/despre-silvia/` redirecționează permanent către aceasta și păstrează
  query string-ul.

## Limite

- Decizia nu schimbă serviciile, titlurile profesionale, paginile juridice,
  formularul, analytics sau protecția de pre-lansare.
- Articolele individuale rămân ascunse cât timp au starea de ciornă.

## Sursă

- Ordinea indicată direct de utilizator în revizuirea homepage-ului din
  2026-08-02.
- Implementare canonică: `website/src/pages/index.astro` și
  `website/src/components/layout/SiteHeader.astro`.
