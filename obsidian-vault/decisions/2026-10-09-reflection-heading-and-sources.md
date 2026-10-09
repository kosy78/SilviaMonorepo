---
title: Direcții de explorare și sursele reflecției
date: 2026-10-09
status: approved
area: website
---

# Direcții de explorare și sursele reflecției

La cererea utilizatorului, titlul rezultatului devine „Direcții de explorare”.
„Surse” folosește varianta link a butonului existent, păstrând dialogul și o
țintă tactilă de 44 px. Sunt eliminate cele șase referințe marcate în feedback;
GAD-7 rămâne. Se adaugă OPD-2 și WHODAS 2.0 cu linkuri primare verificate.

Această decizie înlocuiește lista și stilul triggerului din
[[2026-09-21-reflection-sources-dialog]] și titlul din
[[2026-09-21-reflection-result-heading]]. Implementarea canonică rămâne în
`website/src/components/islands/GuidedReflection.tsx`.

Întrebările, calculul local, distribuția răspunsurilor și disclaimerul rămân
neschimbate. Bibliografia nu reprezintă validarea clinică a acestei reflecții.
Nu se colectează și nu se stochează răspunsuri.

## Surse verificate la 2026-10-09

- [OPD-2, Editura Trei](https://www.edituratrei.ro/carte/diagnostic-psihodinamic-operationalizat-opd-2-manual-de-diagnostic-si-planificarea-terapiei/11085/)
- [WHODAS 2.0, Organizația Mondială a Sănătății](https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health/who-disability-assessment-schedule)

Publicarea se verifică separat prin CI, deploymentul Pages și interfața live.
