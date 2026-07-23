---
id: okf-2
feature: menu-content
branch: feature/bootstrap
status: done
files:
  - src/lib/menu.schema.ts
  - src/content.config.ts
  - src/content/menu/*.yaml
tests:
  - src/lib/menu.schema.test.ts
decisions:
  - "2026-07-23 : menu modélisé en 8 fichiers YAML (une catégorie = un fichier), schéma Zod dans src/lib/menu.schema.ts (pas dans content.config.ts) pour rester testable en Vitest sans passer par astro:content."
  - "2026-07-23 : prices optionnel sur un item (les sauces n'ont pas de prix propre, juste un supplément générique en extras)."
---

**Quoi** : Content Collection `menu` (loader `glob`) avec schéma Zod
(catégorie → items → prix éventuellement multiples/étiquetés), transcrite depuis
`Menu-2.jpg`/`Menu-3.jpg`. Helper `formatPrice` (Intl fr-FR).

**Pièges** : aucun format de prix écrit à la main (espace insécable Intl) — testé en
unitaire pour éviter la régression.
