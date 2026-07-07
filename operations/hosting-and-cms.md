# Hosting și administrare blog

Stare: website public pe URL-ul Cloudflare Pages. Domeniul canonic
`https://despresine.ro` este adăugat în Cloudflare Pages, dar așteaptă
activarea DNS.
Ultima verificare operațională: 2026-07-07.

## Decizie operațională

Website-ul este pregătit pentru:

- GitHub ca repository canonic;
- Cloudflare Pages pentru hosting și build-uri automate;
- TinaCMS/TinaCloud pentru autentificarea editorului și administrarea articolelor
  din blog.

Conținutul blogului rămâne în `website/src/content/blog/` ca fișiere MDX.
TinaCMS salvează modificările prin commit-uri în GitHub, iar Cloudflare Pages
reconstruiește site-ul după modificări.

## Cloudflare Pages

Setări recomandate pentru proiectul Pages:

- Project name: `silvia-dinu-website`;
- Repository: `kosy78/SilviaMonorepo`;
- Production branch: `main`;
- Root directory: `website`;
- Build command: `pnpm build`;
- Build output directory: `dist`;
- Environment variable opțională dacă pnpm nu este detectat:
  `PACKAGE_MANAGER=pnpm`.

Cloudflare Pages injectează `CF_PAGES_BRANCH` la build time. Configurația Tina
îl folosește pentru a ști branch-ul curent.

Build-ul local folosește modul Tina local când variabilele TinaCloud lipsesc.
Build-ul Cloudflare eșuează intenționat dacă `NEXT_PUBLIC_TINA_CLIENT_ID` sau
`TINA_TOKEN` nu sunt setate, ca să nu fie publicat un admin nefuncțional.

Proiectul trebuie creat ca proiect conectat la GitHub, nu ca proiect
`Direct Upload`. Un proiect Cloudflare Pages creat ca `Direct Upload` nu poate
fi convertit ulterior prin API într-un proiect conectat la GitHub.

### Stare Cloudflare la 2026-07-07

- Proiectul Cloudflare Pages `silvia-dinu-website` există și este conectat la
  repository-ul GitHub `kosy78/SilviaMonorepo`.
- Project ID: `6b1e5945-ab2a-4a94-90f5-b4246f5cb295`.
- URL-ul Pages rezervat este `https://silvia-dinu-website.pages.dev`.
- Domenii custom adăugate în Pages:
  - `despresine.ro`;
  - `www.despresine.ro`.
- Starea domeniilor custom în Pages este `pending`. Verificarea Cloudflare
  raportează `CNAME record not set` pentru ambele hostnames.
- Contul Cloudflare verificat prin API nu are zona DNS `despresine.ro`.
  Încercarea de creare a zonei prin API a eșuat deoarece tokenul disponibil nu
  are permisiunea `com.cloudflare.api.account.zone.create`.
- Pentru activarea apexului `despresine.ro`, domeniul trebuie adăugat ca zonă
  Cloudflare în același cont cu proiectul Pages, iar nameserverele returnate de
  Cloudflare trebuie configurate la registrar.
- Dacă DNS-ul rămâne la un provider extern, `www.despresine.ro` poate fi
  verificat cu un CNAME către `silvia-dinu-website.pages.dev`, dar domeniul
  canonic rămâne `https://despresine.ro`.
- Build settings:
  - Production branch: `main`;
  - Root directory: `website`;
  - Build command: `pnpm build`;
  - Build output directory: `dist`.
- Variabile plain-text configurate pentru Preview și Production:
  - `NODE_VERSION=22`;
  - `PACKAGE_MANAGER=pnpm`.
- Variabile TinaCloud configurate pentru Preview și Production:
  - `NEXT_PUBLIC_TINA_CLIENT_ID`;
  - `TINA_TOKEN`, ca secret.
- Variabila temporară `TINA_SKIP_CLOUD_CHECKS` nu mai este configurată în Pages.
- Variabilele necesare build-ului au fost configurate și în layerul Cloudflare
  Build Triggers, deoarece primul deployment a confirmat că variabilele runtime
  Pages nu ajungeau singure în procesul de build.
- Deployment-urile inițiale au eșuat deoarece Cloudflare citea
  `website/wrangler.jsonc` ca sursă de configurație și raporta
  `Build environment variables: (none found)`. Fișierul a fost eliminat; setările
  proiectului Cloudflare Pages rămân sursa canonică pentru Git builds.
