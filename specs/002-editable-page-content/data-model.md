# Phase 1 Data Model: Storyblok Content Types (Bloks)

Ogni riga è un "component" Storyblok (un blok). I content type "root"
(`home`, `chi_sono`, `contatti`, `blog_post`) sono storie pubblicabili; gli
altri sono bloks annidabili, usati dentro un campo "Blocks".

## Storia: `home` (root)

| Campo | Tipo Storyblok | Note |
|---|---|---|
| `body` | Blocks | accetta: `hero`, `services_grid`, `bio_teaser`, `booking_section`, `instagram_teaser` |

### Blok `hero`
| Campo | Tipo | Note |
|---|---|---|
| `title` | Text | es. "Uno spazio per" |
| `title_highlight` | Text | es. "prendersi cura." (parte evidenziata in corsivo/colore primario) |
| `subtitle` | Textarea | |
| `cta_primary_text` | Text | default "Prenota un colloquio" |
| `cta_secondary_text` | Text | default "Scopri chi sono" |
| `image` | Asset (image) | fallback al placeholder SVG esistente se vuoto |

### Blok `services_grid`
| Campo | Tipo | Note |
|---|---|---|
| `eyebrow` | Text | default "Servizi" |
| `title` | Text | default "Aree di intervento" |
| `cards` | Blocks (`service_card`) | lista riordinabile/estendibile |

### Blok `service_card` (ripetibile, dentro `services_grid.cards`)
| Campo | Tipo | Note |
|---|---|---|
| `icon` | Select | opzioni fisse: `caregiver`, `bambini`, `ansia`, `consulenza` — mappate a SVG nel codice |
| `title` | Text | |
| `description` | Textarea | |

### Blok `bio_teaser`
| Campo | Tipo | Note |
|---|---|---|
| `title` | Text | default "La dottoressa" |
| `quote` | Textarea | |
| `link_text` | Text | default "Leggi di più" |

### Blok `booking_section`
| Campo | Tipo | Note |
|---|---|---|
| `title` | Text | default "Prenota un colloquio" |
| `description` | Textarea | |
| `cal_link` | Text | default "elisaardinghi" (calLink di Cal.com, invariato nel meccanismo) |

### Blok `instagram_teaser`
| Campo | Tipo | Note |
|---|---|---|
| `title` | Text | default "Seguimi su Instagram" |
| `handle` | Text | default "@elisaardinghi.psy" |
| `profile_url` | Text | |

---

## Storia: `chi_sono` (root)

| Campo | Tipo Storyblok | Note |
|---|---|---|
| `body` | Blocks | accetta: `bio`, `timeline`, `formazione_tags`, `cta_final` |

### Blok `bio`
| Campo | Tipo | Note |
|---|---|---|
| `quote` | Textarea | citazione in evidenza |
| `paragraphs` | Textarea (multiline) o Rich text | testo bio esteso |

### Blok `timeline`
| Campo | Tipo | Note |
|---|---|---|
| `title` | Text | default "Il mio percorso" |
| `entries` | Blocks (`timeline_entry`) | lista riordinabile/estendibile |

### Blok `timeline_entry` (ripetibile, dentro `timeline.entries`)
| Campo | Tipo | Note |
|---|---|---|
| `year` | Text | es. "Feb 2026" |
| `title` | Text | |
| `description` | Textarea | |

### Blok `formazione_tags`
| Campo | Tipo | Note |
|---|---|---|
| `title` | Text | default "Formazione continua" |
| `tags` | Blocks (`tag_item`) o Text list | lista riordinabile/estendibile |

### Blok `cta_final`
| Campo | Tipo | Note |
|---|---|---|
| `title` | Text | |
| `description` | Textarea | |
| `button_text` | Text | |

---

## Storia: `contatti` (root)

| Campo | Tipo Storyblok | Note |
|---|---|---|
| `body` | Blocks | accetta: `contact_intro`, `contact_info` |

### Blok `contact_intro`
| Campo | Tipo | Note |
|---|---|---|
| `title` | Text | default "Contatti" |
| `description` | Textarea | |

### Blok `contact_info`
| Campo | Tipo | Note |
|---|---|---|
| `phone` | Text | |
| `email` | Text | |
| `pec` | Text | |
| `studio_text` | Textarea | es. "Cintolese (PT) — Ricevo anche online" |

Nota: form Web3Forms, mappa e meccanismo di invio restano hardcoded nel
componente `contatti.astro` — non sono contenuto editoriale.

---

## Storia: `blog_post` (root, ripetuta per ogni articolo)

| Campo | Tipo | Note |
|---|---|---|
| `title` | Text | |
| `date` | Date | |
| `excerpt` | Textarea | max ~200 caratteri, come nel CMS precedente |
| `cover_image` | Asset (image) | opzionale |
| `tags` | Text list | |
| `published` | Boolean | default true |
| `body` | Rich text | corpo dell'articolo |

Equivalente 1:1 dei campi già definiti in `public/admin/config.yml`
(collection `blog` di Decap), per non perdere capacità già esistenti.
