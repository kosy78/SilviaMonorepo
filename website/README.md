# Website Silvia Dinu

Fundația tehnică a website-ului este construită cu Astro, TypeScript, Tailwind
CSS și React pentru insule interactive izolate.

## Comenzi

```sh
pnpm install
pnpm dev
pnpm check
pnpm test:e2e
pnpm build
```

`pnpm dev` pornește Astro împreună cu TinaCMS. Interfața de administrare pentru
articole este disponibilă local la `/admin/index.html`.

Pentru a porni Astro fără TinaCMS:

```sh
pnpm dev:astro
```

## Structură

- `src/components/ui/` — primitive reutilizabile;
- `src/components/layout/` — antet, subsol și structură de pagină;
- `src/components/sections/` — secțiuni editoriale reutilizabile;
- `src/components/islands/` — viitoare componente React interactive;
- `src/content/blog/` — articole Markdown sau MDX;
- `src/pages/` — rute publice;
- `src/styles/` — tokenuri și stiluri globale.
- `tina/config.ts` — schema TinaCMS pentru administrarea articolelor din blog.

## Blog admin

Articolele sunt fișiere MDX în `src/content/blog/`. TinaCMS oferă o interfață de
editare pentru aceste fișiere și păstrează conținutul în repository.

Pentru producție, build-ul trebuie să primească următoarele variabile de mediu:

- `NEXT_PUBLIC_TINA_CLIENT_ID`;
- `TINA_TOKEN`;
- opțional `NEXT_PUBLIC_TINA_BRANCH` dacă branch-ul nu este `main`.

În Cloudflare Pages, comanda de build este `pnpm build`, iar directorul de output
este `dist`. Build-ul local folosește automat modul Tina local dacă variabilele
TinaCloud lipsesc. Pe Cloudflare Pages sau în `pnpm build:production`,
variabilele TinaCloud sunt obligatorii.

## Cloudflare

Proiectul este pregătit pentru Cloudflare Pages prin `wrangler.jsonc`.

Comenzi utile:

```sh
pnpm cf:whoami
pnpm deploy:cloudflare
```

Deploy-ul canonical pentru producție trebuie configurat în Cloudflare Pages prin
conectarea repository-ului GitHub, nu prin încărcări manuale repetate.

## Starea conținutului

Textele incluse în scaffold sunt drafturi de lucru. Titlurile profesionale,
formulările despre experiență și orice afirmație profesională sau juridică
trebuie verificate cu Silvia înainte de publicare.

## Figma

Designurile aprobate vor fi implementate prin maparea variabilelor Figma în
`src/styles/tokens.css`, apoi prin ajustarea componentelor reutilizabile. Nu
adăugați valori vizuale izolate într-o pagină dacă ele reprezintă un token sau
un pattern comun.

## Date și servicii externe

Scaffold-ul nu include analytics, cookies, fonturi externe, baze de date sau
procesarea formularului de contact. Alegerea unui furnizor pentru email necesită
o decizie separată și o evaluare a implicațiilor de confidențialitate.
