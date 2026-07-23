---
id: okf-1
feature: bootstrap
branch: feature/bootstrap
status: done
files:
  - astro.config.mjs
  - src/styles/global.css
  - src/layouts/BaseLayout.astro
  - scripts/e2e-check.mjs
  - package.json
decisions:
  - "2026-07-23 : Astro v7 installé (dernière stable) plutôt que v5 supposée dans le cadrage initial (aucune raison de pin une version obsolète pour un projet greenfield)."
  - "2026-07-23 : Tailwind v4 en config CSS-first (@theme dans global.css), pas de tailwind.config.js."
  - "2026-07-23 : E2E = astro build + grep du HTML généré (scripts/e2e-check.mjs), pas de navigateur."
---

**Quoi** : scaffold Astro + Tailwind v4 + Zod + Vitest, structure de dossiers
(`src/content`, `src/lib`, `src/layouts`, `src/components`), palette de couleurs
vérifiée AA (brand/ember/ink), script E2E de base.

**Pièges** : `npm create astro` refuse un dossier non vide → scaffold à part puis
fusion manuelle (détail dans `retro.md`).
