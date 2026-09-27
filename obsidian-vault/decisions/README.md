---
title: Registrul deciziilor
updated: 2026-09-04
tags:
  - decizii
  - index
---

# Registrul deciziilor

Acest director conține deciziile materiale de produs, conținut, tehnologie și
conformitate. Starea din tabel descrie decizia, nu starea întregii implementări.

| Data       | Decizie                                                                                                                     | Stare                                      | Relații și domeniu activ                                                                                                                                                                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-24 | [[2026-06-24-website-technical-foundation\|Fundația tehnică a website-ului]]                                                | `approved`, parțial înlocuită              | Hostingul Vercel și regula fără CMS au fost înlocuite de [[2026-07-05-cloudflare-pages-si-tinacms\|Cloudflare Pages și TinaCMS]]; Astro, React izolat și testarea rămân active; MDX este înlocuit de [[2026-09-24-simplificare-blog-si-build\|Markdown simplu]]. |
| 2026-06-24 | [[2026-06-24-website-conversion-foundation\|Fundația de conversie a website-ului]]                                          | `approved`                                 | Contactul calm și email-first rămân active; formularul minimal este acum cerință V1, dar activarea lui rămâne condiționată de evaluarea fluxului și confidențialității în `operations/contact-form.md`.                                                          |
| 2026-07-02 | [[2026-07-02-fundatia-seo-si-indexare\|Fundația SEO și blocarea indexării]]                                                 | `approved`                                 | Actualizată de [[2026-07-07-domeniu-canonic-despresine-ro\|Domeniul canonic despresine.ro]]. Blocarea indexării rămâne activă în pre-lansare.                                                                                                                    |
| 2026-07-02 | [[2026-07-02-extindere-linkedin\|Extinderea campaniei sociale pe LinkedIn]]                                                 | `approved`                                 | Textele și publicarea rămân condiționate de aprobările documentate în decizie.                                                                                                                                                                                   |
| 2026-07-05 | [[2026-07-05-cloudflare-pages-si-tinacms\|Cloudflare Pages și TinaCMS pentru blog admin]]                                   | `approved`                                 | Hostingul Pages rămâne; TinaCMS este înlocuit de [[2026-09-24-simplificare-blog-si-build\|publicarea prin Codex/Git din 2026-09-24]].                                                                                                                            |
| 2026-07-05 | [[2026-07-05-google-analytics-v1\|Google Analytics V1 cu consimțământ explicit]]                                            | `approved`                                 | Orice schimbare de analytics, retenție, vendor sau evenimente redeschide revizuirea notice-ului public.                                                                                                                                                          |
| 2026-07-07 | [[2026-07-07-domeniu-canonic-despresine-ro\|Domeniu canonic despresine.ro]]                                                 | `approved`                                 | Actualizează domeniul substituent din decizia SEO; este context pentru [[2026-07-08-brand-despre-sine-si-reflectie-ghidata\|brandul DespreSine]].                                                                                                                |
| 2026-07-08 | [[2026-07-08-brand-despre-sine-si-reflectie-ghidata\|Brand DespreSine și Reflecție ghidată]]                                | `approved`                                 | Stabilește wordmarkul și limitele produsului; rezultatele sunt detaliate de decizia aflată în revizie de mai jos.                                                                                                                                                |
| 2026-07-08 | [[2026-07-08-footer-legal-si-anpc-sal\|Footer legal și ANPC SAL]]                                                           | `approved` pentru baseline-ul V1 curent    | Copy-ul legal curent este tratat ca revizuit pentru V1; nu există în repository dovada unei validări juridice externe. Schimbările materiale impun re-revizuire.                                                                                                 |
| 2026-07-08 | [[2026-07-08-reflectie-ghidata-rezultate-locale-si-grafic-radar\|Rezultate locale și distribuție pentru Reflecție ghidată]] | `in-review`                                | Actualizează decizia de brand; formularea și vizualizarea rezultatului nu sunt încă aprobate pentru lansare.                                                                                                                                                     |
| 2026-07-09 | [[2026-07-09-formular-contact-cloudflare-email\|Formular minimal de contact prin Cloudflare Email Service]]                 | `in-review`                                | Actualizează fundația de conversie; activarea depinde de verificarea destinației, deploy, test end-to-end și re-revizuirea privacy.                                                                                                                              |
| 2026-07-09 | [[2026-07-09-dezactivare-cloudflare-web-analytics\|Dezactivarea Cloudflare Web Analytics în V1]]                            | `approved`                                 | Actualizează decizia GA4; numai GA4 condiționat de consimțământ rămâne analytics V1.                                                                                                                                                                             |
| 2026-07-10 | [[2026-07-10-formare-si-orientare\|Pagina Formare și orientare]]                                                            | `approved`                                 | Înlocuiește eticheta „Despre Silvia” în navigație și în titlul paginii; ruta `/despre-silvia/` rămâne stabilă.                                                                                                                                                   |
| 2026-07-25 | [[2026-07-25-sistem-vizual-shadcn-stone-violet\|Sistem vizual shadcn Stone și Violet]]                                      | `approved`, paletă înlocuită               | Fundația Stone/shadcn rămâne activă; paleta Violet este înlocuită de [[2026-08-09-sistem-vizual-linen-quiet-olive\|Linen și Quiet Olive]].                                                                                                                       |
| 2026-07-26 | [[2026-07-26-parcurs-continut-website\|Parcursul conținutului pe website]]                                                  | `approved`, ordine înlocuită               | Etapa de informare pentru Reflecție ghidată rămâne activă; ordinea navigației și a homepage-ului este înlocuită de [[2026-08-02-ordine-navigatie-si-homepage\|noua ordine publică]].                                                                             |
| 2026-08-02 | [[2026-08-02-ordine-navigatie-si-homepage\|Ordinea navigației și a secțiunilor homepage]]                                   | `approved`                                 | Pune `O primă explorare` imediat după `Acasă`, redenumește pagina profesională `Competențe` și stabilește noua ordine a blocurilor de pe homepage.                                                                                                               |
| 2026-08-09 | [[2026-08-09-rezultat-reflectie-optional-in-mesaj\|Rezultatul reflecției inclus opțional în mesaj]]                         | `in-review`                                | Actualizează limitele rezultatului local și formularul de contact; numai rezumatul și distribuția pot fi incluse după bifare explicită, fără răspunsuri individuale.                                                                                             |
| 2026-08-09 | [[2026-08-09-sistem-vizual-linen-quiet-olive\|Sistem vizual Linen și Quiet Olive]]                                          | `approved`                                 | Înlocuiește numai paleta Violet din decizia vizuală din 2026-07-25; fundația Stone/shadcn și regulile componentelor rămân active.                                                                                                                                |
| 2026-08-29 | [[2026-08-29-eliminare-indicator-anpc-sal\|Eliminarea indicatorului ANPC/SAL din footer]]                                   | `approved`, revizuire înainte de publicare | Înlocuiește numai partea ANPC/SAL a deciziei de footer din 2026-07-08; păstrează linkurile legale și amână orice siglă profesională până la verificarea statutului și a drepturilor de utilizare.                                                                |
| 2026-08-31 | [[2026-08-31-sistem-vizual-colturi-proportionale\|Sistem vizual cu colțuri proporționale]]                                  | `approved`                                 | Înlocuiește raza de bază din decizia vizuală din 2026-07-25; păstrează fundația shadcn, paleta Linen + Quiet Olive și excepțiile intenționate pentru capsule și cercuri.                                                                                         |
| 2026-08-31 | [[2026-08-31-formular-contact-si-harta-google-maps\|Formular contact și hartă Google Maps]]                                 | `in-review`                                | Actualizează formularul din 2026-07-09: numele devine obligatoriu, copy-ul este simplificat, iar harta zonei se încarcă numai după o acțiune explicită.                                                                                                          |
| 2026-09-04 | [[2026-09-04-harta-google-maps-incarcare-automata\|Harta Google Maps cu încărcare automată]]                                | `in-review`                                | Înlocuiește numai acțiunea explicită pentru hartă: iframe-ul se încarcă automat, păstrează zona orientativă și necesită re-revizuirea publică a confidențialității înainte de lansare.                                                                           |
| 2026-09-24 | [[2026-09-24-simplificare-blog-si-build\|Simplificarea blogului și a build-ului]]                                           | `approved`                                 | Înlocuiește TinaCMS și MDX cu Markdown în Git; optimizează build-ul și verificările. Curățarea shadcn și a activelor este exclusă.                                                                                                                               |

