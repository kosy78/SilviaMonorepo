# Footer legal și ANPC SAL

Data: 2026-07-08
Stare: draft

## Context

Website-ul DespreSine are nevoie de un footer care să transmită încredere fără
să transforme pagina într-un marketplace sau într-un set de badge-uri
neverificate. Site-ul folosește contact prin email și analytics doar după
consimțământ, deci are nevoie de pagini publice pentru confidențialitate și
cookies.

Utilizatorul a cerut includerea unor indicatori de încredere relevanți pentru
România, inclusiv ANPC/SAL.

## Cercetare

Surse consultate la 2026-07-08:

- ANPC, comunicat publicat la 2026-05-19:
  https://anpc.ro/comunicat-sal/
- Portalul ANPC pentru soluționarea alternativă a litigiilor:
  https://reclamatiisal.anpc.ro/
- Comisia Europeană, pagina privind închiderea platformei ODR/SOL:
  https://consumer-redress.ec.europa.eu/site-relocation_en

ANPC a comunicat că OPANPC nr. 270/2026 modifică Ordinul nr. 449/2022, elimină
referințele la fosta platformă SOL și actualizează identificarea SAL prin
platforma `reclamatiisal.anpc.ro`. Pictograma online SAL este indicată ca având
dimensiunea 250 x 50 px, iar placheta/pictograma se descarcă de pe site-ul
oficial ANPC.

## Opțiuni analizate

1. Footer minimal, fără ANPC și fără pagini legale.
   - Mai curat vizual, dar insuficient pentru încredere și transparență.

2. Footer cu pagini legale și link SAL ANPC, fără SOL.
   - Potrivit cadrului curent și mai puțin încărcat.

3. Footer cu mai multe badge-uri, inclusiv SOL, afiliere, testimoniale sau
   acreditări suplimentare.
   - Risc de claims neverificate, suprapunere cu stilul marketplace și informație
   depășită pentru SOL.

## Decizie

Se implementează varianta 2:

- footer cu identitate profesională, contact, locație generală și linkuri către
  `Politica de confidențialitate` și `Politica de cookies`;
- un singur indicator oficial ANPC: pictograma SAL online, servită local din
  assetul descărcat de pe ANPC și legată către `https://reclamatiisal.anpc.ro/`;
- nu se include SOL/ODR, deoarece platforma europeană a fost închisă, iar ANPC a
  eliminat referințele la SOL în cadrul actualizat;
- nu se introduc testimoniale, review-uri, afiliere profesională suplimentară sau
  alte badge-uri fără verificare cu Silvia.

## Consecințe

Paginile legale sunt implementate ca texte prudente, în română, cu status de
draft în cod. Înainte de publicare trebuie verificate:

- identitatea completă a operatorului de date;
- forma juridică și datele administrative publicabile;
- perioadele de păstrare;
- formulările privind confidențialitatea profesională;
- aplicabilitatea exactă a obligațiilor ANPC pentru forma concretă a serviciului.

Canonical implementation: `website/`.
