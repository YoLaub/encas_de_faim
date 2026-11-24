---
id: okf-6
feature: open-status
branch: feature/open-status
status: done
files:
  - src/lib/openStatus.ts
  - src/components/OpenStatusBadge.astro
  - src/pages/index.astro
tests:
  - src/lib/openStatus.test.ts
  - scripts/e2e-check.mjs
decisions:
  - "2026-11-24 : levier de retour choisi avec l'utilisateur (statut ouvert/fermé en direct), zéro maintenance côté commerçant."
  - "2026-11-24 : source unique = openingHoursSpecification de business.ts, pas de second tableau d'horaires à tenir à jour."
  - "2026-11-24 : calcul sur l'heure de Paris via Intl (pas l'heure de la machine), testé avec des dates injectées hiver et été."
---

**Quoi** : badge dans le hero, « Ouvert jusqu'à 14h » ou « Fermé, rouvre demain à 11h30 ».
Texte de repli « Voir les horaires » (lien vers les infos pratiques) rendu au build, remplacé
par le script au chargement puis rafraîchi chaque minute. L'heure de fermeture est exclue
(22h00 pile = fermé).

**Pièges** :
- Node 22.0.0 est le défaut `mise` mais Astro 7 exige ≥ 22.12 : lancer build et e2e avec
  `mise exec node@24.18.0 -- npm run e2e` (voir retro.md).
