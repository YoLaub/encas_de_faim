# CLAUDE.md

Guidance pour Claude Code (claude.ai/code) sur ce dépôt.

## Ce qui est construit

Refonte du site vitrine du fast food **en-cas 2 faim** à Elven (56250) : pizzas,
kebabs, burgers, tacos, quesadillas. Objectif : une page moderne, au design soigné
et **appétissant**, qui donne envie de commander/venir sur place — pas un simple
site institutionnel.

Ancien site (référence contenu, à ne pas reproduire visuellement) :
https://encas2faim.eatbu.com/?lang=fr

Article de presse (contexte du restaurant) :
https://www.letelegramme.fr/morbihan/elven-56250/un-nouveau-souffle-pour-le-restaurant-en-cas-2-faim-a-elven-6902301.php

### Infos business (source de vérité, ne pas inventer)

- **Adresse** : 8 rue nationale, 56250 Elven
- **Téléphone** : 02 97 53 55 62
- **Horaires** : lundi–jeudi 11h30–14h / 18h–22h · vendredi 11h30–14h / 18h–22h30 ·
  samedi–dimanche 18h–22h30
- **Sur place ou à emporter**
- **Menu** (`Menu-2.jpg`, `Menu-3.jpg` à la racine = source du contenu) : pizzas,
  tacos, burgers, kebabs, quesadillas, menu enfant, boissons, sauces
- **Identité visuelle existante** : vert vif + noir + blanc, logo toque de chef
  souriante, style un peu artisanal/fait-main (à moderniser, pas à copier tel quel)

## Stack

- **Astro** (site statique, 0 JS par défaut, îlots si besoin) — v7 au moment du
  bootstrap (2026-07), dernière version stable installée plutôt que la v5 supposée
  initialement.
- **Tailwind CSS** (design system, thème clair, palette appétissante à définir —
  vert/chaleureux, forts contrastes, typographie gourmande mais lisible).
- Contenu en **Markdown** via Astro Content Collections (`src/content/`), pas en dur
  dans les `.astro`. Le menu (plats, prix, catégories) est un contenu structuré
  (collection), pas du texte libre.


## Workflow (skill greenfield-tdd-okf)

Git-flow : `main` (jalons stables) ← `dev` ← une branche par feature. **Merge `--no-ff`
vers `dev` uniquement si tests verts + build OK + E2E fait. Jamais de commit direct sur
`main`/`dev`.** Fiche OKF par feature dans `docs/index/<n>-<feature>.md` (template :
`.claude/skills/greenfield-tdd-okf/references/okf-fiche-template.md`, corps ≤15 lignes,
décisions datées). Pièges dans `retro.md` quand ils mordent ; pièges génériques aussi
dans `references/pieges.md`. Créer `docs/index/` + `retro.md` dès le bootstrap.

TDD sur un site statique : la « logique pure » testable = collections de contenu
(schémas Zod du menu : catégories, plats, prix), helpers d'URL/SEO, composants
critiques (données structurées `Restaurant`, coordonnées, horaires). L'E2E =
`npm run build` qui passe + vérification du HTML généré (présence de l'adresse, du
téléphone, des horaires, du menu, des balises SEO).

## Contraintes qualité

- **Accessibilité (WCAG AA)** : contrastes (attention au vert vif sur fond clair/foncé),
  focus visible, alt sur images (notamment les photos de plats), nav clavier, HTML
  sémantique.
- **SEO local** : title/meta par page, données structurées `Restaurant` / `FoodEstablishment`
  (adresse, horaires, téléphone, menu), sitemap, URLs propres.
- **Performance** : Lighthouse ≥ 95, images optimisées (`astro:assets`) — critique ici
  car le site va être riche en photos de plats appétissantes, pas de JS inutile.
- **Responsive** mobile-first (commande/consultation du menu très majoritairement au tel).
- **UX "appétissant"** : hiérarchie visuelle forte sur le menu (catégories, prix
  lisibles), photos de qualité mises en valeur, CTA clairs (appeler, itinéraire,
  commander si applicable), ambiance chaleureuse plutôt que froide/corporate.
- **DRY / SOLID**
- **Ne jamais supprimer** fichier/contenu sans accord explicite. Proposer, attendre
  validation.
- Contenu du menu (plats, prix, allergènes) : reprendre les infos exactes des menus
  sources (`Menu-2.jpg`, `Menu-3.jpg`), ne pas inventer de plats ou de prix.


