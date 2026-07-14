// Script una tantum (idempotente) per creare/aggiornare gli schema dei
// componenti Storyblok e popolare le storie iniziali con i contenuti già
// esistenti sul sito. Vedi docs/storyblok-setup.md.
//
// Uso: node scripts/storyblok-setup.mjs
// Richiede STORYBLOK_PERSONAL_TOKEN in .env (Management API, permessi di
// scrittura sullo spazio) e STORYBLOK_SPACE_ID.

import { readFileSync } from 'node:fs';

const envFile = readFileSync(new URL('../.env', import.meta.url), 'utf-8');
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] ||= rest.join('=').trim();
}

const TOKEN = process.env.STORYBLOK_PERSONAL_TOKEN;
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;

if (!TOKEN || !SPACE_ID) {
  console.error('Mancano STORYBLOK_PERSONAL_TOKEN e/o STORYBLOK_SPACE_ID in .env');
  process.exit(1);
}

const API = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ponytail: rate limit fisso (6 req/s), un sleep dopo ogni chiamata basta
// per uno script one-off — niente coda/backoff sofisticato.
async function mapi(path, options = {}) {
  await sleep(400);
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: TOKEN,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (res.status === 429) {
    await sleep(2000);
    return mapi(path, options);
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${options.method || 'GET'} ${path} -> ${res.status}: ${body}`);
  }
  return res.status === 204 ? null : res.json();
}

// ---------- Component schemas ----------

const field = (type, extra = {}) => ({ type, ...extra });
const bloks = (whitelist) => field('bloks', { restrict_components: true, component_whitelist: whitelist });

const components = [
  {
    name: 'hero', display_name: 'Hero', is_nestable: true,
    schema: {
      title: field('text'),
      title_highlight: field('text'),
      subtitle: field('textarea'),
      cta_primary_text: field('text'),
      cta_secondary_text: field('text'),
      image: field('asset', { filetypes: ['images'] }),
    },
  },
  {
    name: 'service_card', display_name: 'Card Servizio', is_nestable: true,
    schema: {
      icon: field('option', { options: [
        { name: 'Caregiver', value: 'caregiver' },
        { name: 'Bambini', value: 'bambini' },
        { name: 'Ansia', value: 'ansia' },
        { name: 'Consulenza', value: 'consulenza' },
      ]}),
      title: field('text'),
      description: field('textarea'),
    },
  },
  {
    name: 'services_grid', display_name: 'Griglia Servizi', is_nestable: true,
    schema: {
      eyebrow: field('text'),
      title: field('text'),
      cards: bloks(['service_card']),
    },
  },
  {
    name: 'bio_teaser', display_name: 'Bio Breve (Home)', is_nestable: true,
    schema: {
      title: field('text'),
      quote: field('textarea'),
      link_text: field('text'),
    },
  },
  {
    name: 'booking_section', display_name: 'Sezione Prenotazione', is_nestable: true,
    schema: {
      title: field('text'),
      description: field('textarea'),
      cal_link: field('text'),
    },
  },
  {
    name: 'instagram_teaser', display_name: 'Teaser Instagram', is_nestable: true,
    schema: {
      title: field('text'),
      handle: field('text'),
      profile_url: field('text'),
    },
  },
  {
    name: 'home', display_name: 'Home', is_root: true,
    schema: {
      body: bloks(['hero', 'services_grid', 'bio_teaser', 'booking_section', 'instagram_teaser']),
    },
  },
  {
    name: 'bio', display_name: 'Bio Estesa', is_nestable: true,
    schema: {
      quote: field('textarea'),
      paragraphs: field('textarea'),
    },
  },
  {
    name: 'timeline_entry', display_name: 'Voce Timeline', is_nestable: true,
    schema: {
      year: field('text'),
      title: field('text'),
      description: field('textarea'),
    },
  },
  {
    name: 'timeline', display_name: 'Timeline', is_nestable: true,
    schema: {
      title: field('text'),
      entries: bloks(['timeline_entry']),
    },
  },
  {
    name: 'tag_item', display_name: 'Tag', is_nestable: true,
    schema: { text: field('text') },
  },
  {
    name: 'formazione_tags', display_name: 'Tag Formazione', is_nestable: true,
    schema: {
      title: field('text'),
      tags: bloks(['tag_item']),
    },
  },
  {
    name: 'cta_final', display_name: 'CTA Finale', is_nestable: true,
    schema: {
      title: field('text'),
      description: field('textarea'),
      button_text: field('text'),
    },
  },
  {
    name: 'chi_sono', display_name: 'Chi Sono', is_root: true,
    schema: {
      body: bloks(['bio', 'timeline', 'formazione_tags', 'cta_final']),
    },
  },
  {
    name: 'contact_intro', display_name: 'Intro Contatti', is_nestable: true,
    schema: {
      title: field('text'),
      description: field('textarea'),
    },
  },
  {
    name: 'contact_info', display_name: 'Recapiti', is_nestable: true,
    schema: {
      phone: field('text'),
      email: field('text'),
      studio_text: field('textarea'),
    },
  },
  {
    name: 'contatti', display_name: 'Contatti', is_root: true,
    schema: {
      body: bloks(['contact_intro', 'contact_info']),
    },
  },
  {
    name: 'blog_post', display_name: 'Articolo Blog', is_root: true,
    schema: {
      title: field('text'),
      date: field('datetime'),
      excerpt: field('textarea'),
      cover_image: field('asset', { filetypes: ['images'] }),
      tags: field('text', { description: 'Separati da virgola, es: Caregiver, Alzheimer' }),
      published: field('boolean', { default_value: true }),
      body: field('richtext'),
    },
  },
];

async function upsertComponent(def) {
  const { components: existing } = await mapi('/components/');
  const found = existing.find((c) => c.name === def.name);
  const payload = { component: def };
  if (found) {
    await mapi(`/components/${found.id}`, { method: 'PUT', body: JSON.stringify(payload) });
    console.log(`✓ aggiornato: ${def.name}`);
  } else {
    await mapi('/components/', { method: 'POST', body: JSON.stringify(payload) });
    console.log(`✓ creato: ${def.name}`);
  }
}

async function findStoryBySlug(fullSlug) {
  const { stories } = await mapi(`/stories/?with_slug=${encodeURIComponent(fullSlug)}`);
  return stories[0] || null;
}

async function upsertStory({ name, slug, content, parent_id, is_folder }) {
  const fullSlug = parent_id ? undefined : slug;
  const existing = fullSlug ? await findStoryBySlug(fullSlug) : null;
  const payload = { story: { name, slug, content, parent_id, is_folder }, publish: is_folder ? 0 : 1 };
  if (existing) {
    await mapi(`/stories/${existing.id}`, { method: 'PUT', body: JSON.stringify({ story: { ...payload.story, id: existing.id }, publish: payload.publish }) });
    console.log(`✓ aggiornata storia: ${slug}`);
    return existing;
  }
  const { story } = await mapi('/stories/', { method: 'POST', body: JSON.stringify(payload) });
  console.log(`✓ creata storia: ${slug}`);
  return story;
}

async function main() {
  console.log('--- Push componenti ---');
  for (const def of components) {
    await upsertComponent(def);
  }

  console.log('--- Creazione storie root ---');

  await upsertStory({
    name: 'Home', slug: 'home',
    content: {
      component: 'home',
      body: [
        {
          component: 'hero',
          title: 'Uno spazio per',
          title_highlight: 'prendersi cura.',
          subtitle: 'Supporto psicologico per caregiver, famiglie e bambini. In studio a Cintolese (PT) e online.',
          cta_primary_text: 'Prenota un colloquio',
          cta_secondary_text: 'Scopri chi sono',
        },
        {
          component: 'services_grid',
          eyebrow: 'Servizi',
          title: 'Aree di intervento',
          cards: [
            { component: 'service_card', icon: 'caregiver', title: 'Caregiver e Alzheimer', description: 'Sostegno psicologico a chi si prende cura di un familiare con demenza. Colloqui individuali e gruppi di sostegno.' },
            { component: 'service_card', icon: 'bambini', title: 'Bambini e adolescenti', description: 'Percorsi personalizzati per bambini con BES, ADHD, DSA e difficoltà scolastico-relazionali.' },
            { component: 'service_card', icon: 'ansia', title: "Disturbi d'ansia", description: 'Supporto per chi vive con ansia, attacchi di panico e difficoltà nella gestione emotiva.' },
            { component: 'service_card', icon: 'consulenza', title: 'Consulenza e orientamento', description: 'Primo colloquio di valutazione, orientamento ai servizi e supporto nel percorso clinico.' },
          ],
        },
        {
          component: 'bio_teaser',
          title: 'La dottoressa',
          quote: "Laureata in Psicologia Clinica, del Lavoro e dello Sviluppo, iscritta all'Albo degli Psicologi della Toscana. Ho svolto il tirocinio presso l'Associazione Italiana Malattia di Alzheimer di Firenze, dove ho maturato esperienza nel sostegno ai caregiver e nei gruppi psicoeducativi.",
          link_text: 'Leggi di più',
        },
        {
          component: 'booking_section',
          title: 'Prenota un colloquio',
          description: 'Il primo passo è sempre il più difficile. Scrivimi o prenota direttamente un colloquio conoscitivo — gratuito e senza impegno.',
          cal_link: 'elisaardinghi',
        },
        {
          component: 'instagram_teaser',
          title: 'Seguimi su Instagram',
          handle: '@elisaardinghi.psy',
          profile_url: 'https://www.instagram.com/elisaardinghi.psy/',
        },
      ],
    },
  });

  await upsertStory({
    name: 'Chi Sono', slug: 'chi-sono',
    content: {
      component: 'chi_sono',
      body: [
        {
          component: 'bio',
          quote: "Sono orientata alla costruzione di una solida alleanza terapeutica e all'integrazione mente-corpo nel percorso clinico.",
          paragraphs: 'Sono una psicologa laureata in Psicologia Clinica, del Lavoro e dello Sviluppo, con un particolare interesse per la presa in carico della cronicità psichica e della malattia fisica cronica.\n\nCredo profondamente nello spazio condiviso che si crea tra terapeuta e paziente: un luogo non giudicante dove l\'ascolto e l\'empatia sono i principali strumenti di cura. La mia pratica integra un approccio contemporaneo e umano, dedicato a supportare la persona in ogni fase del suo ciclo di vita.',
        },
        {
          component: 'timeline',
          title: 'Il mio percorso',
          entries: [
            { component: 'timeline_entry', year: 'Feb 2026', title: "Abilitazione all'esercizio della professione", description: "Iscrizione all'Albo degli Psicologi della Toscana n° 11853." },
            { component: 'timeline_entry', year: 'Gen-Set 2025', title: 'Tirocinio professionalizzante', description: "Presso l'Associazione Italiana Malattia di Alzheimer – Firenze. Esperienza maturata nel sostegno ai caregiver e conduzione di gruppi psicoeducativi." },
            { component: 'timeline_entry', year: '2022-2024', title: 'Laurea Magistrale in Psicologia Clinica, del Lavoro e dello Sviluppo', description: 'Università degli Studi Guglielmo Marconi.' },
            { component: 'timeline_entry', year: '2019-2022', title: 'Laurea Triennale in Scienze e Tecniche Psicologiche', description: 'Università degli Studi Guglielmo Marconi.' },
          ],
        },
        {
          component: 'formazione_tags',
          title: 'Formazione continua',
          tags: [
            "Diagnosi differenziale Disturbi d'Ansia",
            'Teacher/Parent Training – Disturbo Oppositivo Provocatorio',
            'Gestione attacco di panico (professionisti)',
            'Bisogni Educativi Speciali',
            'ADHD',
          ].map((text) => ({ component: 'tag_item', text })),
        },
        {
          component: 'cta_final',
          title: 'Iniziamo un percorso insieme',
          description: 'Se senti il bisogno di supporto o di uno spazio di ascolto dedicato, possiamo fissare un primo colloquio conoscitivo.',
          button_text: 'Prenota un colloquio',
        },
      ],
    },
  });

  await upsertStory({
    name: 'Contatti', slug: 'contatti',
    content: {
      component: 'contatti',
      body: [
        {
          component: 'contact_intro',
          title: 'Contatti',
          description: "Sentiti libero/a di scrivermi per qualsiasi informazione, per prenotare un colloquio conoscitivo o semplicemente per capire se posso aiutarti.",
        },
        {
          component: 'contact_info',
          phone: '+39 348 715 1411',
          email: 'elisaardinghi9@gmail.com',
          studio_text: 'Cintolese (PT)\nRicevo anche online via videoconsulto.',
        },
      ],
    },
  });

  console.log('--- Cartella e articolo blog ---');
  const blogFolder = await upsertStory({ name: 'Blog', slug: 'blog', is_folder: true, content: {} });

  await upsertStory({
    name: 'Cosa significa essere caregiver?',
    slug: 'cosa-significa-essere-caregiver',
    parent_id: blogFolder.id,
    content: {
      component: 'blog_post',
      title: 'Cosa significa essere caregiver? Il peso invisibile di chi si prende cura',
      date: '2026-04-16 12:00',
      excerpt: "Un'analisi sul ruolo del caregiver familiare, spesso sottevalutato, e sulle conseguenze psicologiche del prendersi cura costantemente di un malato.",
      tags: 'Caregiver, Alzheimer, Psicologia Familiare',
      published: true,
      body: {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [
            { type: 'text', text: 'Il termine "caregiver" indica colui che si prende cura. Nella maggior parte dei casi, parliamo di ' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'caregiver familiari' },
            { type: 'text', text: ": figli, coniugi o parenti che assistono quotidianamente una persona affetta da malattia cronica o invalidante, come l'Alzheimer o altre forme di demenza." },
          ]},
          { type: 'paragraph', content: [
            { type: 'text', text: 'Essere un caregiver è un atto di profondo amore e dedizione, ma è anche un viaggio caratterizzato da sfide immense, spesso invisibili agli occhi di chi non vive la stessa realtà. Il carico fisico, ma soprattutto ' },
            { type: 'text', marks: [{ type: 'bold' }], text: 'emotivo e psicologico' },
            { type: 'text', text: ', può diventare travolgente.' },
          ]},
          { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Il peso invisibile' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Quando una malattia entra in casa, sconvolge gli equilibri familiari e relazionali. Il caregiver si trova a dover gestire:' }] },
          { type: 'bullet_list', content: [
            { type: 'list_item', content: [{ type: 'paragraph', content: [
              { type: 'text', marks: [{ type: 'bold' }], text: 'Il lutto ambiguo' },
              { type: 'text', text: ': vedere la persona cara cambiare profondamente, pur essendo fisicamente presente.' },
            ]}]},
            { type: 'list_item', content: [{ type: 'paragraph', content: [
              { type: 'text', marks: [{ type: 'bold' }], text: 'La perdita del proprio tempo' },
              { type: 'text', text: ': il progressivo assorbimento delle energie nella routine di assistenza lascia sempre meno spazio per se stessi.' },
            ]}]},
            { type: 'list_item', content: [{ type: 'paragraph', content: [
              { type: 'text', marks: [{ type: 'bold' }], text: 'Isolamento sociale' },
              { type: 'text', text: ': le uscite diminuiscono, le amicizie si allontanano, e ci si ritrova sempre più soli.' },
            ]}]},
          ]},
          { type: 'paragraph', content: [
            { type: 'text', text: 'Tutto questo genera spesso il cosiddetto ' },
            { type: 'text', marks: [{ type: 'italic' }], text: 'Caregiver Burden' },
            { type: 'text', text: ' (il carico del caregiver), una condizione di stress cronico che porta ad ansia, depressione, disturbi del sonno e somatizzazioni.' },
          ]},
          { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Chiedere aiuto non è una debolezza' }] },
          { type: 'paragraph', content: [{ type: 'text', text: "Uno degli errori più comuni è pensare di dover farcela da soli a ogni costo. Sensi di colpa e percezione di inadeguatezza portano i caregiver a nascondere la propria fatica." }] },
          { type: 'paragraph', content: [
            { type: 'text', marks: [{ type: 'bold' }], text: 'Prendersi cura di chi si prende cura' },
            { type: 'text', text: ' è fondamentale. Un percorso di sostegno psicologico individuale o l\'inserimento in un ' },
            { type: 'text', marks: [{ type: 'italic' }], text: 'gruppo di auto-mutuo aiuto' },
            { type: 'text', text: ' (spesso organizzati da associazioni dedicate, come AIMA) possono fare la differenza. Condividere le proprie paure, legittimare la rabbia e la stanchezza, e apprendere strategie pratiche ed emotive per la gestione del malato permettono di alleggerire il peso della cura.' },
          ]},
          { type: 'paragraph', content: [{ type: 'text', text: 'Ricordati: non puoi versare da una tazza vuota. Per prenderti cura del tuo caro nel miglior modo possibile, devi prima prenderti cura di te stesso.' }] },
        ],
      },
    },
  });

  console.log('Fatto.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