Feedback aprobat: [[2026-09-27-feedback-homepage-competente|Homepage și Competențe]]
(`approved`; publicarea în mediul protejat este autorizată, inclusiv afilierea
confirmată cu Silvia și cele trei ilustrații active).

## Lanțuri de actualizare

- [[2026-06-24-website-technical-foundation|Fundație tehnică]] →
  [[2026-07-05-cloudflare-pages-si-tinacms|Cloudflare Pages și TinaCMS]]
  (înlocuire parțială: hosting și CMS) →
  [[2026-09-24-simplificare-blog-si-build|Markdown în Git și build simplificat]]
  (înlocuiește TinaCMS și MDX; păstrează hostingul Pages).
- [[2026-07-02-fundatia-seo-si-indexare|Fundație SEO]] →
  [[2026-07-07-domeniu-canonic-despresine-ro|Domeniu canonic]] →
  [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand DespreSine]]
  (actualizări de domeniu și identitate publică, nu anularea întregii decizii
  anterioare).
- [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand și limite produs]] →
  [[2026-07-10-formare-si-orientare|Pagina Formare și orientare]]
  (actualizare de denumire și poziționare pentru pagina profesională).
- [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand și limite produs]] →
  [[2026-07-08-reflectie-ghidata-rezultate-locale-si-grafic-radar|Rezultate locale]]
  (`in-review`).
