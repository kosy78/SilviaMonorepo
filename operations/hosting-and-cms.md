# Hosting și administrare blog

Stare: configurare tehnică în curs. Domeniul public nu este încă decis
(2026-07-05).

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

## TinaCMS / TinaCloud

Variabile de mediu necesare în Cloudflare Pages, pentru Production și Preview:

| Nume | Scop | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | identifică proiectul TinaCloud | nu |
| `TINA_TOKEN` | permite build-ului și adminului să comunice cu TinaCloud | da |
| `NEXT_PUBLIC_TINA_BRANCH` | override opțional pentru branch | nu |

Nu salvați valorile reale în repository. Folosiți `website/.env.example` doar ca
șablon.

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

- [ ] Cloudflare Pages construiește branch-ul `main` din directorul `website`.
- [ ] `/` se încarcă pe URL-ul `pages.dev`.
- [ ] `/blog/` se încarcă și nu listează ciorne.
- [ ] `/admin/index.html` afișează TinaCMS.
- [ ] Silvia poate intra în TinaCMS cu contul invitat.
- [ ] Crearea unei ciorne produce un commit în GitHub.
- [ ] Dezactivarea câmpului `draft` publică articolul după rebuild.
- [ ] `robots.txt` rămâne blocat până la alegerea domeniului și aprobarea
      conținutului.

## Surse consultate

- Cloudflare Pages build configuration, accesat 2026-07-05:
  https://developers.cloudflare.com/pages/configuration/build-configuration/
- Cloudflare Pages limits, accesat 2026-07-05:
  https://developers.cloudflare.com/pages/platform/limits/
- TinaCMS Astro setup, accesat 2026-07-05:
  https://tina.io/docs/frameworks/astro
- TinaCMS Cloudflare Pages deployment, accesat 2026-07-05:
  https://tina.io/docs/tinacloud/deployment-options/cloudflare-pages
