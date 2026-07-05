# Analytics și consimțământ

Stare: implementare tehnică pregătită; textele publice de confidențialitate
necesită revizuire înainte de lansarea pe domeniul final.
Ultima verificare operațională: 2026-07-05.

## Scop

Google Analytics 4 este folosit pentru a înțelege la nivel agregat:

- ce pagini sunt vizitate;
- dacă vizitatorii ajung la pagina de contact;
- dacă linkurile de email sunt apăsate.

Datele trebuie să informeze decizii de conținut, navigație și SEO. Nu se folosesc
pentru profilare clinică, remarketing, scoring, presiune comercială sau inferențe
despre starea de sănătate a vizitatorilor.

## Configurație website

GA4 folosește implicit streamul public V1 `G-D490J31F6H`. Variabila
`PUBLIC_GA_MEASUREMENT_ID` poate suprascrie streamul la build time dacă
proprietatea GA4 se schimbă.

Comportamentul implementat:

- consimțământ implicit refuzat pentru `analytics_storage`, `ad_storage`,
  `ad_user_data` și `ad_personalization`;
- tagul `gtag.js` este injectat numai după acceptarea analytics;
- opțiunile `allow_google_signals` și `allow_ad_personalization_signals` sunt
  setate la `false`;
- cookie-urile GA4 expiră după 180 de zile și nu sunt reînnoite la fiecare
  vizită;
- `page_location` și `page_referrer` sunt trimise fără query string și fără
  fragment;
- alegerea vizitatorului este păstrată în `localStorage` sub cheia
  `silvia.analyticsConsent`.

## Date colectate

Evenimente V1:

| Event name              | Descriere                                   | Parametri custom                 | Trigger                                                              |
| ----------------------- | ------------------------------------------- | -------------------------------- | -------------------------------------------------------------------- |
| `page_view`             | Vizualizare de pagină GA4                   | fără parametri custom            | după acceptarea analytics                                            |
| `contact_email_clicked` | Click pe linkurile de email ale cabinetului | `contact_method`, `link_context` | după acceptarea analytics, la click pe `mailto:silvia.drn@gmail.com` |

Nu se colectează prin analytics:

- răspunsuri din reflecția ghidată;
- conținutul mesajelor de contact;
- nume, email, telefon sau identificatori de vizitator introduși în formulare;
- informații medicale, psihologice sau alte date sensibile transmise voluntar;
- user ID-uri sau conturi de utilizator.

## Vendor și destinație date

Vendor: Google Analytics 4 / Google tag (`gtag.js`).

Google indică în documentația consultată la 2026-07-05 că GA4 nu loghează sau
stochează adrese IP individuale pentru utilizatorii din UE, Elveția sau UK și că
există controale pentru dezactivarea semnalelor Google și a personalizării
advertising. Aceasta este o afirmație de vendor, nu o concluzie juridică pentru
proiect.

## Consimțământ și notice public

Bannerul website-ului cere o alegere explicită înainte de încărcarea GA4.
Vizitatorul poate redeschide alegerea prin butonul `Setări confidențialitate`.

Înainte de lansarea publică pe domeniul final, trebuie revizuite:

- politica de confidențialitate;
- dacă este necesară o politică separată de cookies;
- textul bannerului și modul de retragere a consimțământului;
- setările GA4 de retenție, data sharing și acces utilizatori în contul Google.

## Acces, retenție și ștergere

De stabilit în contul Google Analytics înainte de lansarea finală:

- proprietarul contului și conturile cu acces;
- durata de retenție GA4;
- data sharing settings;
- procedura pentru solicitări de ștergere sau acces, dacă apar;
- excluderea traficului intern, dacă este necesară.

Nu salvați exporturi analytics cu identificatori în repository.

## Surse consultate

- Google Tag Platform consent mode pentru websites, accesat 2026-07-05:
  https://developers.google.com/tag-platform/security/guides/consent
- Google Analytics GA4 configuration reference, accesat 2026-07-05:
  https://developers.google.com/analytics/devguides/collection/ga4/reference/config
- Google Analytics GA4 events setup, accesat 2026-07-05:
  https://developers.google.com/analytics/devguides/collection/ga4/events
- Google Analytics EU, Switzerland, UK data and privacy, accesat 2026-07-05:
  https://support.google.com/analytics/answer/12017362
- Google Analytics PII best practices, accesat 2026-07-05:
  https://support.google.com/analytics/answer/6366371
