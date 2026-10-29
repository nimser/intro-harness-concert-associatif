# Correction : concert associatif en salle

Cherche et vérifie ta propre solution avant d’ouvrir [l’implémentation de référence](concert.ts).

## Raisonnement

1. **Au départ** : affiches et salle sont possibles. Après la salle, tables et sono deviennent possibles ; les affiches le restent.
2. **Actions disponibles** : exclure ce qui est terminé, puis vérifier tous les prérequis, pas seulement un.
3. **Ordre complet** : conserver ce qui a été terminé et poursuivre tant qu’il reste des préparatifs.
4. **Blocage** : s’il reste des préparatifs mais qu’aucun ne peut commencer, aucun ordre complet n’est possible. Ne pas renvoyer un résultat partiel.

Exemple accepté : `affiches, salle, tables, sono, accueil, balances, portes`. D’autres ordres conviennent ; le validateur contrôle les contraintes, pas une séquence unique.

Les données ont des identifiants uniques et des références connues. La validation de données arbitraires, les durées et la recherche d’un ordre optimal sont hors périmètre. Ce problème est un **tri topologique**.

## Vérification

Depuis la racine du dépôt, vérifie tes fonctions dans `src/concert.ts` :

```sh
bun run typecheck
bun test tests/concert.test.ts
timeout 5s bun run verifier
```

Une fois les deux fonctions complétées, les dix cas doivent réussir et le rapport doit indiquer `conforme: true`.

Une sortie `124` indique un délai dépassé, pas un résultat métier.
