# Feature Specification: Editable Page Content (Storyblok Visual Editor)

**Feature Branch**: `002-editable-page-content`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "Elisa deve poter modificare i contenuti del sito (Home, Chi Sono, Contatti, blog) come se fosse WordPress: editing visuale reale, drag-and-drop sulla pagina, riordino/aggiunta di blocchi ripetuti (card servizi, voci timeline), senza intervento di uno sviluppatore. Serve un vero editor visuale, non solo una lista con anteprima."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Elisa modifica un testo esistente (Priority: P1)

Elisa vuole cambiare una frase nella Home (es. il testo dell'hero) senza
chiedere aiuto a uno sviluppatore, vedendo l'anteprima della pagina reale
mentre scrive.

**Why this priority**: È l'uso più frequente e il valore minimo per cui
tutta la feature esiste: senza questo, Elisa dipende comunque da un
developer per ogni piccola correzione di testo.

**Independent Test**: Elisa apre l'editor visuale di Storyblok sulla storia
"Home", clicca sul testo dell'hero, lo modifica, vede l'anteprima
aggiornarsi, pubblica. Il sito pubblico mostra il nuovo testo dopo il
prossimo deploy.

**Acceptance Scenarios**:

1. **Given** Elisa è autenticata su Storyblok, **When** apre la storia
   "Home" in modalità editor visuale, **Then** vede un'anteprima della
   pagina reale del sito.
2. **Given** l'anteprima aperta, **When** Elisa modifica un testo, **Then**
   l'anteprima si aggiorna senza bisogno di ricaricare manualmente.
3. **Given** una modifica pubblicata, **When** il deploy automatico
   completa, **Then** il sito pubblico mostra il nuovo testo.

---

### User Story 2 - Elisa riordina/aggiunge blocchi ripetuti (Priority: P2)

Elisa vuole aggiungere una quinta card "Area di intervento" in Home, o una
nuova voce nella timeline del percorso professionale in Chi Sono, o
cambiare l'ordine delle card esistenti — trascinando gli elementi
nell'editor, senza scrivere codice.

**Why this priority**: È il motivo esplicito per cui si è scelto un CMS
visuale invece di uno a lista/form: dà a Elisa autonomia reale su struttura
e quantità dei contenuti ripetuti, non solo sul testo.

**Independent Test**: Elisa apre la storia "Chi Sono", trascina una voce
della timeline per cambiarne la posizione, aggiunge una nuova voce
copiando il blocco esistente, pubblica. Il sito pubblico riflette il nuovo
ordine e la nuova voce.

**Acceptance Scenarios**:

1. **Given** una lista di blocchi dello stesso tipo (es. card servizio),
   **When** Elisa ne trascina uno in una posizione diversa, **Then**
   l'anteprima e il sito pubblicato (dopo deploy) riflettono il nuovo
   ordine.
2. **Given** un blocco esistente, **When** Elisa lo duplica o ne aggiunge
   uno nuovo dello stesso tipo, **Then** compare come istanza aggiuntiva
   sulla pagina, con lo stesso stile delle altre.
3. **Given** un blocco che Elisa non vuole più, **When** lo rimuove,
   **Then** scompare dalla pagina pubblicata dopo il deploy.

---

### User Story 3 - Elisa pubblica un nuovo articolo di blog (Priority: P3)

Elisa vuole continuare a scrivere e pubblicare articoli di blog, ora anche
questi tramite Storyblok invece che tramite il CMS precedente.

**Why this priority**: Continuità di una funzionalità già esistente
(prima via Decap CMS): non è nuova capability, ma va migrata sulla stessa
piattaforma per non avere due sistemi di gestione contenuti diversi.

**Independent Test**: Elisa crea una nuova storia di tipo "Articolo blog"
su Storyblok, la compila, la pubblica; l'articolo appare in `/blog/` dopo
il deploy.

**Acceptance Scenarios**:

1. **Given** Elisa autenticata su Storyblok, **When** crea una nuova storia
   di tipo blog post con titolo, estratto, corpo e tag, **Then** può
   pubblicarla senza intervento di sviluppatore.
2. **Given** un articolo pubblicato, **When** il deploy completa, **Then**
   l'articolo appare nell'elenco `/blog/` e nella sua pagina dedicata.

---

### Edge Cases

- Cosa succede se Elisa lascia un campo obbligatorio vuoto (es. titolo
  hero)? L'editor deve segnalarlo prima di permettere la pubblicazione,
  senza generare una pagina rotta.
- Cosa succede se Elisa rimuove TUTTI i blocchi di un tipo ripetuto (es.
  tutte le card servizio)? La sezione corrispondente non deve rompere il
  layout della pagina (deve degradare in modo pulito, es. sezione vuota o
  nascosta).
- Cosa succede se il servizio Storyblok è temporaneamente irraggiungibile
  durante un deploy? Il build deve fallire in modo esplicito (non
  pubblicare una versione con contenuti mancanti/corrotti).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Elisa DEVE poter modificare i testi di Home, Chi Sono e
  Contatti tramite un editor visuale che mostra l'anteprima della pagina
  reale, senza intervento di sviluppatore.
- **FR-002**: Elisa DEVE poter riordinare, duplicare e rimuovere istanze di
  blocchi di contenuto ripetuti (card servizio, voci timeline, tag
  formazione) trascinandoli nell'editor.
- **FR-003**: Le modifiche pubblicate da Elisa DEVONO riflettersi sul sito
  pubblico dopo il normale ciclo di deploy automatico, senza passaggi
  manuali aggiuntivi da parte di uno sviluppatore.
- **FR-004**: Il sito pubblicato DEVE mantenere lo stesso aspetto visivo
  attuale (colori, layout, classi) — questa feature non introduce cambi di
  design.
- **FR-005**: La creazione di un nuovo TIPO di blocco mai esistito, o
  modifiche a struttura/stile delle pagine, restano lavoro da sviluppatore
  (fuori dalla capacità data a Elisa da questa feature).
- **FR-006**: Gli articoli di blog DEVONO essere gestibili dalla stessa
  piattaforma usata per le altre pagine (continuità della funzionalità già
  esistente, ora su Storyblok invece che sul CMS precedente).
- **FR-007**: Il pannello di amministrazione precedente (Decap CMS,
  `/admin/`) e la sua autenticazione dedicata DEVONO essere rimossi dal
  repository una volta completata la migrazione, per non lasciare due
  sistemi di gestione contenuti attivi contemporaneamente.

### Key Entities

- **Storia Home**: composta da blocchi (hero, elenco aree di intervento,
  teaser bio, sezione prenotazione, teaser Instagram).
- **Storia Chi Sono**: composta da blocchi (bio, elenco voci timeline,
  elenco tag formazione continua, CTA finale).
- **Storia Contatti**: composta da blocchi (recapiti, testo introduttivo);
  il funzionamento del form (Web3Forms) e della mappa non cambia.
- **Storia Articolo blog**: titolo, data, estratto, immagine copertina,
  tag, stato pubblicato, corpo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Elisa modifica un testo su una qualunque delle tre pagine
  principali e lo vede pubblicato entro il tempo di un deploy standard,
  senza assistenza tecnica.
- **SC-002**: Elisa riordina o aggiunge almeno un blocco ripetuto (es. card
  servizio) trascinandolo nell'editor, e il cambiamento si riflette sul
  sito pubblicato.
- **SC-003**: Il sito, dopo la migrazione, supera una verifica visiva a
  campione: nessuna differenza di stile percepibile rispetto a prima
  (stesso layout, stessi colori, stesse classi).
- **SC-004**: Non esistono più due pannelli di amministrazione diversi:
  Decap CMS e la sua autenticazione dedicata sono stati rimossi.

## Assumptions

- L'editing visuale avviene tramite l'editor di Storyblok (Visual Editor +
  Bridge), non tramite un builder trascinabile costruito su misura: si usa
  uno strumento esistente, non se ne scrive uno nuovo (Principio I).
- I "tipi di blocco" disponibili sono definiti dagli sviluppatori in
  anticipo (Hero, Card servizio, Voce timeline, Tag, ecc.); Elisa lavora
  componendo istanze di questi tipi, non inventandone di nuovi.
- Il piano gratuito di Storyblok (1 utente/spazio) è sufficiente per l'uso
  di un singolo editor di contenuti su un sito di questa dimensione.
- Le immagini restano caricate da Elisa direttamente nell'editor
  (asset manager di Storyblok), sostituendo l'upload precedente su
  `public/images` via Decap CMS.
- Il deploy si aggiorna automaticamente alla pubblicazione grazie a un
  webhook Storyblok → Vercel Deploy Hook (nessuna nuova pipeline custom,
  coerente con il Principio V).
