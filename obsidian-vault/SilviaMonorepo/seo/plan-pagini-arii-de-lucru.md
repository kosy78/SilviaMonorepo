---
title: Plan pentru paginile dedicate ariilor de lucru
date: 2026-11-06
status: approved
area: website
---

# Plan pentru paginile dedicate ariilor de lucru

Status: `approved`. Utilizatorul a confirmat aprobarea Silviei la 2026-11-06.
Fiecare pagină nouă are nevoie de aprobare separată înainte de publicare.

## Obiectiv

Silvia să poată fi găsită și citată când cineva caută, pe Google sau în ChatGPT,
o formă de psihoterapie pentru o dificultate anume, în București sau online.
Obiectivul nu este poziționarea ca „top” sau „cel mai bun” psihoterapeut:
regulile proiectului interzic afirmațiile de superioritate. Planul nu garantează
indexare, poziție sau citare.

## Situația actuală (verificată la 2026-11-06)

- Sitemap-ul public are nouă URL-uri și un singur articol.
- Cele opt arii de lucru există ca descrieri scurte pe `/competente/`, într-un
  acordeon. Textul se află în HTML-ul public, dar nicio arie nu are URL propriu.
- Consilierea parentală are deja text consistent pe `/competente/`, tot fără URL
  propriu.
- Rezultatele de căutare verificate sunt dominate de directoare comerciale, cu
  profiluri și pagini pe orașe sau sectoare (Hilio, Brig, Romedic). Acestea
  descriu mai ales terapeuți, nu felul în care se lucrează psihanalitic cu o
  dificultate anume.

Nu există încă date despre volumul căutărilor. Ordinea de mai jos se bazează pe
potrivirea cu practica, textul existent și riscul de revizuire. Se reordonează
după datele din Search Console sau dintr-un instrument de cuvinte cheie.

## Condiție înainte de orice pagină nouă: formularea profesională

Formulările nu coincid. Silvia trebuie să confirme una singură înainte ca
paginile noi să o multiplice.

| Unde                                               | Formulare                                                                         |
| -------------------------------------------------- | --------------------------------------------------------------------------------- |
| `/AGENTS.md`, `PRODUCT.md`, planurile social media | Psiholog cu drept de liberă practică / Psihoterapeut psihanalitic sub supervizare |
| Homepage și `/competente/`, publicate              | Psihoterapeut de orientare psihanalitică                                          |
| Footer, publicat                                   | Psihoterapeut Silvia Dinu                                                         |

Silvia a aprobat versiunea finală a site-ului la 2026-10-09, deci formularea
publicată poate fi intenționată, dar nu există o decizie care să înlocuiască
formularea din `/AGENTS.md`. Mențiunea `Membru ACPPB / Colegiul Psihologilor` a
fost aprobată de Silvia la 2026-09-27, conform confirmării utilizatorului, și nu
mai este un punct deschis.

## Structură propusă

```text
/competente/                                  hub, acordeonul rămâne
└── /arii-de-lucru/<arie>/                    o pagină pentru fiecare arie
    ├── link către /psihoterapie-si-consiliere/
    ├── link către articole relevante
    └── link discret către /contact/
```

Acordeonul păstrează descrierea scurtă și adaugă un link către pagina dedicată.
Paginile sunt fișiere Markdown cu un singur șablon, ca blogul. Nu este nevoie de
o dependență nouă. Paginile intră automat în sitemap. Nu se adaugă în navigația
principală.

## Pagini și ordine

### Etapa 1

| Pagină                         | URL                                              | Căutare vizată                      | De ce acum                                                                                   |
| ------------------------------ | ------------------------------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------- |
| Anxietate și atacuri de panică | `/arii-de-lucru/anxietate-si-atacuri-de-panica/` | psihoterapie anxietate București    | Prima arie listată pe site; subiect central în rezultatele verificate                        |
| Manifestări somatice           | `/arii-de-lucru/manifestari-somatice/`           | simptome psihosomatice psihoterapie | Temă legată direct de reflecția ghidată; perspectiva psihanalitică poate aduce ceva distinct |
| Dificultăți în relații         | `/arii-de-lucru/dificultati-in-relatii/`         | psihoterapie probleme de relație    | Se leagă firesc de tiparele relaționale din psihoterapia psihanalitică                       |
| Consiliere parentală           | `/arii-de-lucru/consiliere-parentala/`           | consiliere parentală București      | Textul există deja și este serviciu, nu arie de dificultate                                  |

