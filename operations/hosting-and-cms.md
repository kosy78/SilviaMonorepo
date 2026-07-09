# Hosting și administrare blog

Stare: website public pe URL-ul Cloudflare Pages. Domeniul canonic
`https://despresine.ro` este adăugat în Cloudflare Pages. Zona DNS Cloudflare
este activă, nameserverele la registrar sunt configurate, iar domeniile custom
sunt active. Site-ul este temporar protejat cu parolă până la revizuirea finală.
Ultima verificare operațională: 2026-07-09.

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

### Stare Cloudflare la 2026-07-09

- Proiectul Cloudflare Pages `silvia-dinu-website` există și este conectat la
  repository-ul GitHub `kosy78/SilviaMonorepo`.
- Project ID: `6b1e5945-ab2a-4a94-90f5-b4246f5cb295`.
- URL-ul Pages rezervat este `https://silvia-dinu-website.pages.dev`.
- Domenii custom adăugate în Pages:
  - `despresine.ro`;
  - `www.despresine.ro`.
- Zona DNS Cloudflare `despresine.ro` există în același cont cu proiectul Pages
  și este `active` din 2026-07-09T06:52:01Z.
- Nameserverele Cloudflare atribuite și salvate la CyberFolks sunt:
  - `louis.ns.cloudflare.com`;
  - `nia.ns.cloudflare.com`.
- Recorduri DNS configurate în Cloudflare:
  - CNAME DNS only `despresine.ro` -> `silvia-dinu-website.pages.dev`;
  - CNAME proxied `www.despresine.ro` -> `silvia-dinu-website.pages.dev`.
- CyberFolks a confirmat salvarea modificării nameserverelor la 2026-07-09.
- Public DNS prin `1.1.1.1` returnează nameserverele Cloudflare și A records
  Cloudflare pentru apex și `www`.
- Verificarea Cloudflare Pages și validarea certificatelor/HTTP sunt `active`
  pentru ambele custom domains.
- `https://despresine.ro`, `https://silvia-dinu-website.pages.dev` și URL-ul
  versionat al deploymentului răspund cu `401` fără credentiale.
- `https://www.despresine.ro` redirecționează cu `308` către apex înaintea
  autentificării și păstrează calea și query string-ul.
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
- La 2026-07-09, după rotația credentialelor Basic Auth, `TINA_TOKEN` trebuie
  reintrodus cu valoarea reală în Cloudflare Pages. Pentru deblocarea
  redeploymentului de protecție cu parolă, `TINA_SKIP_CLOUD_CHECKS=1` este
  configurat temporar pentru Preview și Production.
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
- Deploymentul commitului `040abad` a trecut build-ul și deploy-ul la
  2026-07-09T19:51:27Z. Cloudflare Web Analytics a rămas dezactivat, iar
  variabilele Basic Auth și bindingul intern `CONTACT_MAILER` au rămas
  configurate pentru Production și Preview.
- URL-ul operațional fallback rămâne `https://silvia-dinu-website.pages.dev`;
  URL-ul canonic public este `https://despresine.ro`.

### Protecție temporară cu parolă la 2026-07-09

Site-ul este pus temporar în spatele unei autentificări HTTP Basic Auth, ca să
nu fie accesibil public înainte de revizuirea finală.

- Implementarea este în `website/functions/[[path]].js`, ca Cloudflare Pages
  Function aplicată pe toate rutele site-ului.
- Credentialele sunt configurate în Cloudflare Pages, pentru Production și
  Preview, prin variabilele `SITE_PASSWORD_USER` și `SITE_PASSWORD`.
- Credentialele au fost rotite la 2026-07-09. Nu documentați valorile reale în
  Git.
- `SITE_PASSWORD` este secret în Cloudflare și nu trebuie salvat în Git,
  documentație, capturi de ecran sau fișiere locale commitate.
- Ruta `/.well-known/` este lăsată neprotejată pentru validarea tehnică a
  certificatelor și domeniilor custom.
- Pentru publicarea finală fără parolă, eliminați Pages Function-ul sau
  înlocuiți-l cu o regulă explicită de acces, apoi rulați verificările de
  build/deploy.

## TinaCMS / TinaCloud

