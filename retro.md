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
