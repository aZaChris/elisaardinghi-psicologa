# Quickstart: Validazione Launch Readiness

Guida per verificare manualmente che ogni user story funzioni end-to-end.
Non sostituisce i task di implementazione (`tasks.md`), serve a validare il
risultato.

## Prerequisiti

- Repository con le modifiche di questa feature applicate
- Node >=22.12 installato (`npm install` già eseguito)
- Un progetto Vercel collegato al repository GitHub
- Un progetto Netlify dedicato con Identity + Git Gateway attivi (vedi
  `docs/cms-identity-setup.md`)

## 1. Build pulita (FR-005, FR-006)

```bash
npm run build
```

**Atteso**: build completata senza errori né warning di markup. Nessun
riferimento a `Caddyfile`, `deploy.yml` o `docs/vps-setup.md` nel repo.

## 2. Deploy automatico (User Story 2)

```bash
git push origin master
```

**Atteso**: Vercel avvia una build automaticamente e pubblica la nuova
versione entro pochi minuti, senza toccare nessun server.

## 3. Login CMS ed editing (User Story 1)

1. Apri `https://<dominio-sito>/admin/`
2. Fai login con l'account Netlify Identity invitato (Elisa)
3. Crea un nuovo articolo di blog, impostalo come pubblicato, salva

**Atteso**: il salvataggio crea un commit sul branch `master` (via Git
Gateway); dopo il prossimo deploy Vercel, l'articolo appare in
`/blog/`.

## 4. Informativa privacy (User Story 3)

1. Apri qualsiasi pagina del sito pubblico
2. Cerca il link "Privacy" nel footer
3. Apri la pagina privacy

**Atteso**: la pagina elenca Web3Forms, Cal.com, hosting Vercel; il link è
raggiungibile da ogni pagina in un click (SC-003).

## 5. Fallback immagini (Edge case)

Visita la home senza aver caricato `elisa-hero.jpg` in `public/images`.

**Atteso**: viene mostrato il placeholder SVG esistente, non un'icona di
immagine rotta del browser (comportamento già presente, da non rompere).
