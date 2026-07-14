# Tasks: Editable Page Content (Storyblok Visual Editor)

**Input**: Design documents from `specs/002-editable-page-content/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Non richiesti dallo spec — gate di verifica è `npm run build` + verifica visiva manuale (quickstart.md).

**Organization**: Task raggruppati per user story.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (azione esterna dell'utente)

- [x] T001 Creare uno spazio Storyblok (account gratuito) — azione manuale, guidata in chat
- [x] T002 Recuperare il token "Preview" (Content Delivery API) dallo spazio Storyblok
- [x] T003 [P] Installare `@storyblok/astro` e configurare `astro.config.mjs` con l'integrazione
- [x] T004 [P] Impostare `STORYBLOK_TOKEN` in `.env` locale (Vercel: da fare da chi ha accesso al pannello, vedi README)

**Checkpoint**: spazio raggiungibile ✅

---

## Phase 2: Foundational (schema dei contenuti)

**⚠️ CRITICAL**: nessuna pagina può essere migrata prima che i componenti esistano nello spazio Storyblok

- [x] T005 Definire gli schema dei bloks (hero, services_grid, service_card, bio_teaser, booking_section, instagram_teaser, bio, timeline, timeline_entry, formazione_tags, tag_item, cta_final, contact_intro, contact_info, blog_post) secondo `data-model.md` — in `scripts/storyblok-setup.mjs` invece di file JSON statici in `.storyblok/components/`: più semplice da eseguire (Management API diretta, un solo script idempotente) e permette di popolare anche le storie nello stesso passaggio
- [x] T006 Pushati i componenti nello spazio Storyblok (via `node scripts/storyblok-setup.mjs`, non CLI `push-components` — stesso risultato)
- [x] T007 Create le storie root `home`, `chi-sono`, `contatti` (già con contenuto reale, non vuote — vedi T014/T020)

**Checkpoint**: componenti e storie verificati via Management API ✅

---

## Phase 3: User Story 1 - Elisa modifica un testo esistente (Priority: P1) 🎯 MVP

**Goal**: Home editabile visivamente, stesso markup/stile attuale

**Independent Test**: modifica del testo hero su Storyblok → anteprima live → pubblica → sito aggiornato

- [x] T008 [P] [US1] Creare `src/storyblok/Hero.astro` (markup identico all'hero attuale di `index.astro`, parametrizzato sui campi del blok)
- [x] T009 [P] [US1] Creare `src/storyblok/ServicesGrid.astro` + `ServiceCard.astro` (con mapping icona→SVG fisso)
- [x] T010 [P] [US1] Creare `src/storyblok/BioTeaser.astro`
- [x] T011 [P] [US1] Creare `src/storyblok/BookingSection.astro` (embed Cal.com invariato, solo testi da blok)
- [x] T012 [P] [US1] Creare `src/storyblok/InstagramTeaser.astro`
- [x] T013 [US1] Riscrivere `src/pages/index.astro`: fetch storia "home" via `useStoryblokApi()`, render con `<StoryblokComponent>` (dipende da T008-T012)
- [x] T014 [US1] Popolare la storia "home" su Storyblok con i testi attuali del sito (via script, non copia manuale)
- [x] T015 [US1] Aggiunto lo script del Visual Editor Bridge in `Layout.astro` (attivo solo con `_storyblok` in query string, zero JS per i visitatori reali). **Limite architetturale onesto**: il sito è statico (SSG), quindi il bridge abilita il click diretto sugli elementi e il reload automatico dopo la pubblicazione, ma NON un live-preview pixel-per-pixel mentre si digita sul sito di produzione (richiederebbe SSR/ISR, scartato dal Principio I). Per un'anteprima davvero live durante la scrittura, Elisa (o chi edita) può puntare l'editor a un `astro dev` locale.

**Checkpoint**: Home pubblicata identica visivamente (verificato con screenshot), editabile da Storyblok ✅

---

## Phase 4: User Story 2 - Elisa riordina/aggiunge blocchi ripetuti (Priority: P2)

**Goal**: Chi Sono e Contatti editabili, timeline/tag riordinabili

**Independent Test**: riordino di una voce timeline su Storyblok → sito riflette il nuovo ordine dopo il deploy

- [x] T016 [P] [US2] Creare `src/storyblok/Bio.astro`, `Timeline.astro`, `TimelineEntry.astro`, `FormazioneTags.astro`, `TagItem.astro`, `CtaFinal.astro`
- [x] T017 [US2] Riscrivere `src/pages/chi-sono.astro`: fetch storia "chi-sono", render a blocchi (dipende da T016)
- [x] T018 [P] [US2] Creare `src/storyblok/ContactIntro.astro`, `ContactInfo.astro`
- [x] T019 [US2] Riscrivere `src/pages/contatti.astro`: fetch storia "contatti" per i testi, form Web3Forms/mappa invariati nel markup (dipende da T018)
- [x] T020 [US2] Popolare le storie "chi-sono" e "contatti" su Storyblok con i contenuti attuali (via script)

**Checkpoint**: le tre pagine principali sono editabili e riordinabili da Storyblok — verificato con build + screenshot ✅

---

## Phase 5: User Story 3 - Migrazione blog (Priority: P3)

**Goal**: articoli di blog gestiti da Storyblok invece che da Astro Content Collections

**Independent Test**: nuovo articolo creato su Storyblok → appare in `/blog/` dopo il deploy

- [x] T021 [US3] Creare `src/storyblok/BlogPost.astro`
- [x] T022 [US3] Riscrivere `src/pages/blog/index.astro`: fetch lista storie `blog_post` da Storyblok
- [x] T023 [US3] Riscrivere `src/pages/blog/[slug].astro`: fetch singola storia blog da Storyblok
- [x] T024 [US3] Ricreato l'articolo esistente come storia `blog_post` (via script, contenuto ricreato in rich text 1:1)
- [x] T025 [US3] Rimossi `src/content/blog/` e `src/content.config.ts`

**Checkpoint**: blog interamente su Storyblok — verificato: articolo raggiungibile e renderizzato correttamente ✅

---

## Phase 6: Polish (rimozione Decap CMS, deploy, verifica)

- [x] T026 [P] Eliminare `public/admin/` (config.yml, index.html)
- [x] T027 [P] Eliminare `docs/cms-identity-setup.md`
- [x] T028 Rimossi `vercel.json` (nessun redirect più necessario) e lo script `vercel-build` da `package.json`
- [x] T029 Aggiornare `src/pages/privacy.astro`: rimosso il riferimento a Netlify Identity/CMS, aggiunto Storyblok come servizio che tratta contenuti editoriali (non dati di visitatori)
- [ ] T030 Configurare il webhook Storyblok → Vercel Deploy Hook (azione manuale, da fare quando il progetto Vercel per questo repo è pronto — istruzioni in docs/storyblok-setup.md)
- [x] T031 Eseguire `npm run build` e verificare nessun errore (build pulita, 6 pagine, dati reali da Storyblok)
- [x] T032 Verifica visiva a campione: screenshot Home/Chi Sono/Contatti via Playwright — nessuna differenza percepibile rispetto a prima (SC-003) ✅
- [ ] T033 Eseguire gli scenari di `quickstart.md` end-to-end (richiede il webhook configurato e un test di editing live in Storyblok da parte dell'utente)

---

## Dependencies & Execution Order

- Phase 1 e 2 bloccano tutto: senza spazio Storyblok e componenti pushati, nessuna pagina può essere migrata.
- Phase 3 (US1, MVP) può procedere da sola una volta completata Phase 2.
- Phase 4 (US2) dipende da Phase 2, indipendente da Phase 3 (file diversi) ma ha senso farla dopo per riusare il pattern validato in US1.
- Phase 5 (US3) indipendente dalle altre due, stesso discorso.
- Phase 6 richiede che almeno Home/Chi Sono/Contatti (Phase 3+4) siano completate prima di rimuovere Decap CMS (altrimenti si perde la capacità di editing senza sostituto pronto).

## Notes

- Ogni pagina riscritta va confrontata visivamente con la versione precedente prima di considerarla completa (vincolo esplicito: nessun cambio di frontend).
- I task T001, T002, T024, T030 richiedono azioni manuali dell'utente su servizi esterni (Storyblok/Vercel dashboard): guidati in chat, non eseguibili autonomamente.
