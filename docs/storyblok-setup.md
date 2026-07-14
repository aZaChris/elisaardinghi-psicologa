# Setup Storyblok

Guida per collegare da zero questo repository a un nuovo spazio Storyblok
(es. per un ambiente di staging, o se lo spazio attuale va ricreato).

## 1. Creare lo spazio

1. Vai su [app.storyblok.com](https://app.storyblok.com/) e crea un account/spazio gratuito.
2. Annota l'**ID dello spazio** (visibile nell'URL della dashboard, es. `app.storyblok.com/#/me/spaces/123456789/...`) e la **regione** (EU o US, visibile in Settings → General).

## 2. Recuperare i token

- **Preview token** (sola lettura contenuti): Settings → Access Tokens → riga "Preview". Va in `.env` come `STORYBLOK_TOKEN`, e nelle Environment Variables di Vercel.
- **Personal Access Token** (gestione, permessi di scrittura): avatar in alto a destra → Account Settings → Personal Access Tokens. Serve **solo in locale**, per eseguire lo script di setup una tantum — non va mai in produzione né condiviso.

Nel file `.env` locale (mai committato):

```
STORYBLOK_TOKEN=<preview-token>
STORYBLOK_PERSONAL_TOKEN=<personal-access-token>
STORYBLOK_SPACE_ID=<id-numerico-spazio>
```

## 3. Creare schema dei blocchi e storie iniziali

```bash
node scripts/storyblok-setup.mjs
```

Lo script è idempotente: crea (o aggiorna se già esistenti) tutti i
componenti descritti in `specs/002-editable-page-content/data-model.md`,
e popola le storie `home`, `chi-sono`, `contatti` e un articolo di blog di
esempio con i contenuti già presenti sul sito.

## 4. Collegare il deploy automatico (webhook)

1. Su Vercel, apri il progetto → Settings → Git → **Deploy Hooks** → crea un hook (branch `master`), copia l'URL generato.
2. Su Storyblok, apri lo spazio → Settings → Webhooks → **Add webhook**:
   - Nome: "Deploy su Vercel"
   - Trigger: **Story published / unpublished**
   - URL: incolla l'URL del Deploy Hook di Vercel

Da questo momento, ogni volta che Elisa pubblica una modifica su Storyblok, Vercel ribuilda e pubblica il sito automaticamente.

## 5. Editing visuale

1. Apri una storia (es. "Home") su Storyblok.
2. Nel pannello di anteprima, verifica che punti all'URL del sito (Settings → Visual Editor → Location: `https://elisaardinghi.it/` o l'URL di preview Vercel).
3. Modifica un testo: l'anteprima si aggiorna in tempo reale.
4. Per riordinare/aggiungere blocchi ripetuti (card servizio, voci timeline, tag), trascina gli elementi nella lista a sinistra dell'editor.
5. Pubblica per rendere le modifiche visibili sul sito pubblico dopo il deploy.
