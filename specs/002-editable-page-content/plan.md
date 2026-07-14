# Implementation Plan: Editable Page Content (Storyblok Visual Editor)

**Branch**: `002-editable-page-content` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-editable-page-content/spec.md`

## Summary

Sostituire Decap CMS (form + lista, niente editing visuale) con Storyblok,
che offre un vero Visual Editor con anteprima live e riordino a
trascinamento. Le pagine Home, Chi Sono, Contatti e gli articoli di blog
smettono di avere contenuto hardcoded/Markdown locale e diventano "storie"
Storyblok composte da blocchi (bloks) tipizzati, letti da Astro in fase di
build tramite `@storyblok/astro`. Il markup/Tailwind esistente resta
identico: i componenti Astro vengono parametrizzati con i campi del blok,
non riscritti visivamente. Il deploy resta su Vercel, ritriggerato da un
webhook quando Elisa pubblica.

## Technical Context

**Language/Version**: Astro 6 (TypeScript, Node >=22.12), invariato

**Primary Dependencies**: `@storyblok/astro` (nuovo), Astro, Tailwind v4,
`@astrojs/sitemap`. Rimossi: Decap CMS (bundle statico), Netlify Identity
Widget — non più referenziati dal codice.

**Storage**: Contenuto ospitato su Storyblok (API "Content Delivery"),
versione "published" letta in build; niente più Markdown locale per
Home/Chi Sono/Contatti/blog.

**Testing**: `npm run build` come gate (deve completare senza errori e con
i dati Storyblok effettivamente presenti); verifica visiva manuale
(screenshot prima/dopo) per garantire FR-004 (nessun cambio di design).

**Target Platform**: Browser (sito pubblico statico su Vercel); editor
visuale ospitato su app.storyblok.com (nessun pannello self-hosted da
mantenere, a differenza di Decap/Netlify Identity).

**Project Type**: Sito web statico, singolo progetto

**Performance Goals**: Nessuna regressione sui tempi di build/peso pagina;
le chiamate API Storyblok avvengono solo in build (SSG), non a runtime nel
browser dell'utente finale.

**Constraints**: Il markup e le classi Tailwind esistenti restano
invariati (vincolo esplicito dell'utente: no modifiche al frontend/design).
Nessun HTML/SVG arbitrario proveniente dai campi CMS viene iniettato senza
escaping — i campi "icona" delle card servizio usano un select a opzioni
fisse mappate a SVG già nel codice, non un campo libero.

**Scale/Scope**: Stesso sito a bassa scala (Home, Chi Sono, Contatti, blog
con pochi articoli), un solo editor di contenuti (Elisa).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Static-First, Minimal Moving Parts**: PASS. Si aggiunge una sola
  dipendenza (`@storyblok/astro`), giustificata: è lo strumento esistente
  che risolve il requisito di editing visuale, non se ne scrive uno su
  misura. Il sito resta staticamente generato (SSG), nessun server
  applicativo aggiunto.
- **II. Elisa Deve Poter Lavorare Da Sola**: PASS — è l'obiettivo primario
  della feature (v2.0.0 della costituzione la riflette già).
- **III. Privacy e Trust by Design**: PASS. Nessun nuovo dato personale di
  visitatori raccolto; Storyblok è usato solo per gestione contenuti
  editoriali, non tracciamento. La pagina privacy va aggiornata per
  rimuovere il riferimento a Netlify Identity (non più usato) — task di
  polish.
- **IV. Contenuto e Accessibilità Prima Della Forma**: PASS, i componenti
  mantengono lo stesso HTML semantico e le stesse classi già verificate.
- **V. Deploy Semplice, Nessuna Infrastruttura Da Mantenere**: PASS. Si
  elimina un servizio esterno (Netlify Identity/Git Gateway) e se ne
  aggiunge uno (Storyblok), ma il deploy resta un webhook nativo verso
  Vercel — nessuna pipeline custom.

Nessuna violazione: non serve compilare Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/002-editable-page-content/
├── plan.md              # questo file
├── research.md           # Fase 0: decisioni tecniche (schema bloks, webhook, migrazione blog)
├── data-model.md         # Fase 1: definizione dei bloks/content types Storyblok
├── quickstart.md         # Fase 1: guida di validazione manuale end-to-end
└── tasks.md              # Fase 2 (/speckit-tasks)
```

Nessuna cartella `contracts/`: l'unica "interfaccia esterna" è l'API
pubblica di Storyblok stessa (già documentata da Storyblok), non un
contratto che questo progetto definisce.

### Source Code (repository root)

```text
src/
├── storyblok/            # NUOVO: componenti Astro mappati ai bloks Storyblok
│   ├── Hero.astro
│   ├── ServiceCard.astro
│   ├── ServicesGrid.astro
│   ├── BioTeaser.astro
│   ├── BookingSection.astro
│   ├── InstagramTeaser.astro
│   ├── Bio.astro
│   ├── TimelineEntry.astro
│   ├── Timeline.astro
│   ├── FormazioneTags.astro
│   ├── ContactIntro.astro
│   ├── ContactInfo.astro
│   ├── CtaFinal.astro
│   └── BlogPost.astro
├── pages/
│   ├── index.astro        # fetch storia "home" da Storyblok, invariato nel markup
│   ├── chi-sono.astro      # fetch storia "chi-sono"
│   ├── contatti.astro      # fetch storia "contatti" (form Web3Forms invariato)
│   ├── privacy.astro       # aggiornata: rimosso riferimento a Netlify Identity
│   └── blog/
│       ├── index.astro     # fetch lista storie tipo "blog_post" da Storyblok
│       └── [slug].astro    # fetch singola storia blog da Storyblok
├── layouts/Layout.astro    # invariato
└── content.config.ts       # RIMOSSO (contenuto blog non più in Astro Content Collections)

.storyblok/
└── components/             # NUOVO: schema JSON dei bloks, sincronizzati via Storyblok CLI
    ├── home.json
    ├── hero.json
    ├── service_card.json
    └── ... (uno per tipo di blok)

# RIMOSSI (Decap CMS dismesso)
public/admin/                        # eliminato (config.yml, index.html)
docs/cms-identity-setup.md           # eliminato
vercel.json (regole redirect /admin) # eliminate
src/content/blog/                    # eliminato dopo migrazione a Storyblok
```

**Structure Decision**: Progetto singolo, invariato nella forma. Il
contenuto si sposta da file locali (Markdown/JSX hardcoded) a Storyblok,
letto in build. I componenti Astro esistenti vengono spostati/adattati in
`src/storyblok/` mantenendo esattamente le stesse classi Tailwind, solo
parametrizzati sui campi del blok invece che su testo hardcoded.

## Complexity Tracking

Nessuna violazione della costituzione da giustificare.
