---
id: okf-8
feature: cart-lib
branch: feature/cart-lib
status: done
files:
  - src/lib/cart.ts
  - src/lib/menu.schema.ts
  - src/content/menu/pizzas.yaml
  - src/content/menu/tacos.yaml
  - src/content/menu/kebabs.yaml
  - src/content/menu/burgers.yaml
  - src/components/MenuCategory.astro
tests:
  - src/lib/cart.test.ts
  - src/lib/menu.schema.test.ts
decisions:
  - "2026-11-24 : le panier ne stocke que des choix (clé du plat, taille, suppléments, quantité). Les prix sont relus dans la carte courante, donc un panier sauvegardé ne montre jamais un vieux prix."
  - "2026-11-24 : suppléments structurés via extraSchema (champ appliesTo pour la taille de pizza). Les mentions « +1,50€ avec boisson » des note de tacos, kebabs, burgers deviennent des extras, affichés en pied de catégorie (même information)."
  - "2026-11-24 : « Supplément sauce » (+0,50 €, Menu-2.jpg) rattaché à tacos, kebabs et burgers (ceux qui ont une sauce au choix). Rattachement déduit, à valider avec le commerçant."
  - "2026-11-24 : les sauces seules (sans prix) ne sont pas commandables dans le panier."
---

**Quoi** : logique pure du mini panier, en centimes entiers : catalogue construit depuis la
collection `menu`, ajout/quantité/retrait, total, texte de récapitulatif pour l'appel, sauvegarde
`localStorage` (clé `panier:v1`). Aucune UI dans cette feature.

**Pièges** :
- Un seul enregistrement invalide faisait rejeter tout le panier sauvegardé : validation ligne
  par ligne, on garde les lignes valides.
- `formatPrice` insère des espaces insécables : les tests comparent après normalisation des espaces,
  sans écraser les sauts de ligne.
