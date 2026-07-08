# Website DespreSine

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
- `src/components/islands/` — componente React interactive izolate, inclusiv
  Reflecția ghidată;
- `src/content/blog/` — articole Markdown sau MDX;
- `src/pages/` — rute publice;
- `src/styles/` — tokenuri și stiluri globale.
- `tina/config.ts` — schema TinaCMS pentru administrarea articolelor din blog.

## Blog admin

Articolele sunt fișiere MDX în `src/content/blog/`. TinaCMS oferă o interfață de
editare pentru aceste fișiere și păstrează conținutul în repository.

Adminul live este servit prin site la:

```text
https://despresine.ro/admin/
```

Până la activarea DNS pentru domeniul final, URL-ul operațional de fallback este:

```text
https://silvia-dinu-website.pages.dev/admin/
```

Link direct către lista de articole:

```text
https://despresine.ro/admin/#/collections/blog
```

Fallback până la activarea DNS:

```text
https://silvia-dinu-website.pages.dev/admin/#/collections/blog
```

Silvia trebuie invitată în proiectul TinaCloud ca editor. După autentificare,
poate crea sau edita articole din `Articole blog`. Câmpul `Ciornă` trebuie
păstrat activ până când textul este verificat și aprobat; dezactivarea lui
publică articolul după salvare și rebuild Cloudflare Pages.

Pentru producție, build-ul trebuie să primească următoarele variabile de mediu:

- `NEXT_PUBLIC_TINA_CLIENT_ID`;
- `TINA_TOKEN`;
- opțional `NEXT_PUBLIC_TINA_BRANCH` dacă branch-ul nu este `main`.

În Cloudflare Pages, comanda de build este `pnpm build`, iar directorul de output
este `dist`. Build-ul local folosește automat modul Tina local dacă variabilele
TinaCloud lipsesc. Pe Cloudflare Pages sau în `pnpm build:production`,
variabilele TinaCloud sunt obligatorii.

## Cloudflare

Proiectul este pregătit pentru Cloudflare Pages prin setările proiectului din
Cloudflare Dashboard/API. Nu folosiți `wrangler.jsonc` pentru Git builds în V1,
deoarece poate face ca variabilele TinaCloud configurate în Cloudflare să nu
ajungă la pasul de build.

Comenzi utile:

```sh
pnpm cf:whoami
pnpm deploy:cloudflare
```

Deploy-ul canonical pentru producție trebuie configurat în Cloudflare Pages prin
conectarea repository-ului GitHub, nu prin încărcări manuale repetate.

Domeniul public canonic este `https://despresine.ro`. `www.despresine.ro` poate
fi folosit ca alias sau redirect, dar metadata, sitemap-ul și linkurile publice
trebuie să folosească domeniul apex.

În Cloudflare Pages sunt adăugate `despresine.ro` și `www.despresine.ro`.
Activarea finală depinde de DNS: pentru domeniul apex, `despresine.ro` trebuie
adăugat ca zonă Cloudflare în același cont cu proiectul Pages, iar nameserverele
Cloudflare trebuie configurate la registrar. Dacă DNS-ul rămâne extern,
`www.despresine.ro` poate fi verificat prin CNAME către
`silvia-dinu-website.pages.dev`, dar apexul rămâne obiectivul canonic.

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

Website-ul poate încărca Google Analytics 4 folosind streamul public V1
`G-D490J31F6H`. Variabila publică `PUBLIC_GA_MEASUREMENT_ID` poate suprascrie
această valoare la build time, dacă streamul GA4 se schimbă.

Implementarea GA4 este condiționată de consimțământ explicit:

- setările de consimțământ pornesc cu `analytics_storage` refuzat;
- scriptul Google Analytics este injectat numai după apăsarea butonului
  `Accept`;
- semnalele de advertising și personalizare sunt dezactivate în configurația
  tagului;
- URL-urile trimise către GA4 sunt curățate de query string și fragment;
- evenimentul custom permis în V1 este `contact_email_clicked`, fără emailul
  vizitatorului, mesaj, nume sau context clinic.

Configurația operațională și implicațiile de confidențialitate sunt documentate
în `operations/analytics-and-consent.md`. Orice extindere cu pixeli de
advertising, formulare urmărite, remarketing sau evenimente legate de reflecția
ghidată necesită o decizie separată și revizuire explicită.
