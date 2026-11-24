# Rétro

Pièges spécifiques à ce projet (pas génériques → restent ici, pas dans le skill).

## 2026-07-23 — Bootstrap
- `npm create astro@latest .` refuse un dossier non vide (CLAUDE.md, menus, .claude/
  existaient déjà) → scaffold dans un sous-dossier temporaire puis fusion manuelle des
  fichiers à la racine, suppression du `CLAUDE.md`/`AGENTS.md` générés (on garde le
  nôtre, déjà à jour pour ce projet).
- Astro est en v7.1.3 au moment du bootstrap (pas v5 comme supposé dans le cadrage
  initial de `CLAUDE.md`) — `src/content.config.ts` reste le bon emplacement pour la
  config des Content Collections, vérifié dans les sources livrées (`node_modules/astro`).

## 2026-11-24 — Version de Node
- Le Node actif par défaut (`mise`, 22.0.0) est refusé par Astro 7 (`>=22.12.0`) : `npm run e2e`
  plante avant même de builder, avec un message qui ressemble à une erreur de code. Node 24.18.0
  est déjà installé : `mise exec node@24.18.0 -- npm run e2e`. Ne pas confondre avec un échec du
  test lui-même (le vrai échec affiche la liste des vérifications avec un ✘).

## 2026-11-24 — Débordement horizontal entre 640 et 1024 px
- Le groupe de boutons de prix avait `shrink-0` : trop large pour le côte-à-côte dès `sm`, il
  faisait déborder la page (défilement de 1057 px à 768 px d'écran, 1185 px à 1024). Passé inaperçu
  parce que seuls 390 px et 1280 px avaient été regardés. Toujours mesurer `scrollWidth` contre la
  largeur d'écran à 320, 390, 640, 768, 1024 et 1440 px après un changement de mise en page.
- Aucun test automatique ne couvre ça (l'e2e lit seulement le HTML, sans navigateur).
