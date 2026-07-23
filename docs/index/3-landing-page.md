---
id: okf-3
feature: landing-page
branch: feature/bootstrap
status: done
files:
  - src/pages/index.astro
  - src/components/MenuCategory.astro
  - src/lib/business.ts
decisions:
  - "2026-07-23 : une seule page (index.astro) à sections ancrées plutôt qu'un multi-pages, cohérent avec la taille du site."
  - "2026-07-23 : CTA principal = ember-700 (pas ember-600) pour rester AA sur texte de taille normale (contrôlé par calcul de contraste, voir retro.md)."
---

**Quoi** : hero (nom, accroche, CTA appeler/itinéraire/menu), section menu (nav
ancrée par catégorie + liste des plats/prix), section infos pratiques
(horaires/adresse/tél), footer.

**Pièges** : aucun pour l'instant — pas de photos de plats disponibles, voir point
ouvert du plan (à traiter avec l'utilisateur).
