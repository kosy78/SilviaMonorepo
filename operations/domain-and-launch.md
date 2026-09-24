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
- [ ] Permiteți indexarea numai după aprobarea conținutului (înlocuiți
      `Disallow: /` cu `Disallow:`).
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

## Surse consultate

- Cloudflare Pages custom domains, accesat 2026-07-07:
  https://developers.cloudflare.com/pages/configuration/custom-domains/
