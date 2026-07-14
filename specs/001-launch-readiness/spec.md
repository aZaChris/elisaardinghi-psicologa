# Feature Specification: Launch Readiness

**Feature Branch**: `001-launch-readiness`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "Finire il sito di Elisa Ardinghi Psicologa e renderlo pronto per andare online: risolvere il CMS che non funziona con l'hosting attuale (Vercel), rimuovere la pipeline di deploy verso una VPS non più usata, aggiungere l'informativa privacy/cookie, e sistemare un bug di build. Le foto restano volutamente vuote: le carica Elisa da sola via CMS."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Elisa pubblica un articolo da sola (Priority: P1)

Elisa vuole scrivere e pubblicare un nuovo articolo di blog collegandosi a
`/admin/` dal browser, senza chiedere aiuto a uno sviluppatore.

**Why this priority**: Oggi il pannello CMS è configurato con un backend
(Netlify Identity + git-gateway) che non può funzionare perché il sito è
ospitato su Vercel. Senza questo, Elisa non ha nessuna autonomia sui
contenuti: è il problema più bloccante del progetto.

**Independent Test**: Elisa apre `https://elisaardinghi.it/admin/`, fa login,
crea un nuovo articolo, lo pubblica, e l'articolo appare sul sito pubblico
entro pochi minuti — senza che nessuno tocchi codice o server.

**Acceptance Scenarios**:

1. **Given** Elisa ha un account invitato sul servizio di autenticazione del
   CMS, **When** visita `/admin/` e inserisce le credenziali, **Then** entra
   nel pannello e vede la lista degli articoli esistenti.
2. **Given** Elisa è autenticata nel pannello, **When** crea un nuovo
   articolo e lo salva come pubblicato, **Then** il sito pubblico mostra il
   nuovo articolo dopo il prossimo deploy automatico.
3. **Given** un visitatore anonimo, **When** prova a raggiungere le funzioni
   di scrittura del CMS senza login, **Then** il sistema richiede
   l'autenticazione e non permette modifiche.

---

### User Story 2 - Deploy automatico senza server da mantenere (Priority: P2)

Chi mantiene il codice vuole che ogni push sul branch principale produca un
sito pubblicato, senza pipeline verso una VPS che non si usa più.

**Why this priority**: La pipeline verso Hetzner (Caddy + GitHub Actions +
SSH) è codice morto che confonde chi lavora sul repo e rappresenta un rischio
di sicurezza inutile (chiavi SSH, secrets) per un'infrastruttura non più in
uso.

**Independent Test**: Si fa un push sul branch principale e, senza toccare
nessun server, il sito aggiornato è raggiungibile online tramite Vercel.

**Acceptance Scenarios**:

1. **Given** una modifica pronta sul branch principale, **When** viene fatto
   push, **Then** Vercel builda e pubblica automaticamente la nuova versione.
2. **Given** il repository, **When** lo si ispeziona, **Then** non contiene
   più configurazioni, guide o segreti relativi al deploy su VPS Hetzner.

---

### User Story 3 - Un visitatore capisce come vengono trattati i suoi dati (Priority: P3)

Un visitatore che sta per scrivere nel form contatti o prenotare un
colloquio vuole sapere quali dati vengono raccolti e da chi, prima di
inviarli.

**Why this priority**: Il sito è di ambito psicologico/sanitario e usa
servizi terzi (form contatti, widget di prenotazione) che raccolgono dati
personali: serve trasparenza, anche se non è il blocco più urgente per far
funzionare il sito.

**Independent Test**: Da qualunque pagina del sito, un visitatore raggiunge
in un click un'informativa che spiega quali dati vengono raccolti dal form
contatti e dal widget di prenotazione, e come vengono trattati.

**Acceptance Scenarios**:

1. **Given** un visitatore su una qualsiasi pagina, **When** cerca un link
   all'informativa privacy (es. nel footer), **Then** lo trova e lo apre.
