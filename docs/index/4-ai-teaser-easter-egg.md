---
id: okf-4
feature: ai-teaser-easter-egg
branch: feature/bootstrap
status: done
files:
  - src/components/AiTeaserEasterEgg.astro
tests:
  - scripts/e2e-check.mjs
decisions:
  - "2026-07-23 : easter egg purement décoratif (aucun appel réseau/IA réelle), validé avec l'utilisateur via AskUserQuestion."
  - "2026-07-23 : déclencheur tactile (tap x5 sur la mascotte) plutôt que konami code clavier — site mobile-first, un déclencheur clavier serait inaccessible à la majorité du trafic."
  - "2026-07-23 : phrase teaser visible dans le hero sert elle-même de mode d'emploi de l'easter egg (option choisie par l'utilisateur : accroche visible + déclencheur caché, pas un easter egg 100% invisible)."
---

**Quoi** : phrase teaser IA visible sous le hero + mascotte cliquable, 5 taps en
moins de 1,2s ouvrent une modale humoristique ("l'IA prépare vos frites...").
Fermeture au clic extérieur, bouton, ou `Échap`.

**Pièges** : le script inline n'est PAS un îlot Astro (`client:*`) — juste un
`<script>` classique dans le composant, pour rester 0-JS-par-défaut sur le reste du
site. L'E2E statique ne peut pas tester l'interaction réelle (pas de navigateur) :
il vérifie seulement la présence du texte teaser et du marqueur
`data-testid="ai-teaser-easter-egg"` dans le HTML buildé.
