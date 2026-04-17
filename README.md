# Sito Web Dott.ssa Elisa Ardinghi - Psicologa Clinica

Questo progetto è un sito web professionale e moderno costruito con **Astro 6** e **Tailwind CSS v4**. È progettato per essere veloce, accessibile e facilmente gestibile tramite un'interfaccia di amministrazione semplificata.

## 🚀 Tecnologie Utilizzate

- **Framework**: [Astro](https://astro.build/) (v6) - Per performance elevate e SEO ottimizzato.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) - Sistema di design CSS-first.
- **CMS**: [Decap CMS](https://decapcms.org/) - Pannello di controllo per scrivere articoli del blog senza toccare il codice.
- **Integrazioni**: 
  - [Web3Forms](https://web3forms.com/) per i contatti via email.
  - [Cal.com](https://cal.com/) per la prenotazione dei colloqui.

## 📂 Struttura del Progetto

Il progetto è organizzato in modo intuitivo:

```text
/
├── public/              # File statici (immagini, favicon, admin del CMS)
│   ├── admin/           # Pannello di controllo del CMS (config.yml e index.html)
│   └── images/          # Tutte le immagini caricate sul sito
├── src/
│   ├── components/      # Pezzi riutilizzabili (Header, Footer, etc.)
│   ├── content/         # Testi del Blog (file Markdown .md)
│   ├── layouts/         # Struttura base delle pagine (HTML, Meta tag)
│   ├── pages/           # Le singole pagine del sito (Home, Chi sono, Blog, Contatti)
│   ├── styles/          # Stili globali e tema colori (global.css)
│   └── content.config.ts # Configurazione dei dati del blog
├── Caddyfile            # Configurazione del server sulla VPS
├── astro.config.mjs     # Impostazioni principali del sito
└── package.json         # Elenco dei comandi e delle dipendenze
```

## 📝 Gestione dei Contenuti (Blog)

Per aggiungere o modificare articoli, Elisa può accedere all'area riservata all'indirizzo:
`https://elisaardinghi.it/admin/`

I contenuti vengono salvati automaticamente come file Markdown nella cartella `src/content/blog/`.

## 🛠 Comandi Utili

Tutti i comandi vanno eseguiti nel terminale dalla cartella principale del progetto:

| Comando | Azione |
| :--- | :--- |
| `npm install` | Installa tutte le dipendenze (da fare la prima volta). |
| `npm run dev` | Avvia il sito in modalità sviluppo su `localhost:4321`. |
| `npm run build` | Compila il sito per la produzione nella cartella `/dist/`. |
| `npm run preview` | Visualizza in locale la versione finale compilata. |

## 🌐 Deployment (Caricamento online)

Il deploy è automatizzato tramite **GitHub Actions**. Quando viene fatto un "Push" sul ramo `main`, GitHub:
1. Compila il progetto.
2. Trasferisce i file via SSH sulla VPS Hetzner.

Le guide dettagliate per il setup della VPS e dei Secret di GitHub si trovano nella cartella `docs/`.

---
*Progetto realizzato e documentato per Elisa Ardinghi.*