- Primul deployment după eliminarea fișierului `wrangler.jsonc` a ajuns la
  build-ul TinaCMS, dar a eșuat deoarece TinaCloud nu indexase încă branch-ul
  `main`.
- Deployment-ul commitului `8a8a2df` a trecut build-ul și deploy-ul fără
  bypass-ul Tina la 2026-07-05.
- Ultimul deployment citit prin API la 2026-07-07 este commitul `84d7141`,
  declanșat de TinaCMS, cu status `success`.
- URL-ul operațional până la activarea DNS rămâne
  `https://silvia-dinu-website.pages.dev`; URL-ul canonic public este
  `https://despresine.ro`.

## TinaCMS / TinaCloud

Variabile de mediu necesare în Cloudflare Pages, pentru Production și Preview:

| Nume | Scop | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | identifică proiectul TinaCloud | nu |
| `TINA_TOKEN` | permite build-ului să citească din TinaCloud; nu este expus în admin | da |
| `NEXT_PUBLIC_TINA_BRANCH` | override opțional pentru branch | nu |
| `TINA_SKIP_CLOUD_CHECKS` | bypass temporar pentru verificarea branch-ului TinaCloud | nu |

Nu salvați valorile reale în repository. Folosiți `website/.env.example` doar ca
șablon.

`NEXT_PUBLIC_TINA_BRANCH` nu trebuie setat global în Cloudflare în V1, deoarece
Cloudflare furnizează `CF_PAGES_BRANCH`, iar un override global ar putea face
preview-urile să editeze branch-ul greșit.

`TINA_SKIP_CLOUD_CHECKS` trebuie folosit doar temporar. Dacă rămâne activ după
ce TinaCloud vede branch-ul `main`, build-ul poate trece fără să confirme că
adminul este conectat corect la branch-ul de producție.

### Stare TinaCloud la 2026-07-07

- Client ID-ul TinaCloud și tokenul de conținut sunt configurate în Cloudflare,
  fără valori stocate în Git.
- Branch-ul `main` este disponibil în TinaCloud; build-ul Cloudflare trece fără
  `TINA_SKIP_CLOUD_CHECKS`.
- Adminul Tina a putut declanșa commituri în GitHub, iar Cloudflare a publicat
  deploymenturi de producție după acele commituri.
- Site URLs din TinaCloud trebuie actualizate cu domeniul final înainte de
  testarea loginului pe `https://despresine.ro/admin/`.

## URL-uri operaționale

URL canonic public, după activarea DNS:

```text
https://despresine.ro
```

Fallback operațional Cloudflare Pages până la activarea DNS:

```text
https://silvia-dinu-website.pages.dev
```

Adminul Tina pe domeniul final:

```text
https://despresine.ro/admin/
```

Adminul Tina pe fallback:

```text
https://silvia-dinu-website.pages.dev/admin/
```

Link direct către colecția de articole:

```text
https://silvia-dinu-website.pages.dev/admin/#/collections/blog
```

Link direct către colecția de articole pe domeniul final:

```text
https://despresine.ro/admin/#/collections/blog
```

## Workflow editor pentru Silvia

Condiție inițială: Silvia trebuie adăugată în TinaCloud ca project collaborator
cu rol de `Editor` sau `Admin`. Pentru scrierea articolelor este suficient rolul
`Editor`.

Fluxul normal de lucru:

1. Deschide `https://despresine.ro/admin/` după activarea DNS sau
   `https://silvia-dinu-website.pages.dev/admin/` ca fallback operațional.
2. Se autentifică în TinaCloud cu adresa invitată.
3. Intră în `Articole blog`.
4. Creează un articol nou sau deschide un articol existent.
5. Lasă câmpul `Ciornă` activ cât timp articolul nu este aprobat. În această
   stare, articolul este salvat în repository, dar nu apare public pe site.
6. Apasă `Save`. TinaCMS salvează modificarea ca un commit în GitHub, iar
   Cloudflare Pages reconstruiește site-ul.
7. Pentru publicare, dezactivează `Ciornă` numai după verificare și aprobare,
   apoi apasă din nou `Save`.
8. După finalizarea rebuild-ului Cloudflare, verifică articolul în `/blog/`.

Reguli editoriale importante pentru articole:

- public copy în română, cu diacritice;
- adresare implicită cu `dumneavoastră`;
- fără diagnosticare, promisiuni de rezultat sau formulări alarmiste;
- fără telefon public, prețuri sau adresă exactă;
- fără informații despre clienți, pacienți sau situații identificabile.

Troubleshooting rapid:

