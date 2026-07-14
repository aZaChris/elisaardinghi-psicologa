<!--
Sync Impact Report
- Version change: (none) → 1.0.0
- Modified principles: n/a (initial ratification)
- Added sections: Core Principles (5), Technical Constraints, Development Workflow, Governance
- Removed sections: template placeholders
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ compatible (generic Constitution Check gate, no changes needed)
  - .specify/templates/spec-template.md ✅ compatible
  - .specify/templates/tasks-template.md ✅ compatible
- Follow-up TODOs: none
-->

# Sito Elisa Ardinghi Psicologa Constitution

## Core Principles

### I. Static-First, Minimal Moving Parts
Il sito è e resta un sito statico (Astro, output statico). Niente backend
proprietario, niente database, niente framework applicativo aggiunto per
funzionalità che un servizio esterno o una feature nativa della piattaforma
già copre (form → Web3Forms, prenotazioni → embed Cal.com, contenuti →
Markdown + CMS). Ogni nuova dipendenza deve giustificare perché una soluzione
più semplice (HTML/CSS nativo, integrazione Astro esistente, libreria già
installata) non basta.

### II. Elisa Deve Poter Lavorare Da Sola
La dottoressa non scrive codice. Ogni contenuto che cambia con una certa
frequenza (articoli del blog, testi, immagini) DEVE essere modificabile da
`/admin/` (Decap CMS) senza intervento di uno sviluppatore. Le modifiche che
richiedono per forza codice (nuove pagine, nuove sezioni strutturali, nuove
integrazioni) restano lavoro da sviluppatore.

### III. Privacy e Trust by Design
Sito di ambito sanitario/psicologico: tono, contenuti e struttura dati DEVONO
rispettare GDPR anche se il sito non tratta dati clinici direttamente.
Qualunque servizio terzo che raccoglie dati dell'utente (form contatti,
widget di prenotazione, CMS, hosting, eventuale analytics) DEVE essere
dichiarato in un'informativa privacy/cookie accessibile da ogni pagina.
Nessun tracciamento non essenziale senza consenso esplicito.

### IV. Contenuto e Accessibilità Prima Della Forma
Testi in italiano, chiari, verificati dalla dottoressa prima della
pubblicazione. HTML semantico, contrasto colori adeguato, form navigabili da
tastiera e compatibili con screen reader. Le performance (Core Web Vitals)
sono un requisito, non un nice-to-have: il sito è spesso il primo contatto
con una persona in un momento di vulnerabilità e deve caricare velocemente
anche su connessioni mobili scarse.

### V. Deploy Semplice, Nessuna Infrastruttura Da Mantenere
Deploy automatico su push al branch principale (Vercel collegato al
repository GitHub). Nessuna VPS, nessun server da patchare, nessuna pipeline
custom oltre a quella già fornita dalla piattaforma di hosting, salvo
necessità concreta e documentata.

## Technical Constraints

- Stack: Astro 6 (output statico) + Tailwind CSS v4 + Decap CMS.
- Hosting: Vercel, build automatica dal branch `master`.
- CMS auth: backend `git-gateway`, Identity fornita da un progetto Netlify
  dedicato esclusivamente all'autenticazione di `/admin/` (il sito pubblico
  resta su Vercel).
- Integrazioni terze: Web3Forms (contatti), Cal.com (prenotazioni). Vanno
  usate le chiavi/ID reali in produzione, mai placeholder.
- Contenuti blog: Markdown in `src/content/blog/`, gestiti via Content
  Collections di Astro.

## Development Workflow

- Le feature non banali seguono il flusso Spec Kit: `/speckit-specify` →
  `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
- Bug fix piccoli e correzioni di contenuto non richiedono il flusso
  completo: si corregge direttamente, root cause, diff minimo.
- Ogni modifica che tocca dati personali, form o servizi terzi deve
  verificare la Principle III (privacy) prima di essere considerata completa.

## Governance

La costituzione prevale su preferenze estemporanee di stile o stack. Le
modifiche a questo documento passano da `/speckit-constitution`, con bump di
versione secondo semver (MAJOR = rimozione/ridefinizione di un principio,
MINOR = principio aggiunto, PATCH = chiarimenti). Ogni piano (`/speckit-plan`)
deve essere verificato contro questi principi prima dell'implementazione.

**Version**: 1.0.0 | **Ratified**: 2026-07-14 | **Last Amended**: 2026-07-14
