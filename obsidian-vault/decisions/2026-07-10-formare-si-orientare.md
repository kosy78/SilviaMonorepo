---
title: Pagina Formare și orientare
date: 2026-07-10
status: approved
area: website
updates:
  - 2026-07-08-brand-despre-sine-si-reflectie-ghidata
tags:
  - decizie
  - website
  - continut
  - navigatie
---

# Pagina Formare și orientare

## Context

Eticheta `Despre Silvia` punea accentul pe persoană, deși pagina conține în
principal informații profesionale: titluri, experiență, formare, orientare și
repere despre felul de lucru. Denumirea nu descria suficient de precis rolul
paginii în parcursul vizitatorului.

## Opțiuni analizate

1. **Formare și orientare**
   - descrie direct conținutul paginii;
   - păstrează un ton profesional și discret;
   - este deja folosită ca etichetă de acces din homepage.

2. **Practica profesională**
   - păstrează registrul profesional;
   - este mai generală și poate sugera un conținut mai amplu decât cel publicat
     în V1.

## Decizie

- Navigația și titlul paginii folosesc `Formare și orientare`.
- Ruta tehnică rămâne `/despre-silvia/`, pentru a păstra stabilitatea linkurilor
  și a testelor existente.
- Pagina prezintă mai întâi informațiile profesionale deja disponibile, apoi
  explică felul de lucru într-un limbaj clar și orientat spre vizitator.
- Acțiunea principală folosește formularea `Întrebați despre disponibilitate`,
  în acord cu parcursul de contact al homepage-ului.

## Consecințe

- `Silvia Dinu` rămâne reperul uman și profesional al paginii, fără a fi
  subiectul denumirii din navigație.
- Pagina nu adaugă titluri, formări, acreditări sau promisiuni noi.
- Titlurile profesionale, experiența și formarea rămân supuse verificării
  Silviei înainte de publicare, conform regulilor generale ale proiectului.
- Orice schimbare viitoare a rutei trebuie tratată separat, împreună cu
  redirecturi, linkuri interne, canonical și teste.

## Surse

- Decizie editorială aprobată de utilizator, 2026-07-10.
- [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand DespreSine și
    Reflecție ghidată]].
- Implementare canonică: `website/src/pages/despre-silvia.astro` și
  `website/src/components/layout/SiteHeader.astro`.