- Dacă loginul nu apare sau este refuzat, verificați în TinaCloud că URL-ul
  site-ului este permis și că Silvia este adăugată în proiect ca collaborator.
- Dacă un articol salvat nu apare public, verificați dacă `Ciornă` este
  dezactivat și dacă ultimul deployment Cloudflare Pages s-a terminat cu succes.
- Dacă salvarea eșuează, verificați că branch-ul `main` este disponibil și
  indexat în TinaCloud.

## Verificări după conectare

- [x] Integrarea GitHub din Cloudflare Pages este reinstalată sau reautorizată.
- [x] Proiectul Pages `silvia-dinu-website` este conectat la
      `kosy78/SilviaMonorepo`.
- [x] Variabilele TinaCloud reale sunt adăugate în Cloudflare Pages pentru
      Production și Preview.
- [x] Variabilele TinaCloud reale sunt adăugate în Cloudflare Build Triggers
      pentru build time.
- [x] Branch-ul `main` este disponibil în TinaCloud fără bypass.
- [x] Bypass-ul temporar `TINA_SKIP_CLOUD_CHECKS` este eliminat din Cloudflare
      Pages.
- [x] Cloudflare Pages construiește branch-ul `main` din directorul `website`.
- [x] `/` se încarcă pe URL-ul `pages.dev`.
- [x] `/blog/` se încarcă pe URL-ul `pages.dev`.
- [x] `/contact/` se încarcă pe URL-ul `pages.dev`.
- [x] `/admin/` se încarcă pe URL-ul `pages.dev`.
- [x] `/admin/index.html` redirecționează către `/admin/` pe URL-ul `pages.dev`.
- [x] Domeniile `despresine.ro` și `www.despresine.ro` sunt adăugate în
      Cloudflare Pages.
- [ ] Zona DNS `despresine.ro` este adăugată în Cloudflare și nameserverele sunt
      configurate la registrar.
- [ ] `despresine.ro` este `active` în Cloudflare Pages.
- [ ] `www.despresine.ro` redirecționează sau rezolvă către domeniul canonic.
- [ ] `https://despresine.ro` și `https://www.despresine.ro` sunt adăugate în
      TinaCloud Site URLs.
- [x] Crearea unei ciorne sau modificări în TinaCMS produce un commit în GitHub.
- [x] Dezactivarea câmpului `draft` publică articolul după rebuild.
- [x] `robots.txt` rămâne blocat până la aprobarea conținutului.

## Verificări locale

Ultima verificare locală: 2026-07-07.

- `pnpm check` trece fără erori.
- `pnpm build` trece în modul local Tina.
- `pnpm test:e2e` trece: 12 teste Playwright pe desktop și mobil, inclusiv
  verificări de accesibilitate Axe.
- Build-ul generat folosește `https://despresine.ro` în `robots.txt` și
  `sitemap-0.xml`; șablonul intern de blog rămâne `draft: true` și nu apare în
  sitemap.

## Surse consultate

- Cloudflare Pages build configuration, accesat 2026-07-05:
  https://developers.cloudflare.com/pages/configuration/build-configuration/
- Cloudflare Pages API pentru proiecte și variabile de mediu, accesat
  2026-07-05:
  https://developers.cloudflare.com/api/resources/pages/subresources/projects/methods/edit/
- Cloudflare Pages limits, accesat 2026-07-05:
  https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Pages Build Image V3 / Node.js 22 implicit, accesat 2026-07-05:
  https://developers.cloudflare.com/changelog/post/2025-05-30-pages-build-image-v3/
- Cloudflare Workers and Pages GitHub integration troubleshooting, accesat
  2026-07-05:
  https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/
- Cloudflare Workers Builds API reference, accesat 2026-07-05:
  https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/
- Cloudflare Pages custom domains, accesat 2026-07-07:
  https://developers.cloudflare.com/pages/configuration/custom-domains/
- TinaCMS Astro setup, accesat 2026-07-05:
  https://tina.io/docs/frameworks/astro
- TinaCMS Cloudflare Pages deployment, accesat 2026-07-05:
  https://tina.io/docs/tinacloud/deployment-options/cloudflare-pages
- TinaCloud troubleshooting pentru branch indexing, accesat 2026-07-05:
  https://tina.io/docs/tinacloud/troubleshooting
- TinaCMS editing experience, accesat 2026-07-05:
  https://tina.io/docs/using-tina-editor
- TinaCloud dashboard și project collaborators, accesat 2026-07-05:
  https://tina.io/docs/tinacloud/dashboard
  https://tina.io/docs/tinacloud/dashboard/users
