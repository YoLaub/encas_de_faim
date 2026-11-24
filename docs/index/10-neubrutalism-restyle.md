---
id: okf-10
feature: neubrutalism-restyle
branch: feature/neubrutalism-restyle
status: done
files:
  - src/styles/global.css
  - src/pages/index.astro
  - src/components/MenuCategory.astro
  - src/components/Cart.astro
  - src/components/OpenStatusBadge.astro
  - src/components/GoogleReviewsLink.astro
  - src/components/AiTeaserEasterEgg.astro
  - src/lib/contrast.ts
tests:
  - src/lib/contrast.test.ts
decisions:
  - "2026-11-24 : direction Neubrutalism chaleureux choisie avec l'utilisateur (crème, vert logo en aplat, bordures encre 3 px, ombres décalées)."
  - "2026-11-24 : le vert vif du logo n'est jamais une couleur de texte, seulement un fond (encre dessus : 9,06:1). Le gris atténué est un token plein (ink-600), plus d'opacité, pour pouvoir calculer son contraste."
  - "2026-11-24 : le test de contraste lit les couleurs dans global.css : changer un token casse la suite si une paire passe sous 4,5:1 (texte) ou 3:1 (interface)."
  - "2026-11-24 : une seule animation d'entrée (rangée de boutons du hero), transform et opacity, désactivée si prefers-reduced-motion."
---

**Quoi** : nouveau thème sur toute la page (hero vert, cartes de catégorie, boutons de prix, infos,
panier). Utilitaires `brut-card` et `brut-btn` dans `global.css`, focus visible unique (encre).

**Pièges** :
- Capture d'écran prise pendant l'animation d'entrée : boutons délavés. Vérifié par les styles
  calculés après l'animation (opacité 1, fond ember-700, texte blanc).
- Polices Fraunces et Inter déclarées mais non chargées (aucun fichier de police) : le rendu utilise
  Georgia et la police système. À traiter séparément si une vraie typo est voulue.
- Lighthouse non mesuré (installation impossible : registre npm injoignable).
