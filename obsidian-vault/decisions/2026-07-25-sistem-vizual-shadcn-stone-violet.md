---
title: Sistem vizual shadcn Stone și Violet
date: 2026-07-25
status: approved
area: website
updates:
  - 2026-06-24-website-technical-foundation
  - 2026-07-08-brand-despre-sine-si-reflectie-ghidata
tags:
  - decizie
  - website
  - design-system
  - shadcn
---

# Sistem vizual shadcn Stone și Violet

## Context

Website-ul avea deja o direcție editorială alb-negru și componente shadcn
selective, dar nu avea o paletă cromatică standardizată într-un preset comun.
Presetul shadcn personalizat `b4vf0yLwvq` a fost ales explicit ca fundație a
sistemului vizual.

## Opțiuni analizate

1. **Păstrarea tokenurilor locale fără preset**
   - menține aspectul curent fără migrare;
   - nu oferă o bază reproductibilă pentru componentele viitoare.

2. **Importarea presetului și înlocuirea integrală a interfeței**
   - reproduce exemplele shadcn fără adaptare;
   - ar elimina variante editoriale necesare și ar putea mări JavaScript-ul
     paginilor statice.

3. **Importarea exactă a presetului ca fundație și adaptarea minimă pentru
   DespreSine**
   - păstrează valorile presetului și configurația reproductibilă;
   - permite variantele specifice hero/reflecție și țintele accesibile de
     44–48 px;
   - păstrează Astro static pentru suprafețele care nu au nevoie de hidratare.

## Decizie

- Presetul canonic este `b4vf0yLwvq`.
- Tema este `stone`, cu aceeași bază `stone` și scala de grafice `violet`.
- Fontul de corp este `Geist Variable`, iar titlurile folosesc
  `Playfair Display Variable`.
- Raza de bază este `0.625rem` (`medium`), stilul este `nova`, iar librăria de
  iconuri este `tabler`.
- Modul de navigație păstrează opțiunile presetului `default-translucent` și
  `subtle`, fără obligația de a înlocui navigația nativă existentă cu exemplul
  `navigation-menu-example`.
- Valorile light și dark importate rămân disponibile exact; V1 nu introduce
  încă un control public pentru tema dark.
- Aliasurile editoriale existente (`ink`, `paper`, `line`, `soft`) se rezolvă
  către rolurile semantice Stone, astfel încât paleta să fie folosită pe tot
  website-ul.
- Variantele locale hero/reflecție folosesc numai scala Violet importată.
- Componentele shadcn sunt cod sursă deținut de proiect și pot fi adaptate
  minim pentru accesibilitate, performanță și semantica Astro.

## Consecințe

- `website/components.json` este configurația reproductibilă pentru
  componentele shadcn viitoare.
- `website/src/styles/global.css` conține valorile exacte ale presetului, iar
  `website/src/styles/tokens.css` asigură aliasurile editoriale DespreSine.
- Componentele interactive păstrează ținte de minimum 44 px; acțiunile
  principale folosesc 48 px.
- Importarea unui exemplu din URL-ul shadcn nu este implicită: parametrul
  `item=navigation-menu-example` descrie doar previzualizarea.
- Orice schimbare viitoare de preset trebuie tratată ca o nouă decizie de
  sistem vizual și verificată pe desktop, mobil și în Reflecția ghidată.

## Surse

- Preset shadcn: https://ui.shadcn.com/create?preset=b4vf0yLwvq&item=navigation-menu-example
  (accesat 2026-07-25).
- Configurație decodată cu CLI-ul oficial shadcn, 2026-07-25.
- [[2026-06-24-website-technical-foundation|Fundația tehnică a website-ului]].
- [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand DespreSine și Reflecție ghidată]].
