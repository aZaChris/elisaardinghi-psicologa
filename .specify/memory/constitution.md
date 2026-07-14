<!--
Sync Impact Report
- Version change: 1.0.0 → 2.0.0
- Modified principles: II. Elisa Deve Poter Lavorare Da Sola (Decap CMS →
  editor visuale Storyblok, blocchi riordinabili)
- Added sections: none
- Removed sections: none
- Technical Constraints: CMS auth (git-gateway/Netlify Identity) sostituito
  con Storyblok + webhook di deploy; Decap CMS dismesso
- Templates requiring updates:
  - .specify/templates/plan-template.md ✅ compatible
  - .specify/templates/spec-template.md ✅ compatible
  - .specify/templates/tasks-template.md ✅ compatible
- Follow-up TODOs: rimuovere public/admin/, config Decap, vercel.json
  redirect /admin, docs/cms-identity-setup.md (feature 002)
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
frequenza (testi di Home/Chi Sono/Contatti, articoli del blog, immagini,
ordine delle sezioni ripetute) DEVE essere modificabile visivamente da
Elisa tramite l'editor visuale di Storyblok, senza intervento di uno
sviluppatore. Elisa può riordinare, duplicare o rimuovere istanze dei
blocchi di contenuto già esistenti (es. un'altra card servizio, una voce
timeline in più); creare un nuovo TIPO di blocco mai esistito, o
modificare struttura/stile del sito, resta lavoro da sviluppatore.

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

- Stack: Astro 6 (output statico) + Tailwind CSS v4 + Storyblok (CMS
  headless con editor visuale).
- Hosting: Vercel, build automatica dal branch `master`, ritriggerata da
  un webhook di Storyblok quando Elisa pubblica una modifica.
- Contenuti (Home, Chi Sono, Contatti, articoli blog): gestiti su
  Storyblok come "storie" composte da blocchi (bloks) tipizzati, letti da
  Astro via `@storyblok/astro` in fase di build (versione "published").
- Integrazioni terze: Web3Forms (contatti), Cal.com (prenotazioni). Vanno
  usate le chiavi/ID reali in produzione, mai placeholder.

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

**Version**: 2.0.0 | **Ratified**: 2026-07-14 | **Last Amended**: 2026-07-14
