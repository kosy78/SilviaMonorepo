# Silvia Dinu Digital Presence

Monorepo-ul este sursa de adevăr pentru prezența digitală a Silviei Dinu:
website, conținut editorial și SEO, campanii, identitate vizuală, documentație
operațională și deciziile care conectează aceste zone.

## Structură

- `website/` — aplicația Astro, conținutul public și testele website-ului;
- `obsidian-vault/` — strategie, cercetare, drafturi și decizii;
- `campaigns/` — materiale de campanie pregătite pentru execuție;
- `brand-assets/` — surse și exporturi vizuale aprobate;
- `operations/` — proceduri, note juridice și documentație operațională.

Consultați `AGENTS.md` din rădăcină și fișierul `AGENTS.md` din directorul în
care lucrați înainte de a modifica fișiere.

## Website

```sh
cd website
pnpm install
pnpm dev
```

Verificări:

```sh
pnpm check
pnpm test:e2e
pnpm build
```

Detaliile tehnice sunt în [`website/README.md`](website/README.md).

## Confidențialitate

Nu introduceți în Git secrete, date despre clienți sau pacienți, mesaje primite
prin formular, răspunsuri din reflecția ghidată ori alte informații sensibile.
