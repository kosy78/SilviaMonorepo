# Hosting și publicarea blogului

Procedură actualizată la 2026-09-24. Eliminarea TinaCMS și MDX este integrată în
`main` prin [PR #13](https://github.com/kosy78/SilviaMonorepo/pull/13), commit
`f4138b7a72d0994ddd2895583824fdae7c99d9b5`. CI-ul inițial, preview-ul și
deploymentul Pages de producție au trecut. Configurația externă Tina a fost
retrasă, cu integrarea GitHub suspendată reversibil. Site-ul rămâne protejat în
prelansare; această verificare tehnică nu aprobă lansarea publică sau conținutul.

## Responsabilități și flux editorial

Repository-ul GitHub `kosy78/SilviaMonorepo` rămâne sursa canonică. Cosmin
coordonează modificările tehnice și publicarea prin Codex sau Git; Silvia
revizuiește conținutul profesional. Nu documentați identități de cont presupuse
sau credentiale în repository.

Articolele sunt fișiere Markdown în `website/src/content/blog/`. Instrucțiunile
canonice pentru redactare, media, preview, aprobare și publicare sunt în
[website/README.md](../website/README.md#scrierea-și-publicarea-articolelor).
Nu există un admin de blog în noul build. `draft: true` exclude articolul din
listă, rută și sitemap; `publishedAt` nu programează publicarea.

Decizia curentă este
[2026-09-24 — Simplificarea blogului și a build-ului](../obsidian-vault/decisions/2026-09-24-simplificare-blog-si-build.md).
Ea înlocuiește numai TinaCMS/MDX și procedura de build din
[decizia din 2026-07-05](../obsidian-vault/decisions/2026-07-05-cloudflare-pages-si-tinacms.md).
Hostingul Cloudflare Pages și protecția de prelansare rămân.

## Cloudflare Pages

Configurația website-ului:

| Setare               | Valoare                                 |
| -------------------- | --------------------------------------- |
| Proiect              | `silvia-dinu-website`                   |
| Repository           | `kosy78/SilviaMonorepo`                 |
| Branch de producție  | `main`                                  |
| Director rădăcină    | `website`                               |
| Comandă de build     | `pnpm build`                            |
| Output               | `dist`                                  |
| Domeniu canonic      | `https://despresine.ro`                 |
| Fallback operațional | `https://silvia-dinu-website.pages.dev` |

Setările proiectului din Cloudflare Dashboard sunt sursa operațională pentru
Git builds. Păstrați versiunea Node compatibilă cu `website/package.json` și
versiunea pnpm din `packageManager`. Build-ul nu necesită variabile TinaCloud și
nu trebuie condiționat de disponibilitatea acestui serviciu.

La 2026-09-24, cache-ul Pages a fost găsit dezactivat și a fost activat în
Dashboard. Citirea ulterioară dintr-o fereastră independentă a confirmat
persistența setării `Enabled`. Verificați în logurile următorului build dacă
există restaurare și salvare de cache; setarea activă nu dovedește singură un
câștig de timp.

Aceeași verificare a confirmat filtrul include `website/*`, fără excluderi,
raportat la rădăcina repository-ului. Filtrul include articolele Markdown,
activele publice, codul, Functions, dependențele și configurația website-ului.
Au fost reconfirmate `main`, `pnpm build`, `dist`, root `website` și bindingul
`CONTACT_MAILER` către `despresine-contact-mailer`. La mutarea unor intrări de
build în afara `website/`, actualizați filtrul înaintea mutării.

Autentificarea Wrangler prin OAuth a fost verificată la aceeași dată pentru
contul Cloudflare al proiectului. Confirmați contul înaintea oricărei schimbări
ulterioare; nu salvați datele de autentificare în repository.

Pipeline-ul GitHub Actions verifică schimbările și este separat de deploymentul
Pages. Cache-ul de imagini Astro din CI, anularea execuțiilor depășite și
paralelizarea testelor reduc timpul verificărilor; nu presupuneți că reduc în
aceeași măsură timpul până la publicare. Păstrați verificările obligatorii pentru
pull request-uri compatibile cu orice filtrare a workflow-ului.

La 2026-09-24 a fost identificat separat serviciul Workers neutilizat
`silvia-dinu-website`: fără domenii/rute, cu URL-urile `workers.dev` și preview
dezactivate, fără bindings runtime sau triggere cron, queue ori email. Build-ul
său Git rula `pnpm build`, apoi `npx wrangler deploy`, din rădăcina repository-ului
(`/`) și eșua cu `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`.

A fost deconectat numai repository-ul Git al acestui Worker. Citirea ulterioară
a setării a confirmat `Git repository` → `Connect`. Resursa Workers este
păstrată; proiectul Pages și `despresine-contact-mailer` nu au fost modificate
de această acțiune. Acest rezultat confirmă oprirea configurației redundante de
build, nu un deployment al codului fără CMS.

## Protecție de prelansare și servicii păstrate

Site-ul rămâne protejat prin HTTP Basic Auth în
`website/functions/[[path]].js`. Pentru Production și Preview se păstrează:

| Nume                 | Scop                                    | Secret? |
| -------------------- | --------------------------------------- | ------- |
| `SITE_PASSWORD_USER` | utilizatorul protecției de prelansare   | nu      |
| `SITE_PASSWORD`      | parola protecției de prelansare         | da      |
| `CONTACT_MAILER`     | service binding către Workerul de email | binding |

Nu salvați valorile în Git, documentație sau capturi. Ruta `/.well-known/`
rămâne excepția tehnică pentru validarea certificatelor și domeniilor.
Eliminarea parolei necesită o decizie separată de lansare; simplificarea
build-ului nu o autorizează.

Formularul folosește Pages Function `POST /api/contact` și Workerul intern
`despresine-contact-mailer`, definit în
`website/workers/wrangler.contact-mailer.jsonc`. Păstrați bindingul în Production
și Preview. Workerul de email nu trebuie confundat cu un eventual build Workers
redundant al website-ului. Nu modificați serviciul de email pentru a opri un
trigger de website.

Domeniul `www.despresine.ro` rămâne alias/redirect spre apex. Verificați DNS,
custom domains și răspunsurile HTTP la fiecare release. Un `401` fără credentiale
este răspunsul așteptat al site-ului protejat, dar nu dovedește singur ce conținut
este în spatele autentificării. Cloudflare Web Analytics rămâne dezactivat;
configurația GA4 și consimțământul nu se schimbă.

## Retragerea TinaCMS

La 2026-09-24, verificarea prin GitHub API a tuturor celor 9 branch-uri remote a
găsit numai același `draft-template.mdx`, cu blob SHA
`2436353e9f3e9ec3e4c29221993e091011850f1b`, și niciun director
`website/public/uploads/`. Nu există alte ciorne sau media salvate în aceste
locuri din repository. Această verificare nu poate demonstra existența sau
absența textelor nesalvate într-un browser.

Procedura urmată pentru retragerea configurației:

1. Confirmați toate articolele și ciornele în Git, inclusiv branch-urile cu
   modificări editoriale relevante; nu presupuneți că un draft nesalvat în
   browser este în repository.
2. Verificați build-ul nou: nu conține `dist/admin/`, fișiere Tina sau articolele
   din testele temporare. Fișierele admin generate anterior și ignorate de Git
   nu trebuie copiate în `dist/`.
3. Publicați și verificați commitul fără CMS, inclusiv `/blog/`, un articol
   aprobat dacă există și absența adminului. Pe site-ul protejat, un `401` pentru
   `/admin/` confirmă doar protecția; verificați și artefactul sau accesul
   autorizat pentru a demonstra eliminarea adminului.
4. Păstrați deploymentul anterior reușit pentru rollback, apoi eliminați
   configurația Tina neutilizată din Production, Preview și orice Build Trigger
   separat: `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`,
   `NEXT_PUBLIC_TINA_BRANCH`, `TINA_SKIP_CLOUD_CHECKS`, `TINA_REQUIRE_CLOUD`, dacă
   există. Verificați numai numele și starea, fără a extrage valori secrete.
5. Retrageți conexiunea TinaCloud la acest repository numai după confirmarea
   ciornelor și a noului flux. Nu revocați o integrare GitHub comună altor
   proiecte. Conexiunea Git a Workerului redundant identificat mai sus a fost
   deja retrasă separat; nu modificați Workerul de email.

După deploymentul de producție din 2026-09-24, `TINA_TOKEN`,
`NEXT_PUBLIC_TINA_CLIENT_ID` și `TINA_SKIP_CLOUD_CHECKS` au fost eliminate din
Production și Preview prin Wrangler. Citirea ulterioară prin CLI și dintr-un
Dashboard reîncărcat a confirmat absența lor. `SITE_PASSWORD`,
`SITE_PASSWORD_USER` și `CONTACT_MAILER` către `despresine-contact-mailer` sunt
păstrate în ambele medii; secretul Google Maps din Production este păstrat.

Webhook-ul Tina cu ID `649618068` a fost dezactivat, cu readback `active: false`.
După reautentificarea GitHub de către utilizator, instalarea Tina cu ID
`144551000` a fost inspectată: avea selectat numai `SilviaMonorepo`. Instalarea
a fost suspendată, fără dezinstalare; reîncărcarea paginii a confirmat suspendarea
de către utilizator la 2026-09-24. Retragerea conexiunii externe este astfel
confirmată printr-o măsură reversibilă, fără afectarea altor repository-uri.
Nu reactivați Tina pentru un build al noului cod.

### Curățarea unui checkout folosit anterior cu Tina

După actualizarea la codul fără CMS, verificați o singură dată directoarele
generate `website/public/admin/`, `website/tina/__generated__/` și
`website/dist/`. Dacă au rămas din build-uri vechi, eliminați numai aceste
directoare generate și rulați din nou `pnpm build` din `website/`. Nu ștergeți
conținut editorial, media sau alte modificări locale. Un checkout nou nu
conține aceste resturi.

Intrările istorice `public/admin/` și `tina/__generated__/` rămân în
`website/.gitignore` pentru a împiedica adăugarea accidentală a resturilor din
checkout-uri vechi. Ele nu activează Tina și nu înlocuiesc curățarea:
`public/admin/` poate fi copiat în output de Astro chiar dacă este ignorat de
Git. `dist/` rămâne ignorat deoarece este output generat.

## Verificare, măsurare și rollback

Pentru codul nou, rulați din `website/`:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm test:blog
pnpm test:e2e
```

`pnpm test:e2e` construiește proaspăt înaintea testelor Functions și browser.
`pnpm test:e2e:prebuilt` este doar o scurtătură explicită pentru un build reușit
al aceluiași checkout, fără schimbări ulterioare. Serverul de verificare trebuie
să servească acel checkout. Testul de blog folosește conținut temporar izolat,
inclusiv o ciornă; nu îl copiați în producție.

Înregistrați separat durata unui build rece, durata cu cache, timpul de la push
până la deploymentul Pages reușit și timpul până la încheierea verificărilor CI.
Comparați medii similare; numărul de dependențe sau un singur build local nu
constituie dovada timpului de publicare în cloud.

### Măsurători locale din 2026-09-24

În checkout-ul de implementare, fără TinaCMS și MDX:

| Verificare                                              | Rezultat local                                                                 |
| ------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Instalare în checkout curat, cu store pnpm deja populat | 3,4 s                                                                          |
| Build Astro complet, fără cache de imagini              | 8,84 s total; 90 de imagini generate în 5,84 s                                 |
| Build Astro complet, cu cache de imagini                | 1,53 s total; 90 de imagini reutilizate în 12 ms                               |
| `pnpm test:blog`                                        | 1,59 s total; build temporar pentru rutele reale de blog și conținutul de test |
| Verificarea codului                                     | 0 erori raportate                                                              |

Timpii totali sunt durate reale de execuție locală. Instalarea nu măsoară un
download rece, iar testul de blog nu construiește întregul site. Aceste valori
nu sunt comparabile direct cu runnerul GitHub Actions sau cu Pages și nu
confirmă încă viteza unui deployment în cloud.

Suita completă `test:e2e:prebuilt` a durat local 120,31 s cu un worker și
60,73 s cu doi workers. Ambele rulări au avut 196 de teste Playwright trecute și
14 omise intenționat în funcție de viewport, fără eșecuri sau reluări; testele
Functions au trecut în ambele rulări. Configurația CI folosește acum 2 workers.
Măsurarea de mai sus este locală; rezultatul de pe runnerul CI este documentat
separat mai jos.

### Verificări remote din 2026-09-24

PR #13 a fost integrat în `main` la commitul
`f4138b7a72d0994ddd2895583824fdae7c99d9b5`. Rularea CI inițială a schimbării a
trecut în 5 min 47 s pentru workflow și 5 min 31 s pentru job. Cele 196 de teste
Playwright au trecut, cu 14 omise intenționat pentru viewport; Functions a
trecut. Durata workflow-ului este cu aproximativ 21% sub mediana precedentă de
7 min 17 s. Aceasta este o observație pentru prima rulare, nu o garanție pentru
rulările viitoare.

Build-ul Astro rece din CI a durat 51,28 s, dintre care 48,17 s pentru imagini;
cache-urile au fost salvate. Timpii sunt specifici runnerului CI și nu sunt o
comparație directă cu măsurătorile locale.

Preview-ul Pages reluat, deployment
`8f1fb4ed-2b75-4f51-a884-04a98c3745f1`, a reușit în 1 min 36 s: clonare 4 s,
build 1 min 10 s și deploy 20 s, conform etapelor afișate. Logurile confirmă
încărcarea cache-urilor. Răspunsul HTTP `401` fără autentificare confirmă
păstrarea protecției, fără a demonstra singur conținutul paginilor protejate.

Prima încercare de preview, identificată prin `cae2da66`, a eșuat după
7 min 15 s în clonarea Git, cu o eroare de rețea HTTP/2, înaintea build-ului.
Aceasta este înregistrată separat ca eroare de infrastructură și nu intră în
măsurarea duratei de build a codului.

Deploymentul de producție `1fac33cb-e76a-4c48-8d58-357102f854d4`, pentru
`f4138b7a72d0994ddd2895583824fdae7c99d9b5`, a reușit la
`2026-09-24T16:37:03Z`, în 1 min 48 s. Aliasurile domeniului canonic și `www` au
fost confirmate pe acest deployment. Domeniul canonic și URL-ul imutabil al
deploymentului au răspuns cu `401` fără autentificare, conform protecției de
prelansare.

Logurile Pages confirmă restaurarea cache-urilor și reutilizarea tuturor celor
90 de imagini (`reused cache entry`). Restaurarea cache-ului de dependențe a
durat 64 s; durata totală de 1 min 48 s este mai mare decât cele 1 min 36 s ale
preview-ului rece. Cache-ul a evitat regenerarea imaginilor, dar această rulare
nu dovedește o reducere a timpului total de deployment.

Arborele celor 159 de fișiere încărcate în Production Assets a fost inspectat:
nu există admin, iar `blog/` conține numai `index.html`, fără ciorne sau exemple
de test. Verificarea artefactului confirmă eliminarea adminului și excluderea
conținutului temporar; răspunsul `401` singur nu ar fi dovedit acest lucru.
Rularea CI de pe `main`,
[36028403013](https://github.com/kosy78/SilviaMonorepo/actions/runs/36028403013),
a identificat o măsurare prematură în testul existent al logo-ului din footer:
195 de teste au trecut, iar unul a comparat poziția înaintea încheierii animației
de intrare. Testul a fost corectat să aștepte starea finală a animației, păstrând
comparația exactă a poziției la hover. Nu s-a schimbat interfața. Verificarea
locală repetată a trecut de 60 de ori, cu doi workers și fără retry; confirmarea
CI a corecției a trecut în rularea
[36029573484](https://github.com/kosy78/SilviaMonorepo/actions/runs/36029573484).
Acea rulare a avut un retry într-un alt test de dimensiuni: panoul de
consimțământ era încă în animația de scalare. Și acest test a fost corectat să
aștepte animația reală, fără schimbarea butoanelor sau a pragului de 44 px;
30 de repetări desktop/mobil au trecut cu doi workers, fără retry.

Corecțiile sunt publicate în commitul `07b4911214636abd16e7548ec3127889d666a46f`.
[Verificarea CI finală, 36030557599](https://github.com/kosy78/SilviaMonorepo/actions/runs/36030557599),
a trecut în 4 min 26 s (jobul website: 4 min 11 s): 196 de teste browser trecute,
14 omise intenționat, fără retry sau teste instabile, plus 22 de teste Functions
și testul blogului. Ambele cache-uri au fost restaurate; instalarea a durat
3,7 s, build-ul Astro 2,81 s, iar etapa celor 90 de imagini 43 ms. Durata
workflow-ului este cu aproximativ 39% sub mediana celor trei rulări anterioare;
aceasta este o măsurare cu cache și nu o garanție pentru orice release.
Deploymentul Production asociat este
`8c271738-630c-431d-bb0c-f5d8e85c0b9a`; Pages a raportat succes la
16:54:54 UTC, aproximativ 50 s după declanșarea de la push. Aceasta este o
măsurare până la confirmarea Pages, distinctă de durata internă din Dashboard.
Domeniul canonic continuă să răspundă `401` fără autentificare.

Checkout-ul de lucru a fost actualizat, dependențele reinstalate curat și
resturile vechii instalări eliminate. Un build ulterior cu cache în acest
checkout a durat 2,51 s, iar preview-ul local a răspuns `200`. Modificarea
locală preexistentă din `HomepageAbout.astro` a fost păstrată identic.

După push, identificați deploymentul după commit, confirmați Pages și domeniul
canonic, apoi inspectați paginile și comportamentele afectate. Păstrați în
raport distincte rezultatele locale, CI, Pages și live.

Punct de revenire identificat la începutul schimbării din 2026-09-24:

- commit: `cb14e985f4d08630038b07ce163f5a5340f8e9f9`;
- deployment Pages reușit: `c317cf3c-478d-44fd-a2a6-489a27f7110c`.

În caz de regresie, reveniți la deploymentul Pages reușit verificat și confirmați
din nou site-ul protejat. Preferați deploymentul deja construit în locul unui
rebuild al codului vechi după retragerea TinaCloud. Reveniți apoi printr-un
commit dedicat sau o corecție; nu resetați modificări fără legătură. Rollbackul
codului nu reface automat setările de cont, cache-ul sau filtrele de build.

## Istoric și surse

Configurația inițială TinaCloud, configurarea DNS și verificările din iulie 2026
rămân documentate în istoricul Git al acestui fișier și în deciziile datate.
Aceste note istorice nu sunt instrucțiuni de reactivare a CMS-ului.

Referințe operaționale pentru verificarea comportamentului platformei:

- [Cloudflare Pages: build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages: build caching](https://developers.cloudflare.com/pages/configuration/build-caching/)
- [Cloudflare Pages: build watch paths](https://developers.cloudflare.com/pages/configuration/build-watch-paths/)
- [Cloudflare Pages: rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/)
