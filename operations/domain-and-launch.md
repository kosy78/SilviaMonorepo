# Domeniu și lansare

Stare: pre-lansare. Domeniul public nu este încă decis (2026-07-02).

## Situația curentă

- `website/astro.config.mjs` folosește domeniul substituent
  `https://silvia-dinu.example` pentru URL-uri canonice și sitemap.
- `website/public/robots.txt` blochează intenționat indexarea (`Disallow: /`)
  deoarece conținutul website-ului este încă draft și domeniul final nu este
  stabilit.
- Decizia este consemnată în
  `obsidian-vault/decisions/2026-07-02-fundatia-seo-si-indexare.md`.

## Checklist de lansare

- [ ] Alegeți și înregistrați domeniul final; documentați aici registrarul,
      DNS-ul și contul de găzduire.
- [ ] Înlocuiți domeniul substituent din `website/astro.config.mjs`.
- [ ] Actualizați adresa `Sitemap:` din `website/public/robots.txt` și
      permiteți indexarea (înlocuiți `Disallow: /` cu `Disallow:`).
- [ ] Verificați cu Silvia titlurile profesionale, experiența și formulările
      practice din toate paginile (starea „draft" din fiecare pagină).
- [ ] Publicați politica de confidențialitate după verificare juridică.
- [ ] Adăugați `og:image` după aprobarea materialelor vizuale de brand.
- [ ] După publicare, verificați pe domeniul final URL-urile canonice,
      sitemap-ul și comportamentul robots.txt.
