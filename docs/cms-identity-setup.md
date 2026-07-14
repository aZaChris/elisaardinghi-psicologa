# Setup autenticazione CMS (Netlify Identity + Git Gateway)

Il sito pubblico gira su **Vercel**, ma il pannello `/admin/` (Decap CMS) usa
`git-gateway`, un servizio che esiste solo su **Netlify**. Per farlo
funzionare si crea un progetto Netlify separato, usato **solo** per il login
di Elisa e per far scrivere il CMS su GitHub — nessun contenuto pubblico
viene servito da lì.

Questa è un'operazione manuale, da fare una volta sola.

## 1. Creare il progetto Netlify

1. Vai su [app.netlify.com](https://app.netlify.com/) e accedi (o crea un
   account gratuito).
2. "Add new site" → "Import an existing project" → collega lo stesso
   repository GitHub di questo sito.
3. Non serve una build reale: come "Build command" lascia vuoto o metti
   `echo ok`, come "Publish directory" metti `public` (Netlify pubblicherà
   solo file statici innocui, non useremo mai l'URL pubblico di Netlify per
   il sito vero).
4. Annota il nome del progetto assegnato da Netlify (es.
   `elisaardinghi-cms-XXXX.netlify.app`).

## 2. Attivare Identity

1. Nel progetto Netlify appena creato: **Site configuration → Identity →
   Enable Identity**.
2. In **Registration preferences**, imposta "Invite only" (nessuna
   registrazione pubblica).
3. In **External providers** puoi lasciare tutto disattivato: si userà
   email/password o invito diretto.

## 3. Attivare Git Gateway

1. Sempre in Identity, vai su **Services → Git Gateway → Enable Git
   Gateway**.
2. Autorizza l'accesso al repository GitHub quando richiesto.

## 4. Invitare Elisa

1. In **Identity → Invite users**, inserisci l'email di Elisa.
2. Elisa riceverà una email per impostare la password.

## 5. Collegare il sito al progetto Netlify

1. In `public/admin/config.yml`, sostituisci `NOME-PROGETTO` (in
   `identity_url` e `gateway_url`) con il nome reale del progetto Netlify
   (es. `elisaardinghi-cms-XXXX`).
2. In `public/admin/index.html`, sostituisci allo stesso modo `NOME-PROGETTO`
   nell'`APIUrl` passato a `netlifyIdentity.init(...)`.
3. Fai commit e push: Vercel ripubblica il sito con la configurazione
   corretta.

## 6. Verifica

Segui gli scenari 3 e 4 di
[`specs/001-launch-readiness/quickstart.md`](../specs/001-launch-readiness/quickstart.md):
Elisa deve riuscire a fare login su `https://elisaardinghi.it/admin/`,
creare un articolo e vederlo pubblicato dopo il prossimo deploy.
