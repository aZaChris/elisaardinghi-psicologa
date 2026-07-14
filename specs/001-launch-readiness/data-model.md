# Phase 1 Data Model: Launch Readiness

Nessun database: le "entità" sono file di contenuto e configurazione già
esistenti nel repo, qui documentate per chiarezza.

## Articolo di blog

Definito in `src/content.config.ts` (Astro Content Collection), file
Markdown in `src/content/blog/`.

| Campo | Tipo | Note |
|---|---|---|
| `title` | string | Titolo articolo |
| `date` | datetime | Data pubblicazione |
| `excerpt` | string | Estratto breve (anteprima) |
| `coverImage` | image (opzionale) | Caricata via CMS in `public/images` |
| `tags` | list di string | Categorizzazione |
| `published` | boolean | Visibile sul sito se `true` |
| `body` | markdown | Contenuto dell'articolo |

Nessuna modifica di schema richiesta da questa feature.

## Configurazione autenticazione CMS

Non è un'entità applicativa ma una configurazione, in
`public/admin/config.yml`:

| Campo | Valore | Note |
|---|---|---|
| `backend.name` | `git-gateway` | invariato |
| `backend.identity_url` | `https://<nome-progetto>.netlify.app/.netlify/identity` | NUOVO, punta al progetto Netlify dedicato |
| `backend.gateway_url` | `https://<nome-progetto>.netlify.app/.netlify/git/github` | NUOVO |
| `backend.branch` | `master` | corretto da `main`: era sbagliato, il branch reale del repo è `master` |

## Informativa privacy

Pagina statica, non un'entità dati. Sezioni minime richieste dal FR-004:

- Titolare del trattamento (Elisa Ardinghi)
- Dati raccolti dal form contatti (nome, email, messaggio) → inviati via
  Web3Forms
- Dati raccolti dal widget di prenotazione → gestiti da Cal.com (dominio
  terzo)
- Hosting del sito → Vercel
- Nessun dato di visitatori pubblici passa dal servizio di Identity Netlify
  (usato solo da Elisa per il CMS)
