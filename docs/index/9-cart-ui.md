---
id: okf-9
feature: cart-ui
branch: feature/cart-ui
status: done
files:
  - src/components/Cart.astro
  - src/components/MenuCategory.astro
  - src/components/icons/Plus.astro
  - src/components/icons/Minus.astro
  - src/components/icons/Close.astro
  - src/pages/index.astro
  - src/lib/openStatus.ts
  - src/lib/format.ts
tests:
  - src/lib/openStatus.test.ts
  - src/lib/cart.test.ts
  - scripts/e2e-check.mjs
decisions:
  - "2026-11-24 : panneau en <dialog> natif (focus piégé, Échap, fond) plutôt qu'un volet maison, moins de JS à écrire et à tester."
  - "2026-11-24 : suppléments choisis au moment de l'ajout (case à cocher sous le plat), pas dans le panneau, pour ne pas fusionner des unités avec et sans supplément."
  - "2026-11-24 : hors horaires, le bouton devient « Rappeler aujourd'hui à 18h » (lien tel: conservé) et un message dit quand le commerce rouvre."
  - "2026-11-24 : formatPrice sorti dans src/lib/format.ts et zod retiré du panier : le script client pèse 8 Ko au lieu d'embarquer zod."
---

**Quoi** : bouton d'ajout par prix (taille), volet « Un supplément ? », barre fixe en bas de l'écran
dès le premier ajout, panneau avec quantités, total estimé, « Appeler », « Copier le récapitulatif »,
« Vider ma sélection ». Rien n'est envoyé en ligne, le texte le dit.

**Pièges** :
- Tailwind v4 remet les marges des `<dialog>` à zéro : le panneau est recentré avec `mx-auto mt-auto`.
- Sans JavaScript, les boutons d'ajout restent affichés mais ne font rien (les prix restent lisibles).
- Vérifié en navigateur par évaluation directe : `page.click` de l'outil Playwright a expiré une fois
  sans cause établie (la page répondait en 3 ms, le bouton était cliquable).
- Non vérifié en réel : `localStorage` bloqué (couvert seulement par les tests unitaires de loadCart/saveCart).
