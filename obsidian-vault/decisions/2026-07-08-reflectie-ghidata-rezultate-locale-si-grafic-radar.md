---
title: Rezultate locale și distribuție descriptivă pentru Reflecție ghidată
date: 2026-07-08
status: in-review
area: website
updates:
  - 2026-07-08-brand-despre-sine-si-reflectie-ghidata
tags:
  - decizie
  - website
  - reflectie-ghidata
  - confidentialitate
---

# Rezultate locale și distribuție descriptivă pentru Reflecție ghidată

## Context

Reflecția ghidată are nevoie de rezultate mai clare după parcurgerea
întrebărilor, dar fără să devină test, chestionar clinic sau mecanism de
colectare a datelor. V1 trebuie să rămână anonimă, client-side și fără stocarea
răspunsurilor.

## Decizie

- Rezultatele sunt calculate local, în browser, pe baza răspunsurilor păstrate
  doar în memoria componentei React.
- Nu se introduce bază de date pentru tipurile de rezultate sau pentru
  răspunsuri.
- Modelul folosește trei planuri descriptive: corp și semnale fizice, stări
  emoționale, relații și tipare repetitive.
- Rezultatul afișează o listă descriptivă cu frecvența alegerilor pentru fiecare
  plan, nu o hartă radar. Vizualizarea este formulată explicit ca numărare a
  răspunsurilor, nu ca severitate, diagnostic sau scor clinic.
- Fiecare întrebare include opțiunea de a indica faptul că nicio variantă nu se
  potrivește suficient. Aceste alegeri sunt afișate separat și nu sunt forțate
  într-unul dintre cele trei planuri.
- Dacă două planuri sunt apropiate, interfața afișează o nuanță secundară în
  loc să prezinte rezultatul ca o categorie rigidă.
- Copy-ul public și etichetele vizuale sunt în limba română.

## Fundamentare

Formularea rezultatelor se bazează prudent pe teme susținute în literatura
clinică: legătura dintre sănătatea mintală și cea fizică, rolul reglării
emoțiilor ca proces transdiagnostic și atenția psihodinamică acordată
emoțiilor, relațiilor și tiparelor repetitive.

Aceste surse nu validează reflecția ghidată ca instrument clinic. Ele susțin
doar limbajul orientativ folosit pentru rezultat. Copy-ul rămâne în revizie și
trebuie verificat de Silvia înainte de publicare.

## Actualizare 2026-07-09

Graficul radar a fost înlocuit cu o distribuție liniară mai discretă deoarece
forma radar putea sugera un instrument de evaluare, chiar în prezența
disclaimerului. Formularea rezultatului descrie acum direct alegerile făcute,
fără să afirme unde „se află” dificultatea persoanei. Nota non-diagnostică apare
înaintea vizualizării, iar fundamentarea și sursele sunt dezvăluite progresiv.

## Surse

- CDC, About Mental Health, accesat la 2026-07-08:
  https://www.cdc.gov/mental-health/about/index.html
- American Psychological Association, Stress effects on the body, accesat la
  2026-07-08: https://www.apa.org/topics/stress/body
- PubMed, Emotion Regulation: A Transdiagnostic Perspective on a New RDoC
  Domain, accesat la 2026-07-08:
  https://pubmed.ncbi.nlm.nih.gov/27524846/
- PubMed, The Association of Emotion Regulation and Somatic Symptoms, accesat
  la 2026-07-08: https://pubmed.ncbi.nlm.nih.gov/38598412/
- NCBI Bookshelf, Psychodynamic Therapy, accesat la 2026-07-08:
  https://www.ncbi.nlm.nih.gov/books/NBK606117/

## Canonical

Implementarea canonică este în
`website/src/components/islands/GuidedReflection.tsx`.
