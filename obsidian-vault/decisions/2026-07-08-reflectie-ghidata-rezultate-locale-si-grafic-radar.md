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

Distribuția liniară folosește acum câte șapte segmente discrete pentru fiecare
plan, câte unul pentru fiecare întrebare. Segmentele pline arată numai frecvența
alegerilor, fără procente, axe sau suprafețe care ar putea sugera intensitate ori
severitate. Corpul, stările emoționale și relațiile primesc accente cromatice
distincte, temperate; etichetele și numărătoarea rămân vizibile, astfel încât
sensul nu depinde numai de culoare. Alegerile fără o potrivire clară păstrează o
tratare neutră.

Întrebările au fost reformulate pentru a trece prin momente diferite ale
reflecției — observare, impact, repetiție, înțelegere, atenție, recunoaștere mai
timpurie și continuarea printr-o întrebare deschisă. Au fost eliminate
formulările care puteau sugera că un simptom corporal are implicit o explicație
psihologică. Rezultatul este mai scurt, declară o singură dată ce a apărut mai
des și păstrează explicit limitele non-diagnostice și recomandarea evaluării
medicale pentru simptomele fizice care preocupă vizitatorul.

## Actualizare 2026-08-04

Setul public a fost revizuit pe baza documentului de lucru cu snapshot din 3
august 2026. Experiența are acum zece întrebări și câte patru variante pentru
fiecare întrebare, mapate editorial la `body`, `emotion`, `relationships` sau
`uncertain`. Întrebările și variantele au ID-uri stabile (`q01`–`q10` și
`qNN-dimension`) pentru implementare și testare, fără ca răspunsurile
vizitatorului să fie trimise sau stocate.

Rezultatele publice rămân `body`, `emotion`, `relationships` și `mixed`.
Rezultatul `mixed` are două variante interne:

- `unclear`, când sunt cel puțin patru alegeri `uncertain` sau când niciuna
  dintre cele trei direcții principale nu are mai mult de trei alegeri;
- `distributed`, când două sau trei direcții principale sunt la egalitate pe
  primul loc.

Dacă există un singur câștigător, acesta devine rezultatul principal. O a doua
direcție este afișată ca nuanță secundară numai dacă este la un punct de
câștigător și are cel puțin trei alegeri. Valoarea `uncertain` apare doar în
distribuție și nu poate deveni rezultat principal sau secundar. Aceste reguli
sunt o euristică editorială și de produs, nu o scală validată sau un scor
clinic.

Fiecare rezultat păstrează disclaimerul non-diagnostic și explicația că
distribuția arată frecvența alegerilor, nu severitatea. Numai rezultatul `body`
păstrează suplimentar și vizibil mesajul privind evaluarea medicală. Copia,
euristica și situațiile-limită rămân `in-review` până la revizuirea Silviei și
la testarea de înțelegere cu utilizatori.

## Actualizare 2026-08-29

Setul public a fost redus la opt întrebări (`q01`–`q08`), fiecare cu patru
variante, folosind copia furnizată pentru această revizie. Numărătoarea din
interfață, descrierea SEO, distribuția rezultatului și rezumatul opțional pentru
mesaj folosesc acum opt drept număr total de întrebări.

Pragurile euristicii sunt derivate proporțional din lungimea setului: 40% pentru
varianta `unclear` și 30% pentru afișarea unei direcții secundare apropiate.
Pentru setul actual, acestea păstrează pragurile numerice de patru, respectiv
trei alegeri. Sunt praguri editoriale pentru rutarea copy-ului de rezultat, nu
praguri clinice.

Cele patru variante păstrează temporar ordinea de mapare existentă (`body`,
`emotion`, `relationships`, `uncertain`). Deoarece unele dintre noile formulări
nu indică explicit unul dintre cele trei planuri descriptive, maparea rămâne în
revizuire și trebuie confirmată de Silvia înainte de publicare, împreună cu
copia și euristica rezultatului.

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
- Hogrefe, OPD-3: Operationalisierte Psychodynamische Diagnostik, accesat la
  2026-08-03:
  https://www.hogrefe.com/de/shop/opd-3-operationalisierte-psychodynamische-diagnostik-99053.html
- OPD Online, introducere în axele OPD, accesat la 2026-08-03:
  https://www.opd-online.net/willkommen/opd_eine_einfuehrung
- Ärztliche Psychotherapie, actualizarea OPD-3 și accentul dimensional, accesat
  la 2026-08-03: https://doi.org/10.21706/aep-19-3-140
- Frontiers in Psychology, OPD-SQS, accesat la 2026-08-03:
  https://doi.org/10.3389/fpsyg.2023.1248992
- PubMed, PHQ-9, accesat la 2026-08-03:
  https://pubmed.ncbi.nlm.nih.gov/11556941/
- PubMed, GAD-7, accesat la 2026-08-03:
  https://pubmed.ncbi.nlm.nih.gov/16717171/
- PubMed, BDI-II, accesat la 2026-08-03:
  https://pubmed.ncbi.nlm.nih.gov/11315728/

## Canonical

Implementarea canonică este în
`website/src/components/islands/GuidedReflection.tsx`.
