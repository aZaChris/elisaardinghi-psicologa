# Phase 0 Research: Launch Readiness

## Decisione 1: Hosting pubblico

**Decision**: Vercel, collegato al repository GitHub, build automatica sul
branch `master`. Nessun adapter Astro necessario (output statico, Vercel lo
riconosce e serve `dist/` da solo).

**Rationale**: Il sito è già confermato dall'utente come "resta su Vercel
per il momento". È zero-config per un output statico Astro: niente server da
patchare, niente pipeline custom da mantenere (Principio V).

**Alternatives considered**: VPS Hetzner + Caddy (setup esistente, ma
richiede manutenzione server, gestione chiavi SSH, rinnovo Caddy/TLS —
scartato perché il sito non ha bisogno di un server dedicato per essere
servito).

---

## Decisione 2: Autenticazione CMS (Decap)

**Decision**: Mantenere Decap CMS con backend `git-gateway`, ma spostare il
servizio di Identity + Git Gateway su un progetto Netlify dedicato
esclusivamente a questo scopo (nessun contenuto pubblico servito da lì). In
`public/admin/config.yml` si aggiungono `backend.identity_url` e
`backend.gateway_url` puntati al dominio `*.netlify.app` di quel progetto.

**Rationale**: `git-gateway` è un proxy specifico di Netlify tra Identity e
l'API Git — non esiste equivalente su Vercel. Creare un progetto Netlify
"vuoto" (anche solo un README) e attivare Identity + Git Gateway lì è il modo
minimo per riusare l'attuale `public/admin/index.html` (già scritto per
Netlify Identity Widget) senza cambiare CMS né riscrivere il pannello admin.
Questo pattern (Netlify solo per Identity, sito altrove) è quello
storicamente documentato per Decap/Netlify CMS su hosting non-Netlify.

**Alternatives considered**:
- **Backend `github` di Decap CMS** (OAuth diretto con GitHub, serve una
  piccola app OAuth/proxy, es. una funzione serverless su Vercel stesso):
  soluzione più "nativa" e senza dipendere da un secondo servizio esterno,
  ma richiede scrivere e mantenere un endpoint OAuth — più codice per un
  sito con un solo editor di contenuti. Rimane un'opzione futura se si
  vuole eliminare del tutto la dipendenza da Netlify.
- **Rimuovere il CMS web**: editing diretto dei file Markdown su GitHub o in
  locale — scartato perché viola il Principio II (Elisa deve poter lavorare
  da sola senza sviluppatore né Git).

**Nota per implementazione**: la creazione effettiva del progetto Netlify
(account, attivazione Identity, invito utente Elisa) è un'azione manuale
fuori dal repository — documentata come guida in
`docs/cms-identity-setup.md` (Fase 1 / quickstart).

---

## Decisione 3: Chiave Web3Forms e altri segreti

**Decision**: Restano variabili d'ambiente (`PUBLIC_WEB3FORMS_KEY`) impostate
nel pannello Vercel (Project Settings → Environment Variables), mai
committate. Il codice esistente in `contatti.astro` già legge
`import.meta.env.PUBLIC_WEB3FORMS_KEY` con fallback placeholder — nessuna
modifica di codice necessaria, solo configurazione in produzione (azione
manuale dell'utente/Elisa, fuori scope di codice).

**Rationale**: Pattern già corretto nel codice esistente; il problema è solo
che la chiave reale non è ancora stata impostata. Nessuna nuova astrazione
richiesta.

---

## Decisione 4: Informativa privacy

**Decision**: Una singola pagina statica Astro (`src/pages/privacy.astro`),
stesso Layout/Header/Footer delle altre pagine, linkata dal Footer. Contenuto
in italiano, elenca: Web3Forms (invio email dal form contatti), Cal.com
(widget di prenotazione, imposta cookie/dati su dominio cal.com), hosting
Vercel, e il servizio di Identity Netlify usato solo dal CMS (non tocca dati
di visitatori pubblici).

**Rationale**: Nessun servizio di gestione "cookie banner" è necessario per
lo scope attuale: gli unici script di terze parti (Cal.com embed) partono
già al caricamento della home (nessun cambiamento di comportamento
richiesto da questa feature) — l'informativa serve a dichiarare cosa
succede, non introduce un consent manager (non richiesto dallo spec,
YAGNI). Se in futuro si aggiunge analytics con cookie non essenziali, sarà
necessario un banner di consenso: fuori scope qui.

**Alternatives considered**: Libreria di cookie-consent (es. Klaro,
CookieConsent) — scartata, nessun cookie non essenziale viene impostato
oggi dal sito stesso; aggiungerne una sarebbe complessità non richiesta.
