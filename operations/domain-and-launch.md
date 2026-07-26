# Domeniu și lansare

Stare: pre-lansare pe domeniul canonic `https://despresine.ro`. Configurația
website-ului este actualizată, iar domeniile au fost adăugate în Cloudflare
Pages. Zona DNS Cloudflare este activă, iar nameserverele Cloudflare au fost
salvate la registrar. Domeniile custom sunt active în Cloudflare Pages, iar
site-ul este temporar protejat cu parolă până la revizuirea finală.
Ultima verificare operațională: 2026-07-09.

## Situația curentă

- Domeniul public canonic este `https://despresine.ro`.
- `www.despresine.ro` poate fi folosit ca alias sau redirect către domeniul
  canonic, dar nu ca URL canonic în metadata, sitemap sau materiale publice.
- `website/astro.config.mjs` folosește `https://despresine.ro` pentru URL-uri
  canonice și sitemap.
- `website/public/robots.txt` blochează intenționat indexarea (`Disallow: /`)
  pe durata pre-lansării. Copy-ul actual al paginilor de confidențialitate și
  cookies este tratat de brief ca revizuit pentru baseline-ul V1; titlurile
  profesionale, formularul și celelalte porți de lansare rămân deschise.
- Cloudflare Pages are domeniile `despresine.ro` și `www.despresine.ro` adăugate
  la proiectul `silvia-dinu-website`, iar ambele sunt `active`.
- Zona DNS Cloudflare `despresine.ro` există în același cont cu proiectul Pages
  și este `active` din 2026-07-09T06:52:01Z.
- Nameserverele Cloudflare atribuite sunt:
  - `louis.ns.cloudflare.com`;
  - `nia.ns.cloudflare.com`.
- CyberFolks a confirmat salvarea nameserverelor Cloudflare la 2026-07-09.
- În zona DNS Cloudflare există două recorduri CNAME către
  `silvia-dinu-website.pages.dev`:
  - `despresine.ro`, DNS only, pentru validarea apexului;
  - `www.despresine.ro`, proxied.
- Verificarea Cloudflare Pages și validarea certificatelor/HTTP sunt `active`
  pentru ambele custom domains.
- Verificarea publică prin `1.1.1.1` la 2026-07-09 returnează nameserverele
  Cloudflare și A records Cloudflare pentru apex și `www`.
- `https://despresine.ro`, `https://silvia-dinu-website.pages.dev`, URL-ul
  versionat, `robots.txt` și endpointul de contact răspund cu `401` fără
  credentiale.
- `https://www.despresine.ro` redirecționează cu `308` către apex înaintea
  autentificării, păstrând calea și query string-ul.
- Cloudflare Web Analytics este dezactivat în Pages; numai GA4 condiționat de
  consimțământ rămâne mecanismul analytics V1.
- Email Routing este activ pentru domeniu, destinația formularului este
  verificată, Workerul intern de livrare este deployat fără rută publică, iar
  service bindingul Pages este configurat pentru Production și Preview.
- Deciziile sunt consemnate în
  `obsidian-vault/decisions/2026-07-02-fundatia-seo-si-indexare.md` și
  `obsidian-vault/decisions/2026-07-07-domeniu-canonic-despresine-ro.md`.

## DNS necesar

Pentru activarea domeniului apex `despresine.ro`, Cloudflare Pages cere ca
domeniul să fie o zonă Cloudflare în același cont cu proiectul Pages. Pașii
rămași sunt:

1. După revizuirea finală, eliminați protecția temporară cu parolă.

## TinaCloud

După ce domeniul este activ sau înainte de testarea loginului pe domeniul final,
adăugați în TinaCloud, la Site URLs:

```text
https://despresine.ro
https://www.despresine.ro
```

Păstrați `http://localhost:3000` pentru test local și
`https://silvia-dinu-website.pages.dev` ca fallback operațional până când
domeniul final este confirmat.

## Checklist de lansare

- [x] Alegeți domeniul final: `despresine.ro`.
- [x] Înlocuiți domeniul substituent din `website/astro.config.mjs`.
- [x] Actualizați adresa `Sitemap:` din `website/public/robots.txt`.
- [x] Adăugați `despresine.ro` și `www.despresine.ro` în Cloudflare Pages.
- [x] Adăugați zona DNS `despresine.ro` în Cloudflare sau configurați un token
      cu permisiunea de creare zone.
