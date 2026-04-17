import { defineConfig } from 'astro/config';

// Importa i plugin necessari
import tailwindcss from '@tailwindcss/vite'; // Plugin per l'integrazione di Tailwind CSS v4 tramite Vite
import sitemap from '@astrojs/sitemap';       // Integrazione per generare automaticamente la sitemap del sito

// Documentazione completa sulla configurazione di Astro: https://astro.build/config
export default defineConfig({
  // URL pubblico del sito, necessario per la sitemap e i meta tag SEO
  site: 'https://elisaardinghi.it',

  vite: {
    // Configurazione dei plugin di Vite (il motore di build interno di Astro)
    plugins: [tailwindcss()]
  },

  // Elenco delle integrazioni attive nel progetto
  integrations: [sitemap()]
});