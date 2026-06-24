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

## Structură

- `src/components/ui/` — primitive reutilizabile;
- `src/components/layout/` — antet, subsol și structură de pagină;
- `src/components/sections/` — secțiuni editoriale reutilizabile;
- `src/components/islands/` — viitoare componente React interactive;
- `src/content/blog/` — articole Markdown sau MDX;
- `src/pages/` — rute publice;
- `src/styles/` — tokenuri și stiluri globale.

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
