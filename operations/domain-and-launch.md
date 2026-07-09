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
  deoarece conținutul website-ului, titlurile profesionale și textele de
  confidențialitate încă necesită aprobarea finală înainte de indexare.
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
- `https://despresine.ro`, `https://www.despresine.ro` și
  `https://silvia-dinu-website.pages.dev` răspund cu `401` fără credentiale și
  `200` cu credentialele configurate în Cloudflare Pages.
- Deciziile sunt consemnate în
  `obsidian-vault/decisions/2026-07-02-fundatia-seo-si-indexare.md` și
  `obsidian-vault/decisions/2026-07-07-domeniu-canonic-despresine-ro.md`.

## DNS necesar

Pentru activarea domeniului apex `despresine.ro`, Cloudflare Pages cere ca
domeniul să fie o zonă Cloudflare în același cont cu proiectul Pages. Pașii
rămași sunt:

1. Configurați redirectul sau aliasul final pentru `www.despresine.ro` către
   `https://despresine.ro`.
2. După revizuirea finală, eliminați protecția temporară cu parolă.

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
- [ ] Configurați redirectul sau aliasul `www.despresine.ro` către
      `https://despresine.ro`.
- [ ] Adăugați `https://despresine.ro` și `https://www.despresine.ro` în
      TinaCloud Site URLs.
- [ ] Permiteți indexarea numai după aprobarea conținutului (înlocuiți
      `Disallow: /` cu `Disallow:`).
- [ ] Verificați cu Silvia titlurile profesionale, experiența și formulările
      practice din toate paginile (starea „draft" din fiecare pagină).
- [ ] Publicați politica de confidențialitate după verificare juridică.
- [ ] Adăugați `og:image` după aprobarea materialelor vizuale de brand.
- [ ] După publicare, verificați pe `https://despresine.ro` URL-urile canonice,
      sitemap-ul și comportamentul robots.txt.

## Surse consultate

- Cloudflare Pages custom domains, accesat 2026-07-07:
  https://developers.cloudflare.com/pages/configuration/custom-domains/
