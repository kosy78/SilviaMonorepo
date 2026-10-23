---
title: Bandă video cu umbre de frunze în secțiunea finală a paginii principale
date: 2026-10-23
status: draft
area: website
---

# Bandă video cu umbre de frunze în secțiunea finală

Utilizatorul a cerut îmbunătățirea vizuală a secțiunii „Solicitați o întâlnire
preliminară.” de pe pagina principală, cu un clip de umbre de frunze pe un
perete, ca bandă discretă în spatele textului. Au fost comparate trei
aranjamente (bandă pe toată lățimea, card, ecran împărțit) și apoi trei
rafinări ale benzii, în mișcare. Utilizatorul a ales rafinarea „Respirație”.

## Implementare

- Bandă pe toată lățimea ferestrei, în spatele textului, estompată sus, jos și
  lateral; zona din centru, sub text, este cu circa 28% mai transparentă.
- Video alb-negru cu o ușoară tentă caldă, amestecat cu fundalul (`multiply`),
  redat la 65% din viteză. Opacitatea „respiră” lent între 15% și 27%, pe un
  ciclu de 14 secunde.
- Clipul este rotit în format orizontal și redat înainte și înapoi, ca bucla
  să nu sară: `website/public/videos/homepage-closing-leaf-shadows.mp4`
  (10 s, 960 × 540, fără sunet, circa 405 KB), cu poster JPG.
- Videoul se încarcă doar când secțiunea se apropie de ecran și se oprește în
  afara lui. Cu `prefers-reduced-motion`, rămâne posterul static, fără
  animație de opacitate.
- Textul, butonul și linkul de email rămân neschimbate.

## Blocant înainte de publicare

Clipul sursă a fost descărcat de pe Klickpin, un site care republică videoclipuri
de pe Pinterest; autorul și licența nu sunt cunoscute. Nu se publică pe
`despresine.ro` până când nu există drept de utilizare confirmat sau până când
clipul nu este înlocuit cu unul original ori licențiat, cu același aspect.
