---
id: okf-5
feature: seo-structured-data
branch: feature/bootstrap
status: done
files:
  - src/layouts/BaseLayout.astro
  - src/lib/business.ts
decisions:
  - "2026-07-23 : JSON-LD Restaurant (pas FoodEstablishment générique) — plus précis pour un fast food avec adresse/horaires/menu."
  - "2026-07-23 : sitemap (@astrojs/sitemap) reporté — un seul URL sur le site pour l'instant, peu de valeur avant une deuxième page (mentions légales ?)."
---

**Quoi** : JSON-LD `Restaurant` (adresse, téléphone, horaires structurés
`openingHoursSpecification`, `servesCuisine`), meta title/description ciblés SEO
local ("Elven", "56250").

**Pièges** : aucun.
