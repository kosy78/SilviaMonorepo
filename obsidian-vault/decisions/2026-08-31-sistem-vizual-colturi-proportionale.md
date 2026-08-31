---
title: Sistem vizual cu colțuri proporționale
date: 2026-08-31
status: approved
area: website
updates:
  - 2026-07-25-sistem-vizual-shadcn-stone-violet
  - 2026-08-09-sistem-vizual-linen-quiet-olive
tags:
  - decizie
  - website
  - design-system
  - radius
---

# Sistem vizual cu colțuri proporționale

## Context

Raza de bază de `0.625rem` păstra componentele ordonate, dar producea colțuri
prea ferme pentru direcția vizuală actuală. Actualizarea urmărește suprafețe mai
calme și mai tactile, fără a transforma cardurile mari în capsule.

## Opțiuni analizate

1. **Creșterea unei singure raze globale**
   - este schimbarea cea mai mică;
   - nu păstrează aceeași proporție între controalele de înălțimi diferite.

2. **Raze proporționale pentru controale și o scară separată pentru suprafețe**
   - păstrează un profil coerent de la butoane mici la acțiuni de 48 px;
   - permite cardurilor și secțiunilor să rămână rotunjite, dar nu capsulă.

## Decizie

- Pentru controalele cu înălțime fixă, scorul de rotunjire este `60%`:
  `(2 × rază) / latura scurtă = 0.60`, deci raza CSS este `30%` din înălțime.
- Sistemul expune raze pentru controale de `24`, `32`, `40`, `44` și `48` px.
- Raza de bază crește la `0.9rem`, iar scara semantică `sm`–`4xl` derivă din
  aceasta pentru carduri, panouri și secțiuni.
- Capsulele, indicatorii circulari și suprafețele intenționat fără rază rămân
  excepții explicite.
- Pentru contururi rotunjite imbricate, raza interioară este raza exterioară
  minus insetul vizibil dintre cele două contururi.

Regula de 60% este o convenție internă inspirată de analiza proporțiilor
produselor Apple, nu o specificație publică Apple.

## Consecințe

- `website/src/styles/tokens.css` este sursa canonică pentru razele
  controalelor.
- `website/src/styles/global.css` păstrează raza de bază și scara Tailwind.
- Componentele cu înălțime fixă folosesc tokenul corespunzător, iar valorile
  locale rămân numai pentru capsule, cercuri sau excepții intenționate.
- `/design-system/` documentează regula și afișează tokenurile direct din
  sursele canonice.
- Schimbarea trebuie verificată vizual pe desktop și mobil, inclusiv pe carduri
  mari și pe controalele formularului.

## Surse

- Arun Venkatesan, „The secret formula for Apple's rounded corners”,
  https://arun.is/blog/apple-rounded-corners/ (accesat 2026-08-31). Analiză
  independentă, nu documentație oficială Apple.
- [[2026-07-25-sistem-vizual-shadcn-stone-violet|Sistem vizual shadcn Stone și Violet]].
- [[2026-08-09-sistem-vizual-linen-quiet-olive|Sistem vizual Linen și Quiet Olive]].
