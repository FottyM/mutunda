# Internationalization (i18n)

`mutunda.me` supports multilingual routing and content while preserving static Astro builds, accessible keyboard navigation, and zero-runtime-JavaScript delivery.

## Supported locales

- **Default locale:** `en` (English) — served without prefix (`/`, `/about`, `/projects`, `/writing`, `/style-guide`).
- **Additional locales:**
  - `fr` (French) — served under `/fr/` (`/fr`, `/fr/about`, `/fr/projects`, etc.).
  - `et` (Estonian) — served under `/et/` (`/et`, `/et/about`, `/et/projects`, etc.).

Astro's built-in i18n routing is configured in `astro.config.mjs`:

```javascript
i18n: {
  defaultLocale: "en",
  locales: ["en", "fr", "et"],
  routing: {
    prefixDefaultLocale: false,
  },
}
```

---

## Language selector & accessible flag navigation

The site header includes a keyboard-accessible language switcher:

- **Flag icons:** SVG vectors representing each locale (`🇬🇧 EN`, `🇫🇷 FR`, `🇪🇪 ET`) with subtle high-contrast borders that render cleanly across light and dark modes.
- **Equivalent page preservation:** When viewing an article or case study that exists in multiple languages, switching languages navigates directly to the translated counterpart.
- **Accessibility:** Uses semantic `<nav aria-label="...">`, native `<a hreflang="..." lang="...">` links, `aria-current="true"` on the active language, and target sizes that remain fully usable at 320px viewport width without wrapping or clipping.

---

## How to add a new locale

To add a new locale (for example, `es` for Spanish):

1. **Update Astro config (`astro.config.mjs`)**:
   Add the locale code to `i18n.locales`:
   ```javascript
   locales: ["en", "fr", "et", "es"]
   ```

2. **Update i18n config (`src/i18n/config.ts`)**:
   Add to `LOCALES` and `LOCALE_LABELS`:
   ```typescript
   export const LOCALES = ["en", "fr", "et", "es"] as const;

   export const LOCALE_LABELS = {
     // ...
     es: { label: "Spanish", nativeName: "Español" },
   };
   ```

3. **Add translations (`src/i18n/translations.ts`)**:
   Add a dictionary for the new locale implementing all keys from `translations.en`.

4. **Add flag SVG (`src/components/FlagIcon.astro`)**:
   Add a clean, accessible SVG flag for the new locale with `aria-hidden="true"`.

5. **Create page routes under `src/pages/<locale>/`**:
   Create route files wiring to shared templates in `src/templates/`:
   - `index.astro` $\rightarrow$ `<HomePage locale="es" />`
   - `about.astro` $\rightarrow$ `<AboutPage locale="es" />`
   - `style-guide.astro` $\rightarrow$ `<StyleGuidePage locale="es" />`
   - `projects/index.astro` $\rightarrow$ `<ProjectsIndexPage locale="es" />`
   - `projects/[slug].astro` $\rightarrow$ `<ProjectDetailPage ... />`
   - `writing/index.astro` $\rightarrow$ `<WritingIndexPage locale="es" />`
   - `writing/[...slug].astro` $\rightarrow$ `<WritingDetailPage ... />`
   - `writing/tags/[tag].astro` $\rightarrow$ `<WritingTagPage ... />`

6. **Validate**:
   Run `npm run check`, `npm test`, and `npm run build`.

---

## How to author and publish localized content

### Translating a field note

1. Create a Markdown file alongside the original in `src/content/writing/`, naming it `<slug>.<locale>.md` (e.g., `static-sites-are-operational-systems.fr.md` or `static-sites-are-operational-systems.et.md`).
2. Include the shared `slug` and the matching `locale`:

   ```yaml
   ---
   title: Les sites statiques sont des systèmes opérationnels
   description: Pourquoi une architecture statique exige une réflexion rigoureuse sur les builds...
   date: 2026-10-03
   tags:
     - architecture
     - astro
     - livraison
   draft: false
   locale: fr
   slug: static-sites-are-operational-systems
   ---
   ```

### Translating a project case study

1. Create a Markdown file in `src/content/projects/`, e.g. `ebola-tracker.et.md`.
2. Set the identical `slug` and the target `locale`:

   ```yaml
   ---
   slug: ebola-tracker
   title: Ebola Tracker
   summary: Reaalajas epidemioloogiline kaart...
   description: Staatiline, mobiilisõbralik seireliides...
   role: Looja ja tarkvarainsener
   year: 2026
   featured: true
   draft: false
   locale: et
   technologies:
     - JavaScript
     - Vite+
   links:
     live: https://fottym.github.io/ebola-tracker/
   ---
   ```

---

## Fallback policy for incomplete translations

1. **Interface copy:**
   If a translated phrase is missing in `src/i18n/translations.ts`, the `t(key)` helper automatically falls back to the default English (`en`) dictionary.

2. **Index listings (Writing & Projects):**
   When an entry is published in English but not yet translated into the active secondary language, the index lists the English version with an explicit localized indicator (e.g. `(En anglais)` in French or `(Inglise keeles)` in Estonian) and links safely to the canonical English URL (`/projects/<slug>` or `/writing/<slug>`). This prevents 404 errors while maintaining full content discoverability.

3. **Direct page translation links:**
   The header language selector dynamically checks if an equivalent localized entry exists for that slug. If so, it links directly to that translation; if not, it navigates to the parent index (e.g., `/fr/writing`), ensuring visitors never hit a dead link.

4. **SEO, canonical, and hreflang metadata:**
   - Every page declares `<html lang="...">` matching its locale.
   - `<link rel="canonical" href="...">` points to the current page's own URL.
   - Alternate links `<link rel="alternate" hreflang="..." href="...">` specify all available translated counterparts, alongside `hreflang="x-default"` pointing to the default English version.
