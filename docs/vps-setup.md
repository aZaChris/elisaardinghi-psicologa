# Guida Setup Iniziale VPS Hetzner (Ubuntu 24.04)

Questa guida ti aiuta a configurare la tua VPS per ospitare il sito di Elisa Ardinghi tramite Caddy e automatizzare il deploy con GitHub Actions in modo sicuro, rispettando corretti permessi e privilegi.

## 1. Connessione Iniziale

Accedi alla tua VPS come root:
```bash
ssh root@<IP_DELLA_VPS>
```

Aggiorna il sistema:
```bash
apt update && apt upgrade -y
```

## 2. Creazione dell'utente `deploy`

Evita di usare `root` per GitHub Actions. Crea un utente `deploy` senza privilegi di root espliciti, solo dedicato a caricare i file del sito.

```bash
# Crea l'utente deploy senza password interattiva
adduser deploy --disabled-password --gecos ""

# Crea la directory SSH per l'utente deploy
mkdir /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
```

## 3. Configurazione della Cartella Web e Permessi

Il tuo server Caddy leggerà i file da `/var/www/elisaardinghi`. L'utente `deploy` deve avere il permesso di scrivere in questa cartella.

```bash
# Crea la cartella root del sito web
mkdir -p /var/www/elisaardinghi

# Imposta l'utente deploy come proprietario della cartella
chown -R deploy:www-data /var/www/elisaardinghi

# Imposta i permessi: l'utente deploy può leggere e scrivere, il server web (www-data) può leggere
chmod -R 750 /var/www/elisaardinghi
```

In questo modo, quando GitHub Actions invierà i file usando `rsync`, entrerà come `deploy` e scriverà i file in tranquillità. Caddy (che solitamente esegue come `caddy` o `www-data`) potrà leggere i file e inviarli ai visitatori (il `5` di `750` concede read ed execute al gruppo `www-data`).

*(Nota: su alcuni sistemi Caddy gira come utente `caddy`. In tal caso usa `chown -R deploy:caddy /var/www/elisaardinghi` e `usermod -aG caddy deploy`)*

## 4. SSH Key per GitHub Actions

Ora dal tuo computer locale (o tramite GitHub Actions), devi generare una coppia di chiavi SSH.

```bash
# Esegui questo sul tuo computer (non sul server)
ssh-keygen -t ed25519 -C "github_actions@elisaardinghi" -f ./deploy_key
```

Otterrai due file:
- `deploy_key` (Chiave privata, da copiare in GitHub Secrets come `SSH_KEY`)
- `deploy_key.pub` (Chiave pubblica)

Ora copia il testualmente contenuto di `deploy_key.pub` e, sul server (in SSH), incollalo dentro il file `authorized_keys` dell'utente deploy:

```bash
nano /home/deploy/.ssh/authorized_keys
# Incolla la chiave e salva (CTRL+O, INVIO, CTRL+X)
```

## 5. Installazione di Caddy Server

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## 6. Configurazione Caddyfile

Ora clona il Caddyfile o configuralo manualmente:

```bash
nano /etc/caddy/Caddyfile
```

Incolla il contenuto del `Caddyfile` provvisto dal progetto.

Riavvia Caddy per applicare:
```bash
systemctl restart caddy
systemctl enable caddy
```

## 7. Secrets richiesti in GitHub Repository

Su GitHub entra in `Settings > Secrets and variables > Actions > New repository secret`:
- `VPS_HOST`: L'IP della tua VPS Hetzner.
- `SSH_KEY`: Il contenuto di `deploy_key` (la chiave privata generata prima, ricordati di includere BEGIN e END header).
- `WEB3FORMS_KEY`: La tua access key di Web3Forms per il form Contatti.

Il gioco è fatto! Pushando su `main` attiverà il deploy, i permessi sono salvi e il server aggiornerà il CMS automaticamente.