### Etapa 2, cu revizuire suplimentară

| Pagină                   | Ce trebuie înainte de publicare                                         |
| ------------------------ | ----------------------------------------------------------------------- |
| Stări depresive          | Formulare pentru situații de criză, documentată și revizuită            |
| Adolescenți de la 16 ani | Verificare profesională și juridică a consimțământului pentru 16-17 ani |
| Stima de sine scăzută    | Revizuire standard                                                      |

### Etapa 3, numai dacă datele o susțin

Pierderi și schimbări importante, Emoții greu de gestionat, Tipare care se
repetă. Rămân pe `/competente/` până când există cerere sau text suficient de
distinct. Nu se publică pagini subțiri.

## Șablonul paginii

Fiecare pagină are 600-900 de cuvinte, în forma `dumneavoastră`:

1. Titlu formulat cum caută oamenii, fără promisiuni.
2. Un paragraf clar la început, care se înțelege și extras din pagină.
3. Cum se poate manifesta, descriptiv, fără a sugera că cititorul are o afecțiune.
4. Cum se lucrează în psihoterapia psihanalitică. Aici contează vocea Silviei.
5. Cum începe: întâlnirea preliminară, în persoană sau online, cu vizibilitate egală.
6. Două-patru întrebări frecvente, numai cu răspunsuri reale.
7. Limite: nu este diagnostic, nu înlocuiește o evaluare medicală sau de specialitate.
8. Surse datate, autor, data revizuirii și link discret către contact.

Datele structurate descriu numai ce este vizibil și verificat. Nu se adaugă
evaluări, recenzii, adresă exactă sau preț.

## Mod de lucru cu Silvia

Conținutul nu se scrie din texte generale. Pentru fiecare pagină:

1. Silvia răspunde în 20-30 de minute, scris sau printr-o notă vocală.
2. Se redactează pagina din răspunsurile ei, în `draft`.
3. Silvia revizuiește textul și sursele.
4. Se publică numai după aprobare.

Nu se folosesc cazuri, povești sau detalii despre pacienți, nici anonimizate
ca exemple reale. Exemplele sunt generice și marcate ca atare.

Întrebări pentru fiecare arie:

- Cum ajunge de obicei această dificultate să fie adusă în terapie?
- Ce înțeleg oamenii greșit despre ea?
- Cum diferă abordarea psihanalitică de ce ar putea găsi în altă parte?
- Ce ar fi util de știut înainte de o primă întâlnire?
- Ce nu poate promite psihoterapia în această situație?

## Măsurare

Lunar, după publicare: impresii și clicuri din Search Console pentru fiecare URL,
vizite cu `utm_source=chatgpt.com` în Google Analytics, numai pentru vizitatorii
care au acceptat analiza, și un set fix de întrebări rulate de 3-5 ori în ChatGPT.
Rezultatele nu conțin date despre vizitatori identificabili.

## Decizii deschise

- [ ] Formularea profesională unică.
- [x] Structura: pagini dedicate, decisă la 2026-11-06 în
      [[../../decisions/2026-11-06-pagini-dedicate-arii-de-lucru]].
- [ ] Ritmul pe care Silvia îl poate susține.
- [ ] Sursa datelor despre volumul căutărilor.

## Surse consultate la 2026-11-06

- [OpenAI: Publishers and Developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
- [Hilio: exemplu de profil de psihoterapeut](https://hilio.com/en/a/psihoterapeut-andrei-hompot)
- [Brig: pagini de directoare pentru psihanaliză](https://brig.ro/psihanaliza/sector-1)
- [[../../decisions/2026-10-08-lansare-publica-seo-si-descoperire-ai]]
