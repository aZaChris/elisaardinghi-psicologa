# Quickstart: Validazione Editable Page Content

## Prerequisiti

- Uno spazio Storyblok creato, con token "Preview" (Content Delivery API)
- `STORYBLOK_TOKEN` impostato come variabile d'ambiente (locale in `.env`,
  produzione nel pannello Vercel)
- Componenti pushati nello spazio (`.storyblok/components/*.json` via CLI)
- Storie `home`, `chi-sono`, `contatti` create e pubblicate con contenuto
- Webhook Storyblok → Vercel Deploy Hook configurato

## 1. Build con dati reali

```bash
npm run build
```

**Atteso**: build completata senza errori; le pagine generate contengono i
testi presenti su Storyblok (non più i testi hardcoded precedenti).

## 2. Editing visuale (User Story 1)

1. Apri la storia "Home" su app.storyblok.com in modalità Visual Editor.
2. Modifica il testo del titolo hero.
3. Verifica che l'anteprima nell'iframe si aggiorni senza refresh manuale
   (bridge attivo).
4. Pubblica.

**Atteso**: dopo il webhook/deploy, il sito pubblico mostra il nuovo testo.

## 3. Riordino blocchi ripetuti (User Story 2)

1. Nella storia "Chi Sono", apri il blok `timeline`.
2. Trascina una voce `timeline_entry` in una posizione diversa.
3. Aggiungi una nuova voce duplicando quella esistente.
4. Pubblica.

**Atteso**: il sito pubblico riflette il nuovo ordine e la voce aggiunta,
con lo stesso stile delle altre (SC-002).

## 4. Verifica visiva (nessun cambio di design — SC-003)

Confronta uno screenshot di ciascuna pagina (Home, Chi Sono, Contatti)
prima e dopo la migrazione: layout, colori, spaziature devono coincidere.

## 5. Blog (User Story 3)

1. Crea una nuova storia di tipo `blog_post`.
2. Compila i campi, pubblica.
3. Verifica che l'articolo appaia in `/blog/` e nella sua pagina dedicata
   dopo il deploy.

## 6. Pulizia (SC-004)

Verifica che `public/admin/`, `docs/cms-identity-setup.md` e le regole di
redirect `/admin` in `vercel.json` non esistano più nel repository.
