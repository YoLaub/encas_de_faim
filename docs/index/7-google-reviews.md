---
id: okf-7
feature: google-reviews
branch: feature/google-reviews
status: done
files:
  - src/lib/reviews.ts
  - src/components/GoogleReviewsLink.astro
  - src/components/icons/Star.astro
  - src/pages/index.astro
tests:
  - src/lib/reviews.test.ts
  - scripts/e2e-check.mjs
decisions:
  - "2026-11-24 : chiffres relevés à la main sur la fiche Google (4,2 sur 5, 210 avis), date du relevé stockée dans checkedAt, jamais inventés."
  - "2026-11-24 : pas d'aggregateRating dans le JSON-LD : chiffre figé qui vieillit, et Google ignore les notes qu'un établissement s'attribue sur son propre site."
---

**Quoi** : ligne « 4,2 sur 5 · 210 avis Google » sous le badge d'ouverture, avec une étoile SVG,
lien vers la fiche Maps (nouvel onglet, annoncé aux lecteurs d'écran).

**Pièges** :
- Le lien `share.google/...` ne donne rien en curl (page rendue en JS, bandeau cookies) : relevé
  fait en ouvrant la page dans un navigateur.
- Chiffres à relire de temps en temps (`checkedAt` dans `src/lib/reviews.ts`).
