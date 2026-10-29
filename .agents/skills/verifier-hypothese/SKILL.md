---
name: verifier-hypothese
description: Vérifie les préparatifs du concert associatif en salle avec un rapport reproductible. À utiliser pour confronter une prédiction sur les actions disponibles, un ordre ou un blocage au comportement du code.
compatibility: Bun 1.4.4 et projet de concert fourni ; outils bash et timeout requis pour une exécution par l’agent.
---

# Vérifier une hypothèse

1. Recueille le cas étudié et la prédiction de la personne ; ne redemande pas une information déjà donnée.
2. Vérifie que `bash` est disponible. Sinon, explique la limite et propose à la personne de lancer la commande dans son terminal ; n’invente pas de résultat.
3. Lis `scripts/verifier.ts` avant la première exécution et résous son chemin depuis le dossier de ce skill.
4. Exécute `timeout 5s bun <chemin-absolu-du-skill>/scripts/verifier.ts` sans modifier le script, les cas ou le code métier.
5. Le script renvoie un JSON stable pour le même code et les mêmes cas ; `0` indique leur réussite, `1` au moins un échec, `2` une erreur d’exécution. Une sortie `124` signale un délai dépassé : ne l’interprète pas comme un rapport métier.
6. Rapporte le cas pertinent, le résultat obtenu et le résultat attendu ; un code `1` n’est pas une panne d’outil.
7. Demande d’expliquer l’écart avant de proposer un seul indice. Ne fournis ni implémentation ni pseudocode complet ; la personne écrit le code.

Le contrôle porte sur les cas fournis, pas sur toutes les entrées possibles.