- [x] Configurați nameserverele Cloudflare la registrar.
- [x] Adăugați recordurile DNS Cloudflare pentru `despresine.ro` și
      `www.despresine.ro` către `silvia-dinu-website.pages.dev`.
- [x] Verificați că `despresine.ro` este `active` în Cloudflare Pages.
- [x] Configurați redirectul sau aliasul `www.despresine.ro` către
      `https://despresine.ro`.
- [ ] Adăugați `https://despresine.ro` și `https://www.despresine.ro` în
      TinaCloud Site URLs.
- [ ] Permiteți indexarea numai după aprobarea conținutului, conform secțiunii
      „Vizibilitate în motoare de căutare și sisteme AI” de mai jos.
- [ ] Verificați cu Silvia titlurile profesionale, experiența și formulările
      practice din toate paginile și consemnați aprobarea versiunii finale.
- [x] Paginile de confidențialitate și cookies sunt implementate, iar copy-ul
      actual este tratat de brief ca revizuit pentru baseline-ul V1.
- [ ] Finalizați și verificați formularul minimal conform
      `operations/contact-form.md`.
- [x] Dezactivați Cloudflare Web Analytics pentru a păstra un singur flux
      analytics V1, condiționat de consimțământ.
- [ ] Re-revizuiți politicile după stabilizarea formularului sau după orice
      schimbare de operator, retenție, analytics, vendor ori afirmație
      legală/profesională. Repository-ul nu consemnează o aprobare juridică
      externă.
- [ ] Adăugați `og:image` după aprobarea materialelor vizuale de brand.
- [ ] Păstrați protecția cu parolă până la aprobarea explicită a lansării.
- [ ] După publicare, verificați pe `https://despresine.ro` URL-urile canonice,
      sitemap-ul și comportamentul robots.txt.

## Vizibilitate în motoare de căutare și sisteme AI

Stare: checklist amânat pentru lansarea publică. Nu eliminați autentificarea
Basic Auth și nu modificați blocarea actuală din `robots.txt` înainte de
aprobarea explicită a lansării. Vizibilitatea în ChatGPT sau în alte sisteme AI
nu poate fi garantată; obiectivul este ca site-ul să poată fi descoperit,
înțeles și citat corect.

### 1. Poarta de aprobare

- [ ] Confirmați că revizuirea publică, juridică, de confidențialitate și a
      titulaturilor profesionale este încheiată.
- [ ] Obțineți autorizarea explicită pentru eliminarea Basic Auth și activarea
      indexării.

### 2. Acces pentru crawlere

- [ ] Eliminați Basic Auth numai după aprobarea de lansare.
- [ ] În `website/public/robots.txt`, înlocuiți regula generală de pre-lansare
      `Disallow: /` cu `Allow: /`.
- [ ] Permiteți `OAI-SearchBot`, pentru ca paginile să poată fi descoperite de
      ChatGPT Search.
- [ ] Decideți separat dacă `GPTBot`, folosit pentru potențiala utilizare a
      conținutului la antrenarea modelelor, va fi permis sau blocat. Această
      decizie nu trebuie confundată cu accesul pentru ChatGPT Search.
- [ ] Verificați că regulile Cloudflare nu trimit provocări sau blocaje
      crawlerelor legitime pe paginile publice.
- [ ] Confirmați că `https://despresine.ro/sitemap-index.xml` este public.

### 3. Indexare

- [ ] Adăugați proprietatea și trimiteți sitemap-ul în Google Search Console.
- [ ] Adăugați proprietatea și trimiteți sitemap-ul în Bing Webmaster Tools.
- [ ] Evaluați IndexNow pentru notificarea rapidă a conținutului nou sau
      actualizat.
- [ ] Verificați că `robots.txt`, sitemap-ul, URL-urile canonice și un eșantion
      reprezentativ de pagini răspund cu `200` fără autentificare.

### 4. Date structurate și identitatea entității

- [ ] Implementați și validați JSON-LD de tip `WebSite` pentru site.
- [ ] Implementați și validați JSON-LD de tip `Person` pentru Silvia, folosind
      numai informații publice aprobate.
- [ ] Implementați și validați JSON-LD de tip `Service` pentru serviciile
      prezentate public.
