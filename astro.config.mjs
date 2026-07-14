import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Importa i plugin necessari
import tailwindcss from '@tailwindcss/vite'; // Plugin per l'integrazione di Tailwind CSS v4 tramite Vite
import sitemap from '@astrojs/sitemap';       // Integrazione per generare automaticamente la sitemap del sito
import { storyblok } from '@storyblok/astro'; // CMS con editor visuale per i contenuti del sito

// STORYBLOK_TOKEN va impostato in .env (locale) e nelle Environment
// Variables di Vercel (produzione) — vedi docs/storyblok-setup.md
const env = loadEnv('', process.cwd(), 'STORYBLOK');

// Documentazione completa sulla configurazione di Astro: https://astro.build/config
export default defineConfig({
  // URL pubblico del sito, necessario per la sitemap e i meta tag SEO
  site: 'https://elisaardinghi.it',

  // La storia "Home" su Storyblok ha slug "home": l'editor visuale prova ad
  // aprire l'anteprima su /home, ma la home page vive alla radice "/".
  // Redirect statico per far funzionare quel link (nessun costo/app extra).
  redirects: {
    '/home': '/',
  },

  vite: {
    // Configurazione dei plugin di Vite (il motore di build interno di Astro)
    plugins: [tailwindcss()]
  },

  // Elenco delle integrazioni attive nel progetto
  integrations: [
    sitemap(),
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      // Mappa ogni tipo di blok Storyblok al componente Astro che lo renderizza
      components: {
        hero: 'storyblok/Hero',
        services_grid: 'storyblok/ServicesGrid',
        service_card: 'storyblok/ServiceCard',
        bio_teaser: 'storyblok/BioTeaser',
        booking_section: 'storyblok/BookingSection',
        instagram_teaser: 'storyblok/InstagramTeaser',
        bio: 'storyblok/Bio',
        timeline: 'storyblok/Timeline',
        timeline_entry: 'storyblok/TimelineEntry',
        formazione_tags: 'storyblok/FormazioneTags',
        cta_final: 'storyblok/CtaFinal',
        contact_intro: 'storyblok/ContactIntro',
        contact_info: 'storyblok/ContactInfo',
        blog_post: 'storyblok/BlogPost'
      },
      apiOptions: {
        region: 'eu'
      }
    })
  ]
});