Variabile de mediu necesare în Cloudflare Pages, pentru Production și Preview:

| Nume | Scop | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | identifică proiectul TinaCloud | nu |
| `TINA_TOKEN` | permite build-ului să citească din TinaCloud; nu este expus în admin | da |
| `NEXT_PUBLIC_TINA_BRANCH` | override opțional pentru branch | nu |
| `TINA_SKIP_CLOUD_CHECKS` | bypass temporar pentru verificarea branch-ului TinaCloud | nu |
| `SITE_PASSWORD_USER` | username pentru protecția temporară cu parolă | nu |
| `SITE_PASSWORD` | parola pentru protecția temporară cu parolă | da |

Nu salvați valorile reale în repository. Folosiți `website/.env.example` doar ca
șablon.

`NEXT_PUBLIC_TINA_BRANCH` nu trebuie setat global în Cloudflare în V1, deoarece
Cloudflare furnizează `CF_PAGES_BRANCH`, iar un override global ar putea face
preview-urile să editeze branch-ul greșit.

`TINA_SKIP_CLOUD_CHECKS` trebuie folosit doar temporar. Dacă rămâne activ după
ce TinaCloud vede branch-ul `main`, build-ul poate trece fără să confirme că
adminul este conectat corect la branch-ul de producție.

### Stare TinaCloud la 2026-07-09

- Client ID-ul TinaCloud este configurat în Cloudflare, fără valori stocate în
  Git.
- Tokenul real `TINA_TOKEN` trebuie reintrodus în Cloudflare Pages după rotația
  credentialelor Basic Auth; valoarea reală nu este stocată în repository.
- `TINA_SKIP_CLOUD_CHECKS=1` este activ temporar pentru ca build-urile Pages să
  poată trece până la restaurarea tokenului real.
- Branch-ul `main` este disponibil în TinaCloud, dar build-urile curente nu
  confirmă conexiunea la TinaCloud cât timp bypass-ul este activ.
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
- [ ] Reintroduceți tokenul real `TINA_TOKEN` în Cloudflare Pages pentru
      Production și Preview.
- [ ] Eliminați bypass-ul temporar `TINA_SKIP_CLOUD_CHECKS` din Cloudflare
      Pages după restaurarea tokenului real.
- [x] Branch-ul `main` este disponibil în TinaCloud.
- [x] Cloudflare Pages construiește branch-ul `main` din directorul `website`.
- [x] `/` se încarcă pe URL-ul `pages.dev`.
- [x] `/blog/` se încarcă pe URL-ul `pages.dev`.
- [x] `/contact/` se încarcă pe URL-ul `pages.dev`.
- [x] `/admin/` se încarcă pe URL-ul `pages.dev`.
- [x] `/admin/index.html` redirecționează către `/admin/` pe URL-ul `pages.dev`.
- [x] Domeniile `despresine.ro` și `www.despresine.ro` sunt adăugate în
      Cloudflare Pages.
- [x] Zona DNS `despresine.ro` este adăugată în Cloudflare și nameserverele sunt
      configurate la registrar.
- [x] `despresine.ro` este `active` în Cloudflare Pages.
- [x] `www.despresine.ro` redirecționează către domeniul canonic și păstrează
      calea și query string-ul.
- [ ] `https://despresine.ro` și `https://www.despresine.ro` sunt adăugate în
      TinaCloud Site URLs.
- [x] Crearea unei ciorne sau modificări în TinaCMS produce un commit în GitHub.
- [x] Dezactivarea câmpului `draft` publică articolul după rebuild.
- [x] `robots.txt` rămâne blocat până la aprobarea conținutului.

## Verificări locale

Ultima verificare locală: 2026-07-09.

- `pnpm check` trece fără erori.
- `pnpm build` trece în modul local Tina.
- `pnpm test:e2e` trece: 62 teste Playwright pe desktop și mobil, cu 8 skip-uri
  desktop așteptate pentru verificările exclusiv mobile.
- Suita Node pentru Pages Function trece: 8 din 8 teste.
- Testele acoperă accesibilitatea Axe, consimțământul analytics, metadata SEO,
  indexarea blocată, meniul mobil, formularul și Reflecția ghidată.
- `pnpm audit --prod` nu raportează vulnerabilități cunoscute.
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
