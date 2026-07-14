# Phase 0 Research: Editable Page Content (Storyblok)

## Decisione 1: Integrazione Astro

**Decision**: Pacchetto ufficiale `@storyblok/astro`, aggiunto come
integrazione in `astro.config.mjs` con `accessToken` (token pubblico "Content
Delivery API", non il token di management) letto da variabile d'ambiente
`STORYBLOK_TOKEN`. Fetch delle storie in build tramite `useStoryblokApi()`,
versione `"published"` in produzione.

**Rationale**: È l'SDK ufficiale mantenuto da Storyblok stesso per Astro,
copre fetch, mapping dei bloks a componenti (`storyblokEditable()`,
`<StoryblokComponent>`) e supporto al Visual Editor. Nessuna integrazione
custom da scrivere.

**Alternatives considered**: Chiamare l'API REST di Storyblok a mano con
`fetch()` — scartato, reinventerebbe cose che l'SDK ufficiale già fa
(mapping componenti, gestione bridge, tipi TypeScript).

---

## Decisione 2: Modellazione dei contenuti (bloks)

**Decision**: Un content type "page" per Home/Chi Sono/Contatti, ciascuno
con un campo `body` di tipo "Blocks" (lista di bloks annidati) che accetta
solo i tipi di blok pertinenti a quella pagina (vedi `data-model.md`). I
blok ripetibili (card servizio, voce timeline, tag formazione) sono essi
stessi bloks, inseriti come elementi di una lista dentro un blok
contenitore (es. `services_grid.cards[]`).

**Rationale**: Corrisponde 1:1 al modo in cui Storyblok implementa
"riordina/aggiungi/rimuovi blocchi ripetuti trascinando" (FR-002): sono
liste di bloks, che l'editor visuale mostra come elementi trascinabili.

**Alternatives considered**: Un singolo blok "page" con campi piatti
(stringhe fisse per ogni card) — scartato, non permetterebbe di aggiungere
o rimuovere card (viola FR-002 esplicitamente).

---

## Decisione 3: Icone delle card servizio

**Decision**: Campo "icona" come select con opzioni fisse (es.
`caregiver`, `bambini`, `ansia`, `consulenza`), mappate lato codice a SVG
già esistenti in `ServiceCard.astro` tramite uno switch.

**Rationale**: Vincolo esplicito dell'utente (nessuna modifica al
frontend/design) e principio di sicurezza: un campo "HTML libero" per SVG
permetterebbe a chiunque abbia accesso a Storyblok di iniettare markup
arbitrario nella pagina pubblica. Uno switch chiuso su valori noti è più
sicuro e comunque sufficiente: Elisa può scegliere tra le icone esistenti,
non inventarne di nuove (coerente con Principio II: nuovi tipi/asset
restano lavoro da sviluppatore).

**Alternatives considered**: Upload SVG come asset Storyblok — scartato,
introdurrebbe complessità (validazione, styling coerente) sproporzionata
per 4 card fisse.

---

## Decisione 4: Aggiornamento del sito dopo la pubblicazione

**Decision**: Webhook nativo di Storyblok (Settings → Webhooks, o
integrazione "Vercel" diretta se disponibile nello spazio) che chiama il
Deploy Hook URL di Vercel ad ogni pubblicazione di una storia.

**Rationale**: Stesso pattern già usato per il deploy da GitHub (push →
build automatica): un evento esterno innesca una build Vercel, zero
pipeline custom (Principio V). Storyblok e Vercel supportano entrambi
questo collegamento nativamente via URL, senza codice.

**Alternatives considered**: Rigenerazione on-demand (ISR/SSR) — scartato,
richiederebbe cambiare `output` da statico a server e introdurrebbe
infrastruttura server-side non necessaria per un sito a bassa frequenza di
modifica (Principio I).

---

## Decisione 5: Editor visuale in tempo reale (Storyblok Bridge)

**Decision**: Includere lo script `@storyblok/js`'s bridge (o l'helper
equivalente di `@storyblok/astro`) solo quando la pagina è caricata dentro
l'iframe dell'editor Storyblok (rilevabile dal parametro `_storyblok`
nell'URL), per aggiornare l'anteprima in tempo reale senza un rebuild
completo ad ogni tasto premuto.

**Rationale**: È il pezzo che rende l'esperienza "visuale reale" invece di
un form con anteprima statica da ricaricare a mano — motivo esplicito
della scelta di Storyblok rispetto a Decap/TinaCMS. Caricato solo in
modalità editor: zero impatto JS sul sito pubblico visitato dagli utenti
reali.

**Alternatives considered**: Nessun bridge, solo fetch di `version:draft`
con refresh manuale della pagina — scartato, degraderebbe l'esperienza a
qualcosa di simile a Decap CMS, vanificando il motivo del cambio di CMS.

---

## Decisione 6: Migrazione dell'articolo di blog esistente

**Decision**: L'unico articolo esistente
(`src/content/blog/cosa-significa-essere-caregiver.md`) viene ricreato
manualmente come storia Storyblok di tipo `blog_post` durante il setup
(copia/incolla del contenuto), non tramite script di migrazione
automatica.

**Rationale**: Un solo articolo non giustifica scrivere ed eseguire uno
script una tantum (Principio I, YAGNI) — il copia/incolla manuale richiede
meno tempo che scrivere/testare un migratore.

**Alternatives considered**: Script Node one-off con Storyblok Management
API — scartato per un singolo articolo, si valuterà se in futuro emergono
più contenuti da migrare in blocco.