- [ ] Implementați și validați JSON-LD de tip `BlogPosting` pentru articole.
- [ ] Nu folosiți tipul Schema.org depreciat `ProfessionalService`.
- [ ] Verificați că datele structurate corespund conținutului vizibil și nu
      includ adresa exactă a cabinetului, prețuri, afilieri inventate,
      testimoniale sau afirmații neverificate.

### 5. Conținut ușor de găsit, interpretat și citat

- [ ] Publicați treptat un grup restrâns de articole românești substanțiale,
      utile și originale, nu pagini create în masă pentru cuvinte-cheie.
- [ ] Luați în calcul următoarele subiecte, după verificarea formulărilor:
  - „Ce este psihoterapia psihanalitică?”;
  - „Cum decurge prima întâlnire?”;
  - „Consiliere sau psihoterapie?”;
  - „Online sau în cabinet?”;
  - „Cum aleg un psihoterapeut?”;
  - „Ce înseamnă «sub supervizare»?”.
- [ ] Pentru fiecare articol, afișați autorul, titulatura aprobată, data
      publicării, data ultimei revizuiri când este cazul, sursele autoritative
      și limitele informațiilor oferite.
- [ ] Verificați că articolele nu fac promisiuni diagnostice sau terapeutice,
      nu repetă artificial cuvinte-cheie și nu publică text AI neverificat.

### 6. Autoritate externă și consecvența informațiilor

- [ ] Verificați eligibilitatea Google Business Profile și implicațiile pentru
      confidențialitatea adresei înainte de a crea profilul.
- [ ] Creați sau actualizați numai profiluri corecte în directoare
      profesionale relevante și verificabile.
- [ ] Păstrați consecvente numele, titulaturile, localizarea publică, formatele
      ședințelor și URL-ul canonic pe toate profilurile.
- [ ] Nu fabricați recenzii, mențiuni pe Reddit, pagini Wikipedia sau alte
      semnale artificiale de autoritate.

### 7. Strat experimental

- [ ] Evaluați un fișier opțional `/llms.txt` cu linkuri canonice și numai
      informații verificate. Documentați-l ca mecanism experimental, nu ca
      factor de clasare sau garanție de includere în răspunsuri AI.

### 8. Monitorizare

- [ ] Definiți o verificare lunară în ChatGPT Search, Google, Perplexity și
      Copilot pentru un set stabil de întrebări în limba română.
- [ ] Urmăriți separat dacă site-ul a fost găsit, citat, menționat sau
      recomandat; aceste rezultate nu sunt echivalente.
- [ ] Folosiți ca punct de plecare următoarele interogări:
  - `psihoterapeut psihanalitic București`;
  - `psihoterapie Piața Victoriei`;
  - `psihoterapie psihanalitică online România`;
  - `psihoterapeut adolescenți 16 ani București`;
  - `cum decurge prima ședință de psihoterapie`;
  - `consiliere sau psihoterapie`;
  - `Silvia Dinu psihoterapeut`.
- [ ] Folosiți Google Search Console pentru datele de căutare. Nu adăugați
      analytics, tracking sau servicii terțe fără documentarea scopului și o
      nouă revizuire de confidențialitate.

### 9. Verificare după lansare

- [ ] Validați toate blocurile JSON-LD cu instrumente actuale.
- [ ] Verificați comportamentul HTTP live, redirecționările, URL-urile
      canonice, sitemap-ul și accesul crawlerelor.
- [ ] Urmăriți indexarea în timp; trimiterea sitemap-ului nu garantează
      indexarea sau includerea în rezultate AI.
- [ ] Reconsultați îndrumările OpenAI, Google, Bing și Schema.org înainte de
      execuție, deoarece regulile și crawlerele se pot schimba.

## Surse consultate

- Cloudflare Pages custom domains, accesat 2026-07-07:
  https://developers.cloudflare.com/pages/configuration/custom-domains/
- OpenAI crawlers, accesat 2026-07-26:
  https://developers.openai.com/api/docs/bots
- Google Search și funcțiile AI, accesat 2026-07-26:
  https://developers.google.com/search/docs/appearance/ai-features
- Google crawlers, accesat 2026-07-26:
  https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- IndexNow, accesat 2026-07-26:
  https://www.indexnow.org/documentation
- Tipuri Schema.org pentru date structurate, accesat 2026-07-26:
  https://schema.org/WebSite
  https://schema.org/Person
  https://schema.org/Service
  https://schema.org/BlogPosting
