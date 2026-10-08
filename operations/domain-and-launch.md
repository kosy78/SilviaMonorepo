# Domeniu și lansare

Stare: site public pe domeniul canonic `https://despresine.ro` din 2026-10-09.
Utilizatorul a confirmat aprobarea Silviei pentru versiunea finală și lansare:
„Yes, Silvia has approved! go”. PR #23 a fost integrat, iar Cloudflare Pages
a publicat commitul `c4c1828aee98de5b534c36b16c32180ccff4eeba` în deploymentul
`f3002d9b-edfb-4fbd-a57d-826ca68d76f3`. Ambele domenii custom sunt active,
DNS-ul public rezolvă corect, iar paginile publice, robots și sitemap răspund
fără parolă. Preview-urile păstrează protecția cu parolă.

Verificarea live a identificat o buclă de redirect pentru fișierul Google:
Pages elimină `.html`, iar regula generală a site-ului adaugă slash final.
Remedierea solicită intern assetul fără extensie, păstrând URL-ul de
verificare exact în exterior. Fișierul Bing XML răspunde cu 200 și exact
conținutul descărcat. Verificările proprietăților și trimiterea sitemap-ului
sunt în curs. Indexarea nu este încă confirmată.

## Pregătirea lansării din 2026-10-08

- Implementarea pregătită permite accesul public numai pe `despresine.ro`.
  `www` și fallback-ul stabil Pages redirecționează către domeniul canonic,
  păstrând calea și parametrii. URL-urile de preview păstrează Basic Auth,
  `private, no-store` și primesc `X-Robots-Tag: noindex, nofollow`.
- `robots.txt` pregătit permite paginile publice pentru motoarele de căutare
  și explicit pentru `OAI-SearchBot`. API-ul de contact nu este o suprafață
  de indexare. `GPTBot` rămâne blocat: descoperirea în ChatGPT Search nu cere
  autorizarea antrenării modelelor OpenAI.
- Sitemap-ul generat conține numai URL-uri canonice publice; exclude ciornele,
  vechea rută redirecționată, design system-ul și rezultatul reflecției.
  Paginile interne păstrează și metadatele `noindex`; crawlerul trebuie să
  poată citi aceste metadate pentru a aplica excluderea.
- Sunt pregătite date structurate `WebSite`, `Person`, pagină de profil,
  pagină de contact și `BlogPosting`, folosind numai fapte deja vizibile.
  Articolul are autor vizibil și link la profil; metadata identifică Silvia
  Dinu și practica fără afirmații profesionale noi sau adresă exactă.
- Formularul primește avertismentul privind informațiile sensibile cerut de
  `operations/contact-form.md` și un link apropiat la politica de
  confidențialitate. Validarea endpointului și destinația mesajelor rămân
  aceleași.
- Contul Search Console este accesibil. Sunt înregistrate, încă neverificate,
  proprietatea de domeniu și proprietatea URL-prefix `https://despresine.ro/`.
  Fișierul de verificare Google `public/google21b3f224fa7179c8.html` este
  pregătit pentru publicare; verificarea URL-prefix nu cere acces DNS.
  Sitemap-ul nu este încă trimis. Bing Webmaster Tools este de asemenea
  accesibil; proprietatea este adăugată și fișierul `public/BingSiteAuth.xml`
  este pregătit pentru verificare după publicare.
  Tokenul Wrangler existent poate gestiona Pages, dar nu are acces la
  setările de bot/security sau la editarea DNS. Dashboard-ul Cloudflare cere
  autentificare; accesul crawlerelor la nivel CDN rămâne de verificat.
- Aprobarea versiunii finale a fost confirmată de utilizator la 2026-10-09,
  după solicitarea care acoperea formulările profesionale și vârsta, paginile
  de confidențialitate/cookies și fluxurile contact/Maps, reflecția ghidată,
  articolul și drepturile imaginilor. Această confirmare autorizează lansarea;
  nu reprezintă o certificare de conformitate juridică sau o verificare nouă
  a setărilor externe GA4.

Verificări locale: typecheck și formatare fără erori; build; 27 teste Functions;
203 teste browser trecute, 15 skip-uri intenționate; verificarea publicării
blogului trecută. Aceste rezultate nu confirmă încă un deployment public sau
indexarea. La lansare se verifică separat CI, commitul deploymentului, HTTP
fără credentiale, robots/sitemap și conținutul HTML de pe domeniul canonic.

Decizia și sursele curente:
[[../obsidian-vault/decisions/2026-10-08-lansare-publica-seo-si-descoperire-ai]].

## Baseline operațional verificat la 2026-07-09

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

## Publicarea blogului

Actualizare la 2026-09-24: configurarea TinaCloud Site URLs și testarea loginului
admin nu mai sunt condiții de lansare. Aceste instrucțiuni sunt înlocuite de
[decizia de publicare prin Codex sau Git](../obsidian-vault/decisions/2026-09-24-simplificare-blog-si-build.md).
Articolele folosesc Markdown, cu `draft: true` până la aprobare.

Urmați [procedura de redactare și publicare](../website/README.md#scrierea-și-publicarea-articolelor)
și [procedura de retragere TinaCMS](hosting-and-cms.md#retragerea-tinacms).
La 2026-09-24 au fost confirmate deploymentul de producție fără admin și fără
ciorne sau exemple de test, eliminarea variabilelor Tina, dezactivarea webhook-ului
și suspendarea reversibilă a integrării GitHub Tina. Dovezile sunt în procedura
operațională; protecția de prelansare rămâne activă. Verificarea tehnică nu
înlocuiește aprobarea editorială sau autorizarea lansării publice.

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
- [x] Verificați tehnic fluxul Markdown și artefactul de producție fără admin,
      ciorne sau exemple de test, conform
      [procedurii curente](hosting-and-cms.md#retragerea-tinacms), la 2026-09-24.
      Configurația externă Tina este retrasă; aprobarea articolelor și lansarea
      publică rămân separate.
- [x] Permiteți indexarea după aprobarea conținutului; `Allow: /` și
      `OAI-SearchBot` sunt publicate la 2026-10-09.
- [x] Consemnați aprobarea Silviei pentru versiunea finală; confirmată de
      utilizator la 2026-10-09.
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
- [x] Adăugați `og:image` după aprobarea materialelor vizuale de brand.
- [x] Obțineți aprobarea explicită a lansării; primită la 2026-10-08.
- [x] Consemnați confirmarea revizuirii versiunii finale înainte de eliminarea
      protecției și deblocarea indexării; primită la 2026-10-09.
- [ ] Verificați proprietatea Search Console și trimiteți sitemap-ul.
- [ ] Verificați accesul Bing Webmaster Tools și trimiteți sitemap-ul.
- [ ] Verificați că setările Cloudflare nu blochează crawlerii de căutare,
      inclusiv `OAI-SearchBot`, și verificați răspunsurile publice.
- [ ] După publicare, verificați pe `https://despresine.ro` URL-urile canonice,
      sitemap-ul și comportamentul robots.txt.

## Surse consultate

- Cloudflare Pages custom domains, accesat 2026-07-07:
  https://developers.cloudflare.com/pages/configuration/custom-domains/
