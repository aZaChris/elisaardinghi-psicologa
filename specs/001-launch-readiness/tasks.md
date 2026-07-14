# Tasks: Launch Readiness

**Input**: Design documents from `specs/001-launch-readiness/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Non richiesti dallo spec (nessuna sezione test nella feature spec) — gate di verifica è `npm run build` + validazione manuale (quickstart.md).

**Organization**: Task raggruppati per user story per essere implementabili e verificabili in modo indipendente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: eseguibile in parallelo (file diversi, nessuna dipendenza)
- **[Story]**: user story di riferimento (US1/US2/US3) o FOUND (foundational)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: correggere ciò che blocca la build prima di qualunque altra modifica

- [x] T001 [FOUND] Rimuovere il testo residuo `ayout>` in fondo a `src/pages/index.astro`
- [x] T001b [FOUND] Fix drift di dipendenze: `@tailwindcss/vite` risolveva `vite@8` mentre Astro usa `vite@7`, rompendo la build. Aggiunto `overrides.vite: "^7.3.2"` in `package.json` per forzare una sola versione coerente (nessuna modifica a CSS/markup).

**Checkpoint**: `npm run build` deve completare senza errori prima di procedere — verificato ✅

---

## Phase 2: User Story 1 - Elisa pubblica un articolo da sola (Priority: P1) 🎯 MVP

**Goal**: rendere `/admin/` autenticabile e funzionante senza dipendere da un hosting che non lo supporta

**Independent Test**: Elisa fa login su `/admin/`, crea e pubblica un articolo, l'articolo appare sul sito dopo il deploy

- [x] T002 [US1] Aggiornare `public/admin/config.yml`: aggiungere `backend.identity_url` e `backend.gateway_url` verso il progetto Netlify dedicato, con commenti che spiegano il perché (coerente con lo stile di commenti già presente nel file). Aggiunto anche `netlifyIdentity.init({ APIUrl })` in `public/admin/index.html`, altrimenti il widget avrebbe cercato Identity sul dominio Vercel.
- [x] T003 [P] [US1] Scrivere `docs/cms-identity-setup.md`: guida passo-passo per creare il progetto Netlify dedicato, attivare Identity + Git Gateway, invitare Elisa come utente
- [x] T004 [US1] Aggiornare `README.md`: sezione "Gestione dei Contenuti" con il link corretto e la nota sull'autenticazione separata da Vercel

**Checkpoint**: config CMS pronta; resta un'azione manuale (creazione progetto Netlify + invito) fuori dal repository, tracciata in T003

---

## Phase 3: User Story 2 - Deploy automatico senza server da mantenere (Priority: P2)

**Goal**: rimuovere la pipeline morta verso Hetzner e documentare il deploy reale su Vercel

**Independent Test**: il repository non contiene più configurazioni Hetzner; un push su `master` pubblica tramite Vercel

- [x] T005 [P] [US2] Eliminare `Caddyfile`
- [x] T006 [P] [US2] Eliminare `.github/workflows/deploy.yml` (e la cartella `.github/workflows/` se resta vuota)
- [x] T007 [P] [US2] Eliminare `docs/vps-setup.md`
- [x] T008 [US2] Aggiornare `README.md` sezione "Deployment": sostituire la spiegazione Hetzner/Caddy con il flusso Vercel (push → build automatica)

**Checkpoint**: nessun riferimento operativo a Hetzner/VPS nel repository (SC-005)

---

## Phase 4: User Story 3 - Un visitatore capisce come vengono trattati i suoi dati (Priority: P3)

**Goal**: pagina privacy raggiungibile da ogni pagina, che elenca i servizi terzi coinvolti

**Independent Test**: da qualunque pagina, un click sul footer porta alla pagina privacy con i servizi elencati

- [x] T009 [US3] Creare `src/pages/privacy.astro` (stesso Layout/Header/Footer delle altre pagine) con le sezioni definite in `data-model.md` (titolare, Web3Forms, Cal.com, hosting Vercel, Identity Netlify)
- [x] T010 [US3] Aggiungere link "Privacy" nel `src/components/Footer.astro`

**Checkpoint**: link privacy presente e funzionante su tutte le pagine (SC-003)

---

## Phase 5: Polish

- [x] T011 Eseguire `npm run build` e verificare che non emetta errori/warning (SC-004) — 6 pagine generate, nessun errore
- [ ] T012 Eseguire manualmente gli scenari di `quickstart.md` §3 e §4 dopo che il progetto Netlify Identity è stato creato (dipende da azione manuale esterna, non bloccante per il resto del codice)
- [x] T012b Fix emerso durante T012: `/admin` (senza slash finale) veniva servito da Vercel senza redirect a `/admin/`, causando 404 su `config.yml` (fetch relativo risolto dalla radice del sito). Aggiunto `<base href="/admin/">` in `public/admin/index.html`.

---

## Dependencies & Execution Order

- Phase 1 (T001) blocca tutto: la build deve essere pulita prima di procedere.
- Phase 2, 3, 4 sono indipendenti tra loro (toccano file diversi) e possono procedere in qualunque ordine o in parallelo.
- Phase 5 (T011) richiede che Phase 1-4 siano completate.
- T012 richiede un'azione manuale esterna (creazione del progetto Netlify, task T003) prima di poter essere eseguito: resta aperto come follow-up per l'utente.

## Notes

- Nessun task di test automatico: non richiesto dallo spec, il progetto non ha framework di test e non ne serve uno per correzioni di markup/configurazione statica (Principio I della costituzione).
- T012 non è completabile da questa sessione: richiede credenziali Netlify reali di Elisa. Documentato come follow-up.