- [[2026-06-24-website-technical-foundation|Fundație tehnică]] +
  [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand și limite produs]] →
  [[2026-07-25-sistem-vizual-shadcn-stone-violet|Sistem vizual Stone și Violet]]
  (actualizare a fundației de componente și a paletei, fără schimbarea
  limitelor de produs sau a regulilor de confidențialitate).
- [[2026-07-25-sistem-vizual-shadcn-stone-violet|Sistem vizual Stone și Violet]] →
  [[2026-08-09-sistem-vizual-linen-quiet-olive|Sistem vizual Linen și Quiet Olive]]
  (înlocuire parțială: paleta Violet; fundația Stone/shadcn rămâne activă).
- [[2026-07-25-sistem-vizual-shadcn-stone-violet|Sistem vizual Stone și Violet]] +
  [[2026-08-09-sistem-vizual-linen-quiet-olive|Linen și Quiet Olive]] →
  [[2026-08-31-sistem-vizual-colturi-proportionale|Colțuri proporționale]]
  (înlocuire parțială: raza și geometria colțurilor; fundația componentelor și
  paleta rămân active).
- [[2026-07-08-footer-legal-si-anpc-sal|Footer legal și ANPC/SAL]] →
  [[2026-08-29-eliminare-indicator-anpc-sal|Eliminarea indicatorului ANPC/SAL]]
  (înlocuire parțială: indicatorul vizual este eliminat; linkurile legale și
  obligația de re-revizuire rămân active).
- [[2026-07-09-formular-contact-cloudflare-email|Formular de contact]] →
  [[2026-08-31-formular-contact-si-harta-google-maps|Formular actualizat și hartă Google Maps]]
  (numele devine obligatoriu, iar noul vendor terț este încărcat numai după o
  acțiune explicită; politicile publice rămân în revizie).
- [[2026-08-31-formular-contact-si-harta-google-maps|Formular actualizat și hartă Google Maps]] →
  [[2026-09-04-harta-google-maps-incarcare-automata|Hartă Google Maps cu încărcare automată]]
  (înlocuiește numai acțiunea explicită cu încărcare automată lazy; politicile
  publice și mecanismul de informare rămân în revizie).
- [[2026-07-08-brand-despre-sine-si-reflectie-ghidata|Brand și limite produs]] +
  [[2026-07-10-formare-si-orientare|Pagina Formare și orientare]] →
  [[2026-07-26-parcurs-continut-website|Parcursul conținutului pe website]]
  (actualizare a ordinii secțiunilor, a navigației și a informării prealabile
  pentru Reflecție ghidată, fără schimbarea limitelor clinice sau de
  confidențialitate).
- [[2026-08-02-ordine-navigatie-si-homepage|Noua ordine publică]] înlocuiește
  [[2026-07-26-parcurs-continut-website|parcursul anterior]]; informarea
  prealabilă și limitele clinice rămân active.

<!-- prettier-ignore -->
- Noua legătură actualizează [[2026-07-08-reflectie-ghidata-rezultate-locale-si-grafic-radar|Rezultate locale]]
  și [[2026-07-09-formular-contact-cloudflare-email|Formular de contact]] prin
  [[2026-08-09-rezultat-reflectie-optional-in-mesaj|includerea opțională a
  rezultatului în mesaj]] (`in-review`; fără răspunsuri individuale).

## Convenție

Fiecare decizie trebuie să precizeze data, starea, contextul, opțiunile
analizate, decizia și consecințele. O decizie care înlocuiește sau actualizează
alta trebuie să lege ambele înregistrări și să precizeze domeniul înlocuirii.
Stările folosite sunt `draft`, `in-review`, `approved`, `published` și
`archived`.
