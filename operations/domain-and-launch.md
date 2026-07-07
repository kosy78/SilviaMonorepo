# Domeniu și lansare

Stare: pre-lansare pe domeniul canonic `https://despresine.ro`. Configurația
website-ului este actualizată, iar domeniile au fost adăugate în Cloudflare
Pages, dar DNS-ul este încă în verificare.
Ultima verificare operațională: 2026-07-07.

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
  la proiectul `silvia-dinu-website`, dar ambele sunt încă `pending`.
- Verificarea Cloudflare pentru ambele hostnames raportează
  `CNAME record not set`.
- Contul Cloudflare verificat prin API la 2026-07-07 nu are zona DNS
  `despresine.ro`. Tokenul API disponibil poate citi proiectul Pages și adăuga
  custom domains, dar nu are permisiunea necesară pentru crearea zonei DNS.
- Deciziile sunt consemnate în
  `obsidian-vault/decisions/2026-07-02-fundatia-seo-si-indexare.md` și
  `obsidian-vault/decisions/2026-07-07-domeniu-canonic-despresine-ro.md`.

## DNS necesar

Pentru activarea domeniului apex `despresine.ro`, Cloudflare Pages cere ca
domeniul să fie o zonă Cloudflare în același cont cu proiectul Pages. Pașii
rămași sunt:

1. Adăugați zona DNS `despresine.ro` în contul Cloudflare al proiectului Pages
   sau acordați tokenului API permisiunea de creare zone.
2. Configurați la registrar nameserverele returnate de Cloudflare pentru zona
   `despresine.ro`.
3. După propagare, verificați că Pages marchează `despresine.ro` ca `active`.
4. Configurați `www.despresine.ro` ca alias sau redirect către
   `https://despresine.ro`.

Dacă DNS-ul rămâne la un provider extern, subdomeniul `www.despresine.ro` poate
fi verificat cu un CNAME către `silvia-dinu-website.pages.dev`. Pentru domeniul
apex, varianta recomandată rămâne adăugarea zonei în Cloudflare.

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
- [ ] Adăugați zona DNS `despresine.ro` în Cloudflare sau configurați un token
      cu permisiunea de creare zone.
- [ ] Configurați nameserverele Cloudflare la registrar.
- [ ] Verificați că `despresine.ro` este `active` în Cloudflare Pages.
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