2. **Given** l'informativa privacy, **When** un visitatore la legge, **Then**
   trova menzionati tutti i servizi terzi che raccolgono dati (form
   contatti, widget di prenotazione, hosting, CMS).

---

### Edge Cases

- Cosa succede se Elisa dimentica la password del servizio di autenticazione
  del CMS? Deve poter recuperare l'accesso in autonomia (reset password
  standard del provider di identità), senza intervento di uno sviluppatore.
- Cosa succede se la build di produzione parte senza la chiave Web3Forms
  configurata? Il form deve degradare in modo visibile (es. errore di invio
  gestito, non un crash silenzioso) finché la chiave reale non è impostata.
- Cosa succede a un utente che digita l'URL di un'immagine hero non ancora
  caricata da Elisa? Deve vedere un placeholder coerente con il design, non
  un'icona di immagine rotta del browser.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Un utente autorizzato (Elisa) DEVE potersi autenticare su
  `/admin/` e creare, modificare e pubblicare articoli di blog senza
  intervento di uno sviluppatore.
- **FR-002**: Il sistema DEVE pubblicare automaticamente il sito ad ogni push
  sul branch principale, senza passaggi manuali su un server dedicato.
- **FR-003**: Ogni pagina pubblica DEVE esporre un link raggiungibile
  all'informativa privacy/cookie.
- **FR-004**: L'informativa privacy DEVE elencare ogni servizio terzo che
  raccoglie dati dell'utente (form contatti, widget di prenotazione,
  hosting, servizio di autenticazione del CMS).
- **FR-005**: Il repository NON DEVE contenere più configurazioni, workflow
  o documentazione relativi al deploy su infrastruttura VPS non più in uso.
- **FR-006**: Tutte le pagine pubbliche DEVONO compilare (build) senza errori
  di markup.
- **FR-007**: Le chiavi/config di servizi esterni (es. Web3Forms) DEVONO
  essere configurabili tramite variabili d'ambiente in produzione, con un
  valore placeholder chiaramente riconoscibile finché non vengono impostate.

### Key Entities

- **Articolo di blog**: contenuto Markdown gestito da Elisa tramite CMS;
  attributi: titolo, data, estratto, immagine di copertina, tag, stato
  pubblicato/bozza.
- **Configurazione di autenticazione CMS**: identità e permessi di chi può
  pubblicare contenuti (oggi: Elisa), separata dall'hosting del sito
  pubblico.
- **Informativa privacy**: pagina che documenta i servizi terzi e il
  trattamento dati collegato a form contatti e prenotazioni.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Elisa completa la pubblicazione di un nuovo articolo dal
  pannello `/admin/` senza assistenza tecnica, in meno di 10 minuti.
- **SC-002**: Un push sul branch principale produce un sito pubblicato e
  raggiungibile online entro pochi minuti, senza intervento manuale su
  server.
- **SC-003**: Da qualunque pagina, l'informativa privacy è raggiungibile in
  un click.
- **SC-004**: Il sito compila senza errori né avvisi di markup.
- **SC-005**: Il repository non contiene più riferimenti operativi
  all'infrastruttura VPS dismessa.

## Assumptions

- Le foto reali del sito vengono caricate direttamente da Elisa tramite CMS
  in un momento successivo: il placeholder attuale sulle immagini è
  intenzionale e resta fuori scope per questa feature.
- Il collegamento del dominio `elisaardinghi.it` al progetto Vercel è
  un'azione manuale sul pannello Vercel/registrar del dominio, fuori scope
  per questo repository ma documentata nei passi di setup.
- La chiave reale di Web3Forms viene fornita da Elisa/proprietario del sito
  e impostata come variabile d'ambiente su Vercel; non è generabile in
  autonomo da questa feature.
- Per l'autenticazione del CMS si usa un progetto Netlify dedicato
  esclusivamente a Identity + Git Gateway; non serve ospitare nessun
  contenuto pubblico su Netlify.
