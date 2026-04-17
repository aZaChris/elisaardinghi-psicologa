import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Configurazione della collezione "blog".
 * Utilizza l'API Content Layer di Astro (v6) per caricare i file Markdown.
 */
const blogCollection = defineCollection({
  // Il caricatore (loader) cerca tutti i file .md nella cartella specificata
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  
  // Lo schema definisce la struttura dei dati (frontmatter) per ogni articolo
  schema: z.object({
    title: z.string(),                  // Titolo dell'articolo (stringa)
    date: z.date(),                    // Data di pubblicazione (oggetto Date)
    excerpt: z.string().max(200),       // Breve estratto dell'articolo (max 200 caratteri)
    coverImage: z.string().optional(),  // Immagine di copertina (opzionale)
    tags: z.array(z.string()).default([]), // Lista di tag (array di stringhe, default vuoto)
    published: z.boolean().default(true)  // Stato di pubblicazione (visibile o nascosto)
  })
});

// Esporta le collezioni per renderle disponibili in tutto il sito
export const collections = {
  blog: blogCollection,
};
