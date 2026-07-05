# Hosting și administrare blog

Stare: configurare tehnică în curs. Domeniul public nu este încă decis.
Ultima verificare operațională: 2026-07-05.

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

### Stare Cloudflare la 2026-07-05

- Proiectul Cloudflare Pages `silvia-dinu-website` există și este conectat la
  repository-ul GitHub `kosy78/SilviaMonorepo`.
- Project ID: `6b1e5945-ab2a-4a94-90f5-b4246f5cb295`.
- URL-ul Pages rezervat este `https://silvia-dinu-website.pages.dev`.
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
- Variabilele necesare build-ului au fost configurate și în layerul Cloudflare
  Build Triggers, deoarece primul deployment a confirmat că variabilele runtime
  Pages nu ajungeau singure în procesul de build.
- Deployment-urile inițiale au eșuat deoarece Cloudflare citea
  `website/wrangler.jsonc` ca sursă de configurație și raporta
  `Build environment variables: (none found)`. Fișierul a fost eliminat; setările
  proiectului Cloudflare Pages rămân sursa canonică pentru Git builds.
- Nu există încă deployment canonic reușit după eliminarea fișierului
  `wrangler.jsonc`.
- Contul Cloudflare verificat prin API nu are zone DNS active, deci domeniul
  final nu poate fi conectat până când domeniul nu este ales și adăugat în
  Cloudflare.

## TinaCMS / TinaCloud

Variabile de mediu necesare în Cloudflare Pages, pentru Production și Preview:

| Nume | Scop | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | identifică proiectul TinaCloud | nu |
| `TINA_TOKEN` | permite build-ului și adminului să comunice cu TinaCloud | da |
| `NEXT_PUBLIC_TINA_BRANCH` | override opțional pentru branch | nu |

Nu salvați valorile reale în repository. Folosiți `website/.env.example` doar ca
șablon.

`NEXT_PUBLIC_TINA_BRANCH` nu trebuie setat global în Cloudflare în V1, deoarece
Cloudflare furnizează `CF_PAGES_BRANCH`, iar un override global ar putea face
preview-urile să editeze branch-ul greșit.

## URL-uri până la domeniul final

Până la alegerea domeniului, Cloudflare va oferi un URL de forma:

```text
https://silvia-dinu-website.pages.dev
```

Adminul Tina va fi:

```text
https://silvia-dinu-website.pages.dev/admin/index.html
```

## Verificări după conectare

- [x] Integrarea GitHub din Cloudflare Pages este reinstalată sau reautorizată.
- [x] Proiectul Pages `silvia-dinu-website` este conectat la
      `kosy78/SilviaMonorepo`.
- [x] Variabilele TinaCloud reale sunt adăugate în Cloudflare Pages pentru
      Production și Preview.
- [x] Variabilele TinaCloud reale sunt adăugate în Cloudflare Build Triggers
      pentru build time.
- [ ] Cloudflare Pages construiește branch-ul `main` din directorul `website`.
- [ ] `/` se încarcă pe URL-ul `pages.dev`.
- [ ] `/blog/` se încarcă și nu listează ciorne.
- [ ] `/admin/index.html` afișează TinaCMS.
- [ ] Silvia poate intra în TinaCMS cu contul invitat.
- [ ] Crearea unei ciorne produce un commit în GitHub.
- [ ] Dezactivarea câmpului `draft` publică articolul după rebuild.
- [ ] `robots.txt` rămâne blocat până la alegerea domeniului și aprobarea
      conținutului.

## Verificări locale

Ultima verificare locală: 2026-07-05.

- `pnpm check` trece fără erori.
- `pnpm build` trece în modul local Tina.
- `pnpm test:e2e` trece: 12 teste Playwright pe desktop și mobil, inclusiv
  verificări de accesibilitate Axe.

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
- TinaCMS Astro setup, accesat 2026-07-05:
  https://tina.io/docs/frameworks/astro
- TinaCMS Cloudflare Pages deployment, accesat 2026-07-05:
  https://tina.io/docs/tinacloud/deployment-options/cloudflare-pages
