# Tasks: Editable Page Content (Storyblok Visual Editor)

**Input**: Design documents from `specs/002-editable-page-content/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Non richiesti dallo spec — gate di verifica è `npm run build` + verifica visiva manuale (quickstart.md).

**Organization**: Task raggruppati per user story.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (azione esterna dell'utente)

- [ ] T001 Creare uno spazio Storyblok (account gratuito) — azione manuale, guidata in chat
- [ ] T002 Recuperare il token "Preview" (Content Delivery API) dallo spazio Storyblok
- [ ] T003 [P] Installare `@storyblok/astro` e configurare `astro.config.mjs` con l'integrazione
- [ ] T004 [P] Impostare `STORYBLOK_TOKEN` in `.env` locale e nelle Environment Variables di Vercel

**Checkpoint**: `npx storyblok login` funzionante, spazio raggiungibile

---

## Phase 2: Foundational (schema dei contenuti)

**⚠️ CRITICAL**: nessuna pagina può essere migrata prima che i componenti esistano nello spazio Storyblok

- [ ] T005 Definire gli schema JSON dei bloks in `.storyblok/components/` (hero, services_grid, service_card, bio_teaser, booking_section, instagram_teaser, bio, timeline, timeline_entry, formazione_tags, cta_final, contact_intro, contact_info, blog_post) secondo `data-model.md`
- [ ] T006 Pushare i componenti nello spazio Storyblok via `storyblok push-components`
- [ ] T007 Creare le storie root vuote (`home`, `chi-sono`, `contatti`) nello spazio

**Checkpoint**: i tipi di blok sono selezionabili nell'editor Storyblok

---

## Phase 3: User Story 1 - Elisa modifica un testo esistente (Priority: P1) 🎯 MVP

**Goal**: Home editabile visivamente, stesso markup/stile attuale

**Independent Test**: modifica del testo hero su Storyblok → anteprima live → pubblica → sito aggiornato

- [ ] T008 [P] [US1] Creare `src/storyblok/Hero.astro` (markup identico all'hero attuale di `index.astro`, parametrizzato sui campi del blok)
- [ ] T009 [P] [US1] Creare `src/storyblok/ServicesGrid.astro` + `ServiceCard.astro` (con mapping icona→SVG fisso)
- [ ] T010 [P] [US1] Creare `src/storyblok/BioTeaser.astro`
- [ ] T011 [P] [US1] Creare `src/storyblok/BookingSection.astro` (embed Cal.com invariato, solo testi da blok)
- [ ] T012 [P] [US1] Creare `src/storyblok/InstagramTeaser.astro`
- [ ] T013 [US1] Riscrivere `src/pages/index.astro`: fetch storia "home" via `useStoryblokApi()`, render con `<StoryblokComponent>` (dipende da T008-T012)
- [ ] T014 [US1] Popolare la storia "home" su Storyblok con i testi attuali del sito (copia dai file esistenti prima di rimuoverli)
- [ ] T015 [US1] Aggiungere lo script del Visual Editor Bridge (attivo solo dentro l'iframe editor, rilevato da `_storyblok` in query string)

**Checkpoint**: Home pubblicata identica visivamente, editabile da Storyblok

---

## Phase 4: User Story 2 - Elisa riordina/aggiunge blocchi ripetuti (Priority: P2)

**Goal**: Chi Sono e Contatti editabili, timeline/tag riordinabili

**Independent Test**: riordino di una voce timeline su Storyblok → sito riflette il nuovo ordine dopo il deploy

- [ ] T016 [P] [US2] Creare `src/storyblok/Bio.astro`, `Timeline.astro`, `TimelineEntry.astro`, `FormazioneTags.astro`, `CtaFinal.astro`
- [ ] T017 [US2] Riscrivere `src/pages/chi-sono.astro`: fetch storia "chi-sono", render a blocchi (dipende da T016)
- [ ] T018 [P] [US2] Creare `src/storyblok/ContactIntro.astro`, `ContactInfo.astro`
- [ ] T019 [US2] Riscrivere `src/pages/contatti.astro`: fetch storia "contatti" per i testi, form Web3Forms/mappa invariati nel markup (dipende da T018)
- [ ] T020 [US2] Popolare le storie "chi-sono" e "contatti" su Storyblok con i contenuti attuali

**Checkpoint**: le tre pagine principali sono editabili e riordinabili da Storyblok

---

## Phase 5: User Story 3 - Migrazione blog (Priority: P3)

**Goal**: articoli di blog gestiti da Storyblok invece che da Astro Content Collections

**Independent Test**: nuovo articolo creato su Storyblok → appare in `/blog/` dopo il deploy

- [ ] T021 [US3] Creare `src/storyblok/BlogPost.astro`
- [ ] T022 [US3] Riscrivere `src/pages/blog/index.astro`: fetch lista storie `blog_post` da Storyblok
- [ ] T023 [US3] Riscrivere `src/pages/blog/[slug].astro`: fetch singola storia blog da Storyblok
- [ ] T024 [US3] Ricreare manualmente su Storyblok l'articolo esistente (`cosa-significa-essere-caregiver.md`) come storia `blog_post`
- [ ] T025 [US3] Rimuovere `src/content/blog/` e `src/content.config.ts` (non più usati)

**Checkpoint**: blog interamente su Storyblok, nessuna perdita di contenuto

---

## Phase 6: Polish (rimozione Decap CMS, deploy, verifica)

- [ ] T026 [P] Eliminare `public/admin/` (config.yml, index.html)
- [ ] T027 [P] Eliminare `docs/cms-identity-setup.md`
- [ ] T028 Rimuovere le regole di redirect `/admin` e lo script `vercel-build` (non più necessario: senza `public/admin/` non c'è più nulla da escludere dalla build) in `vercel.json` e `package.json`
- [ ] T029 Aggiornare `src/pages/privacy.astro`: rimuovere il riferimento a Netlify Identity/CMS, aggiungere Storyblok come servizio che tratta contenuti editoriali (non dati di visitatori)
- [ ] T030 Configurare il webhook Storyblok → Vercel Deploy Hook (azione manuale, guidata in chat)
- [ ] T031 Eseguire `npm run build` e verificare nessun errore (SC per build pulita)
- [ ] T032 Verifica visiva a campione: screenshot Home/Chi Sono/Contatti, nessuna differenza percepibile rispetto a prima (SC-003)
- [ ] T033 Eseguire gli scenari di `quickstart.md` end-to-end

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
