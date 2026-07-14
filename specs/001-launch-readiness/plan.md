# Implementation Plan: Launch Readiness

**Branch**: `001-launch-readiness` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-launch-readiness/spec.md`

## Summary

Il sito ha già i contenuti principali scritti, ma tre cose bloccano il "vero"
lancio: (1) il CMS è configurato con un backend (Netlify Identity +
git-gateway) incompatibile con l'hosting attuale su Vercel, quindi Elisa non
può pubblicare da sola; (2) il repo trascina una pipeline di deploy verso una
VPS Hetzner non più usata; (3) manca un'informativa privacy nonostante il
sito raccolga dati via form contatti e widget di prenotazione. Approccio:
tenere lo stack esistente (Astro statico + Tailwind + Decap CMS), separare
l'hosting pubblico (Vercel) dall'autenticazione del CMS (progetto Netlify
dedicato solo a Identity/Git Gateway), rimuovere il codice morto Hetzner, e
aggiungere una pagina privacy statica linkata dal footer.

## Technical Context

**Language/Version**: Astro 6 (TypeScript, Node >=22.12)

**Primary Dependencies**: Astro, `@tailwindcss/vite` (Tailwind v4),
`@astrojs/sitemap`, Decap CMS (bundle statico via unpkg in `public/admin/`),
Netlify Identity Widget (solo per il login CMS), Web3Forms (fetch client-side
dal form contatti), Cal.com embed script

**Storage**: N/A — contenuti come file Markdown in `src/content/blog/`
tramite Astro Content Collections

**Testing**: Nessun test runner nel progetto; il gate di verifica è
`npm run build` (build Astro senza errori) più verifica manuale in browser
delle pagine toccate. Non si introduce un framework di test per una
correzione di markup/configurazione statica.

**Target Platform**: Browser (sito pubblico statico su Vercel); pannello
`/admin/` autenticato via progetto Netlify dedicato

**Project Type**: Sito web statico, singolo progetto (nessun frontend/backend
separato)

**Performance Goals**: Nessuna nuova richiesta di performance oltre a quanto
già garantito da Astro static output (Principio IV della costituzione);
nessuna regressione sul tempo di build o sul peso pagina.

**Constraints**: Nessun segreto nel repository (chiavi Web3Forms/Netlify solo
come variabili d'ambiente su Vercel); l'autenticazione del CMS deve restare
del tutto esterna all'hosting del sito pubblico.

**Scale/Scope**: Sito vetrina + blog per una singola professionista, traffico
basso, un solo autore/editor di contenuti (Elisa).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Static-First, Minimal Moving Parts**: PASS. Nessuna nuova dipendenza:
  si riusa Decap CMS già presente, si aggiunge solo una pagina Astro statica
  per la privacy. Il progetto Netlify per l'Identity non serve contenuti
  pubblici, solo il servizio di autenticazione già previsto dal CMS scelto.
- **II. Elisa Deve Poter Lavorare Da Sola**: PASS (obiettivo primario di
  questa feature: FR-001, User Story 1).
- **III. Privacy e Trust by Design**: PASS (FR-003/FR-004, User Story 3).
- **IV. Contenuto e Accessibilità Prima Della Forma**: PASS, nessuna
  modifica ai contenuti esistenti; la pagina privacy segue lo stesso layout
  accessibile delle altre pagine.
- **V. Deploy Semplice, Nessuna Infrastruttura Da Mantenere**: PASS
  (FR-002/FR-005, User Story 2): si rimuove l'infrastruttura VPS, si lascia
  solo Vercel per l'hosting.

Nessuna violazione: non serve compilare la sezione Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-launch-readiness/
├── plan.md              # questo file
├── research.md          # Fase 0: decisioni tecniche (CMS auth, deploy)
├── data-model.md         # Fase 1: entità coinvolte (articolo, config CMS, privacy)
├── quickstart.md         # Fase 1: guida di validazione manuale end-to-end
└── tasks.md              # Fase 2 (/speckit-tasks, non creato da /speckit-plan)
```

Nessuna cartella `contracts/`: il progetto non espone API proprie, solo
integrazioni verso servizi terzi già esistenti (Web3Forms, Cal.com, Netlify
Identity) consumate lato client — non ci sono contratti da definire.

### Source Code (repository root)

```text
src/
├── components/       # Header.astro, Footer.astro (Footer aggiorna link privacy)
├── content/
│   └── blog/          # articoli Markdown gestiti via CMS
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro     # fix bug markup (tag residuo in fondo al file)
│   ├── chi-sono.astro
│   ├── contatti.astro
│   ├── privacy.astro    # NUOVO: informativa privacy/cookie
│   └── blog/
└── styles/global.css

public/
└── admin/
    ├── config.yml       # backend git-gateway + identity_url/gateway_url verso Netlify dedicato
    └── index.html        # Netlify Identity widget (invariato)

docs/
└── cms-identity-setup.md  # NUOVO: guida manuale creazione progetto Netlify per Identity

# RIMOSSI (infrastruttura VPS non più usata)
Caddyfile                        # eliminato
.github/workflows/deploy.yml     # eliminato
docs/vps-setup.md                # eliminato
```

**Structure Decision**: Progetto singolo, nessuna separazione
frontend/backend: è un sito Astro statico con un pannello CMS servito come
asset statico (`public/admin/`). L'unica infrastruttura esterna aggiuntiva è
un progetto Netlify usato esclusivamente come servizio di identità per il
CMS, documentato in `docs/cms-identity-setup.md` — non fa parte del codice
sorgente del sito.

## Complexity Tracking

Nessuna violazione della costituzione da giustificare.
