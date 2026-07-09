# Formular de contact V1

Stare: implementat și configurat tehnic în Cloudflare; activarea publică rămâne
blocată de protecția cu parolă, iar copy-ul și fluxul de confidențialitate
necesită aprobarea Silviei înainte de lansare. Ultima actualizare: 2026-07-09.

## Scop și limite

Formularul completează calea email-first cu o alternativă pentru vizitatorii
care nu au un client `mailto:` configurat. El trebuie să colecteze minimul
necesar pentru inițierea contactului și să nu devină sistem de programări,
fișă clinică sau bază de date pentru lead-uri.

Nu se colectează prin formular:

- răspunsuri din Reflecția ghidată;
- diagnostic, istoric clinic sau alte câmpuri dedicate sănătății;
- număr de telefon în V1;
- adresă exactă sau alte date administrative care nu sunt necesare primului
  contact;
- consimțământ pentru marketing.

Mesajul public trebuie să recomande explicit evitarea informațiilor sensibile.
Orice informație de sănătate transmisă voluntar trebuie tratată ca sensibilă,
chiar dacă formularul nu o solicită.

## Arhitectură implementată

Fluxul tehnic configurat este:

1. Formularul trimite un request `POST` same-origin la `/api/contact`.
2. O Cloudflare Pages Function validează din nou datele pe server, limitează
   mărimea câmpurilor și respinge câmpul-capcană completat.
3. Function-ul transmite mesajul către email printr-un serviciu Cloudflare
   compatibil Workers și un binding dedicat.
4. Aplicația nu scrie mesajul într-o bază de date și nu îl persistă în
   repository.

Workerul `despresine-contact-mailer` este disponibil numai prin service binding;
subdomeniul public `workers.dev` și preview-urile Workerului sunt dezactivate.
Bindingul Cloudflare Email Service limitează livrarea la destinația verificată.
Nu există bază de date, Queue, KV, D1 sau logging custom pentru submissions.

## Câmpuri minime propuse

| Câmp                   | Necesitate             | Reguli                                                               |
| ---------------------- | ---------------------- | -------------------------------------------------------------------- |
| Nume                   | opțional               | text scurt; vizitatorul poate evita numele complet                   |
| Email                  | necesar pentru răspuns | validare client și server; nu se trimite în analytics                |
| Formatul întâlnirii    | opțional               | una dintre opțiunile cabinet, online sau încă nesigur(ă)             |
| Detalii practice       | opțional               | limită de lungime; instrucțiune de a nu include informații sensibile |
| Câmp-capcană           | tehnic, invizibil      | trebuie să rămână gol; nu este stocat                                |

Lista finală trebuie să corespundă exact implementării publicate. Nu adăugați
câmpuri fără o nevoie documentată și fără reevaluarea notice-ului.

## Protecție și reziliență

- Validarea server-side este obligatorie; validarea din browser este doar un
  ajutor pentru utilizator.
- Impuneți limite explicite de lungime și mărime a requestului.
- Folosiți câmpul-capcană implementat. Adăugați rate limiting la nivel
  Cloudflare înainte de eliminarea parolei, dacă riscul observat îl justifică.
- Introduceți Turnstile sau alt serviciu anti-abuz numai după documentarea
  datelor, vendorului și implicațiilor de confidențialitate.
- Nu includeți emailul sau conținutul mesajului în URL-uri, loguri custom,
  evenimente analytics ori mesaje de eroare publice.
- Stările de succes și eroare trebuie să fie accesibile, clare și să nu promită
  că mesajul a ajuns dacă providerul nu a confirmat livrarea.
- Păstrați alternativa directă `silvia.drn@gmail.com` dacă endpointul este
  indisponibil.

## Date, destinație și retenție

| Element               | Configurație V1                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| Processor/vendor      | Cloudflare Pages Functions, Workers și Email Service                                                  |
| Destinație email      | adresa publică de contact a Silviei, verificată în Cloudflare Email Routing                          |
| Persistență aplicație | fără bază de date și fără stocare în repository                                                       |
| Loguri aplicație      | fără logging custom al emailului, numelui sau conținutului mesajului                                 |
| Retenție în mailbox   | guvernată de contul Gmail al Silviei; perioada și procedura de ștergere rămân de aprobate operațional |
| Acces și ștergere     | accesul la mailbox și Cloudflare este limitat la conturile operaționale autorizate                   |

Repository-ul nu trebuie să conțină submissions, mesaje de test cu date reale,
capturi ale mesajelor sau exporturi din mailbox. Testele de producție folosesc
doar date fictive, nesensibile, apoi mesajele de test se șterg conform
procedurii convenite.

## Configurație și secrete

Documentați numai identificatori și scopuri, niciodată parole, tokens sau
submissions.

| Identificator                  | Scop                                                 | Tratament                                       |
| ----------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| `CONTACT_MAILER`              | service binding Pages către Workerul intern          | configurat în Production și Preview             |
| `despresine-contact-mailer`   | validare finală și livrare prin Email Service        | fără rută publică `workers.dev`                  |
| `EMAIL`                       | bindingul Workerului pentru livrare                  | limitat în Cloudflare la destinația verificată  |
| regulă de rate limiting V1.1  | protecție opțională după eliminarea parolei          | se documentează înainte de activare              |

Protecția Basic Auth a website-ului rămâne activă pe Production și Preview în
timpul implementării și verificării. Formularul nu justifică eliminarea parolei
sau deblocarea indexării.

## Revizuire și responsabilitate

| Rol                                 | Stare                                                  |
| ----------------------------------- | ------------------------------------------------------ |
| Responsabil business și răspunsuri  | Silvia; confirmarea fluxului rămâne de consemnat       |
| Responsabil tehnic                  | de confirmat                                           |
| Revizor privacy / protecția datelor | de confirmat                                           |
| Revizor al copy-ului public         | Silvia; aprobarea versiunii finale rămâne de consemnat |
| Data deciziei de activare           | de stabilit după verificări                            |

Copy-ul legal actual este tratat de brief ca revizuit pentru baseline-ul V1
existent. Adăugarea formularului este o schimbare materială și impune
re-revizuirea politicilor după ce fluxul real, vendorul, loggingul și retenția
sunt cunoscute. Nu se afirmă conformitate juridică sau aprobare externă numai pe
baza acestui checklist.

## Checklist înainte de activare

- [x] Confirmați serviciul Cloudflare și bindingul disponibile în cont.
- [x] Confirmați expeditorul, destinația și accesul minim necesar.
- [x] Aliniați câmpurile documentate cu implementarea finală.
- [x] Verificați validarea server-side, limitele și honeypot-ul; reevaluați rate
      limitingul înainte de eliminarea parolei.
- [ ] Confirmați ce loghează Cloudflare și stabiliți retenția și accesul.
- [ ] Re-revizuiți politica de confidențialitate și politica de cookies pentru
      fluxul efectiv.
- [x] Testați succesul, erorile, tastatura, stările accesibile și fallback-ul
      email în browser automatizat, fără livrare de date reale.
- [x] Confirmați că analytics nu primește conținutul sau datele formularului.
- [ ] Consemnați ownerii, revizorii și data deciziei de activare.
- [ ] Păstrați parola website-ului până la aprobarea separată a lansării.
