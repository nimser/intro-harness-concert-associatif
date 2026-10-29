# Intro au harness : concert associatif

Tu aides une association à préparer un **concert en salle**, avec un point d’accueil à l’entrée. Certaines tâches doivent attendre que d’autres soient terminées : il faut par exemple **brancher la sono avant de régler et tester le son**.

Ton programme doit indiquer quelles tâches peuvent commencer, proposer un ordre pour tout préparer et signaler les dépendances qui rendent la préparation impossible. L’IA t’accompagne ; tu construis et vérifies ton raisonnement.

## Démarrer

1. Dans tes [paramètres GitHub → Codespaces](https://github.com/settings/codespaces), crée un secret **`WORKSHOP_API_KEY`** avec ta clé individuelle. Autorise uniquement ce dépôt. Aucun fichier `.env` n’est nécessaire.
2. Ouvre **Code → Codespaces → Create codespace**, puis attends la préparation. Si ton Codespace était déjà ouvert lors de l’ajout du secret, arrête-le puis redémarre-le.
3. Dans le terminal du Codespace, depuis la racine du dépôt, lance Pi **sans outils** pour la première étape :

   ```sh
   pi --no-tools
   ```

4. Au premier lancement, choisis **Trust** pour charger les réglages et les skills du projet. Attends le téléchargement automatique des outils de recherche `fd` et `ripgrep`. Vérifie que Pi affiche `gpt-luna • xhigh`. Garde Pi ouvert et suis le **[parcours](#parcours)** après avoir lu le scénario et ta mission ci-dessous.

Le devcontainer installe Node, Bun et Pi, puis configure la référence au secret. Tu n’as ni installation manuelle, ni `/login`, ni clé à coller dans Pi. Lance toujours les commandes Pi depuis la racine du dépôt.

Garde une seule session Pi active. N’envoie aucun secret ni donnée personnelle : les échanges sont journalisés.

## Comprendre le concert

Dans cet exercice, une **action** est une **tâche de préparation du concert**. C’est le nom utilisé dans le code, avec le type `Action`.

- Un **prérequis** est une tâche qui doit être entièrement terminée avant qu’une autre puisse commencer.
- Une tâche **terminée** est un préparatif déjà accompli, indiqué au programme par son identifiant.
- Une **action disponible** est donc une tâche **pas encore terminée, mais qui peut commencer maintenant**, parce que **tous** ses prérequis sont terminés. Sans prérequis, elle peut commencer immédiatement.

« Disponible » ne désigne pas la disponibilité d’une équipe ou du matériel. On ne gère ni les personnes, ni les durées, ni les horaires.

Les sept tâches sont définies dans `src/concert.ts`. La liste fournie n’est pas un ordre d’exécution :

| Identifiant (`id`) | Tâche (`titre`) | Tâches à terminer avant (`prerequis`) |
|---|---|---|
| `portes` | Ouvrir les portes au public | `accueil`, `balances` |
| `accueil` | Préparer l’accueil | `tables`, `affiches` |
| `balances` | Faire les balances : régler et tester le son | `sono` |
| `tables` | Installer les tables | `salle` |
| `sono` | Brancher la sono | `salle` |
| `affiches` | Imprimer les affiches | Aucune |
| `salle` | Sécuriser la salle | Aucune |

**Exemples de tâches disponibles :**

- Rien n’est terminé (`terminees = []`) : `affiches` et `salle` peuvent commencer.
- Seule la salle est sécurisée (`terminees = ["salle"]`) : `tables`, `sono` et `affiches` peuvent commencer. `salle` ne réapparaît pas puisqu’elle est terminée. L’accueil doit encore attendre les tables **et** les affiches.

Une **dépendance circulaire** est un blocage où des tâches s’attendent mutuellement : A attend la fin de B, et B attend la fin de A. Aucun ordre ne permet alors de toutes les terminer.

## Ta mission

Complète les deux fonctions de `src/concert.ts`, sans modifier les données reçues :

### 1. Quelles tâches peuvent commencer maintenant ?

`actionsDisponibles(actions, terminees)` reçoit la liste des tâches et les **identifiants** de celles déjà terminées. Elle renvoie les identifiants des tâches disponibles, selon la définition ci-dessus, dans n’importe quel ordre. Si aucune ne peut commencer, renvoie `[]`.

Cette fonction ne réalise aucune tâche : elle calcule les possibilités à partir de l’état fourni.

### 2. Dans quel ordre peut-on tout préparer ?

`ordonnerPreparatifs(actions)` part d’un état où **aucune tâche n’est terminée**. Elle renvoie un ordre complet : tous les identifiants, une seule fois chacun, avec chaque prérequis placé avant la tâche qui en dépend. Plusieurs ordres sont acceptables ; il n’y a pas de « meilleur » ordre à rechercher.

- Si aucun ordre complet n’est possible, renvoie `null`, pas une liste partielle.
- S’il n’y a aucune tâche à effectuer, renvoie `[]`.

Les identifiants sont uniques et tous les prérequis désignent une tâche existante. Tu n’as pas à vérifier ces deux propriétés.

Les fonctions sont à compléter : des tests échouent au départ. **Les tests vérifient ton code**, qu’il ait été écrit avec ou sans aide de l’IA ; ils ne prouvent pas à eux seuls ta compréhension ni tous les comportements possibles.

## Parcours

Ton objectif : écrire le code et comprendre tes choix. L’agent peut lire, poser une question, proposer un indice et vérifier ; il ne doit pas implémenter à ta place.

À chaque étape : **prédire → écrire → vérifier → intégrer → expliquer**.

Les commandes des blocs `sh` se lancent **dans le terminal, pas dans la conversation Pi**. Pour revenir au terminal depuis Pi, utilise `Ctrl+D` avec la zone de saisie vide (ou la commande `/quit`). Les demandes citées et les commandes commençant par `/` se saisissent dans Pi.

### 1. Comparer sans outils et avec outils

Pi est déjà ouvert avec `--no-tools`. Dans l’éditeur VS Code, repère `src/concert.ts`, `tests/cas-concert.ts`, `AGENTS.md` et `.pi/settings.json`.

Avant d’interroger l’agent, note les identifiants de deux tâches qui peuvent commencer quand rien n’est encore terminé, puis un ordre complet possible.

Dans Pi, demande :

> Que sais-tu des préparatifs ? Distingue les informations déjà présentes de celles que tu ne peux pas vérifier.

**Lis sa réponse avant de continuer.**

- Qu’apporte-t-elle par rapport à ta propre prédiction ?
- Sur quelles informations s’appuie-t-elle ? A-t-il réellement lu les fichiers du projet ?
- Qu’est-ce qui reste général, supposé ou impossible à vérifier ?

Sans outils ne signifie pas sans contexte : Pi reçoit déjà `AGENTS.md`. En revanche, il ne peut pas consulter le code ni les cas de test. Une réponse prudente qui reconnaît cette limite est préférable à une réponse précise mais inventée.

Reviens au terminal avec `Ctrl+D`. Relance Pi **avec les outils de lecture du projet** :

```sh
pi
```

Dans Pi, demande :

> Lis README.md et src/concert.ts. Cite les fichiers lus et pose-moi une question, sans proposer d’implémentation.

Compare les deux réponses : quelle information nouvelle rend la seconde plus utile ? Retrouve l’appel de lecture qui lui a permis de la vérifier dans la trace ; `Ctrl+O` permet de développer les résultats des outils.

### 2. Choisir ton accompagnement

Quitte Pi avec `Ctrl+D`, puis adapte `AGENTS.md` dans l’éditeur : tes acquis, ce que tu veux comprendre, un indice à la fois, aucune implémentation par l’agent.

À partir du [modèle](modeles/skill/SKILL.md), crée `.agents/skills/debloquer-sans-resoudre/SKILL.md`. Garde-le générique : tentative → prédiction → petit exemple → un indice → nouvel essai. N’y mets ni algorithme, ni pseudocode complet, ni solution du concert.

Dans le terminal, relance Pi pour charger les instructions et le nouveau skill :

```sh
pi
```

Dans Pi, charge le skill avec `/skill:debloquer-sans-resoudre`. Utilise-le quand tu bloques vraiment et vérifie qu’il te laisse écrire le code.

### 3. Quelles tâches peuvent commencer ?

Implémente `actionsDisponibles`.

- Prédis les identifiants renvoyés si rien n’est terminé, puis si seule la salle est sécurisée.
- Écris ta tentative. Si tu bloques, montre-la à l’agent et demande un indice, pas une fonction complète.
- Quitte Pi avec `Ctrl+D` avant de vérifier dans le terminal :

```sh
bun run typecheck
bun test tests/concert.test.ts --test-name-pattern 'premiers préparatifs|salle sécurisée|tout est terminé'
```

Explique pourquoi une action déjà terminée ne doit pas réapparaître et pourquoi un seul prérequis satisfait ne suffit pas. Pour redemander un indice, relance `pi` depuis le terminal.

### 4. Peut-on ouvrir les portes ?

Implémente `ordonnerPreparatifs`. Commence avec deux tâches, puis utilise les sept préparatifs fournis. Vérifie avec les tests ; ils acceptent plusieurs ordres valides.

Ensuite, examine « deux tâches s’attendent » : prédis le résultat et vérifie que ton code termine. Signale l’impossibilité par `null`, pas par un ordre partiel.

Dans le terminal, lance :

```sh
bun run typecheck
bun test tests/concert.test.ts
timeout 5s bun run verifier
```

Le dernier contrôle est borné pour éviter une boucle infinie. Si le délai est dépassé, la commande sort avec `124` : ce n’est pas un résultat métier. Interromps aussi un test bloqué avec `Ctrl+C`.

Ne modifie pas les tests pour faire passer ton code. Explique un échec avant de retoucher ta tentative.

### 5. Confier la vérification, pas l’implémentation

Depuis le terminal, relance `pi` et demande-lui d’exécuter le contrôle : ses outils de départ ne le permettent pas. Quitte Pi avec `Ctrl+D`, ajoute `"bash"` à `defaultTools` dans `.pi/settings.json`, puis relance `pi` depuis le terminal.

**Attention :** `bash` permet aussi d’écrire et d’utiliser le réseau ; ce n’est pas une lecture seule ni une sandbox.

Dans Pi, invoque `/skill:verifier-hypothese` avec une prédiction. Compare la commande, le rapport et ton résultat attendu. Le script vérifie les cas ; le skill n’apporte aucune solution.

Quitte Pi avec `Ctrl+D`, puis lance `git diff` dans le terminal. Explique : quel choix as-tu fait toi-même ? Quel indice t’a débloqué ? Que prouvent les tests, et que ne prouvent-ils pas ?

### Bonus : sortir de Codespaces

Sur le dépôt d’un **projet de ton choix** (ton projet principal, ton blog ou un nouveau dépôt), suis le [bonus local](bonus-local.md). Adapte le contrat et le skill, pas les données ni le validateur du concert.

Relis ton diff avant de sauvegarder sur GitHub. Arrête le Codespace après utilisation.

## Ressources

- [Correction](corrections/README.md) : à consulter après ta tentative, séparée de l’exercice.
