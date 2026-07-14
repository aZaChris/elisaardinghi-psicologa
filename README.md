# Sito Web Dott.ssa Elisa Ardinghi - Psicologa Clinica

Questo progetto è un sito web professionale e moderno costruito con **Astro 6** e **Tailwind CSS v4**. È progettato per essere veloce, accessibile e facilmente gestibile da Elisa tramite un editor visuale.

## 🚀 Tecnologie Utilizzate

- **Framework**: [Astro](https://astro.build/) (v6) - Per performance elevate e SEO ottimizzato.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) - Sistema di design CSS-first.
- **CMS**: [Storyblok](https://www.storyblok.com/) - Editor visuale (drag & drop, anteprima live) per testi di Home/Chi Sono/Contatti e articoli del blog, senza toccare il codice.
- **Integrazioni**:
  - [Web3Forms](https://web3forms.com/) per i contatti via email.
  - [Cal.com](https://cal.com/) per la prenotazione dei colloqui.

## 📂 Struttura del Progetto

Il progetto è organizzato in modo intuitivo:

```text
/
├── public/               # File statici (immagini, favicon)
├── src/
│   ├── components/       # Header, Footer (invariati, non gestiti da CMS)
│   ├── storyblok/        # Componenti Astro mappati ai blocchi (bloks) di Storyblok
│   ├── layouts/          # Struttura base delle pagine (HTML, Meta tag)
│   ├── pages/             # Pagine del sito: leggono i contenuti da Storyblok in fase di build
│   └── styles/            # Stili globali e tema colori (global.css)
├── scripts/storyblok-setup.mjs # Script one-off per creare gli schema dei blocchi su Storyblok
├── docs/storyblok-setup.md      # Guida al setup dello spazio Storyblok e del webhook
├── astro.config.mjs      # Impostazioni principali del sito + integrazione Storyblok
└── package.json          # Elenco dei comandi e delle dipendenze
```

## 📝 Gestione dei Contenuti

Elisa modifica i testi di Home, Chi Sono, Contatti e gli articoli del blog
direttamente su [app.storyblok.com](https://app.storyblok.com/), con
anteprima visiva della pagina reale mentre scrive. Può riordinare o
aggiungere card, voci della timeline e tag trascinandoli nell'editor.

Il primo setup dello spazio Storyblok (schema dei blocchi, webhook di
deploy) è descritto in [docs/storyblok-setup.md](docs/storyblok-setup.md).

## 🛠 Comandi Utili

Tutti i comandi vanno eseguiti nel terminale dalla cartella principale del progetto:

| Comando | Azione |
| :--- | :--- |
| `npm install` | Installa tutte le dipendenze (da fare la prima volta). |
| `npm run dev` | Avvia il sito in modalità sviluppo su `localhost:4321`. |
| `npm run build` | Compila il sito per la produzione nella cartella `/dist/`. |
| `npm run preview` | Visualizza in locale la versione finale compilata. |

Per lo sviluppo locale serve un file `.env` con `STORYBLOK_TOKEN` (Preview
token dello spazio Storyblok).

## 🌐 Deployment (Caricamento online)

Il deploy è automatizzato tramite **Vercel**, collegato direttamente a questo repository GitHub: ogni push sul ramo `master` avvia una build e pubblica automaticamente la nuova versione. Un webhook Storyblok → Vercel Deploy Hook ritriggera la build anche quando Elisa pubblica una modifica ai contenuti (vedi [docs/storyblok-setup.md](docs/storyblok-setup.md)).

Variabili d'ambiente da impostare nel pannello Vercel del progetto (Project Settings → Environment Variables):

- `PUBLIC_WEB3FORMS_KEY` — chiave del form contatti
- `STORYBLOK_TOKEN` — Preview token dello spazio Storyblok

---
*Progetto realizzato e documentato per Elisa Ardinghi.*
