---
title: Sistem vizual Linen și Quiet Olive
date: 2026-08-09
status: approved
area: website
updates:
  - 2026-07-25-sistem-vizual-shadcn-stone-violet
tags:
  - decizie
  - website
  - design-system
  - paleta
---

# Sistem vizual Linen și Quiet Olive

## Context

Paleta Linen + Violet oferea o bază coerentă, dar accentul violet nu mai
susținea direcția vizuală dorită pentru DespreSine. A fost aleasă o paletă mai
pământie, calmă și reținută, fără schimbarea structurii componentelor sau a
neutrelor editoriale.

## Opțiuni analizate

1. **Quiet Olive + Linen**
   - păstrează căldura fundalurilor Linen;
   - adaugă un accent vegetal discret, cu contrast puternic pentru acțiuni și
     focus.

2. **Terracotta + Linen**
   - oferă o expresie mai caldă și mai prezentă;
   - poate deveni prea decorativă pentru tonul editorial și discret al
     website-ului.

## Decizie

- Paleta aprobată este **Linen + Quiet Olive**.
- Fundalurile Linen, foreground-urile, rolurile `secondary`, `muted`,
  `border`, stările destructive și culorile Reflecției ghidate rămân
  neschimbate.
- Rolurile semantice `primary`, `accent`, `ring` și seria `chart` folosesc
  nuanțe Quiet Olive în temele light și dark.
- Aliasurile de brand sunt denumite semantic `brand-accent`, fără numele unei
  culori concrete, pentru a putea păstra rolul stabil când paleta evoluează.
- Perechile light principale au fost alese pentru contrast WCAG puternic:
  `primary` pe Linen aproximativ `10.3:1`, `accent-foreground` pe `accent`
  aproximativ `10.7:1`, iar `ring` pe Linen aproximativ `6.1:1`.
- Sidebar-ul dark folosește aliasurile semantice comune, astfel încât să nu
  păstreze accente violet sau albastre izolate.

## Domeniul înlocuirii

Această decizie înlocuiește numai partea de paletă Violet din
[[2026-07-25-sistem-vizual-shadcn-stone-violet|Sistemul vizual Stone și
Violet]]. Fundația Stone/shadcn, presetul `b4vf0yLwvq`, raza, stilul `nova`,
iconurile Tabler, regulile de accesibilitate și adaptările Astro statice rămân
active.

## Consecințe

- `website/src/styles/global.css` rămâne sursa canonică pentru rolurile
  semantice light și dark.
- `website/src/styles/tokens.css` păstrează aliasurile editoriale și expune
  accentele Quiet Olive prin rolurile `brand-accent`.
- `/design-system/` citește tokenurile direct din sursele canonice la fiecare
  build și documentează numele actuale ale paletei.
- Schimbările viitoare ale paletei trebuie verificate pe desktop, la 320 px și
  în ambele aparențe atunci când dark mode devine public.

## Legături

- [[2026-07-25-sistem-vizual-shadcn-stone-violet|Sistem vizual shadcn Stone și Violet]].
- `website/src/styles/global.css`.
- `website/src/styles/tokens.css`.
- `website/src/pages/design-system.astro`.
