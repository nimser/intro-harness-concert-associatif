# Bonus : ton projet dans un conteneur local

Utilise le dépôt d’un **projet de ton choix** : projet principal, blog ou nouveau dépôt. N’y copie ni les préparatifs ni les tests du concert.

## 1. Préparer ton poste

- Installe [VS Code](https://code.visualstudio.com/) et l’extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
- **Windows** : installe Docker Desktop avec le backend WSL 2, l’extension **WSL** dans VS Code et active l’intégration de ta distribution dans Docker Desktop. Clone le dépôt dans le dossier personnel Linux, pas sous `/mnt/c`.
- **macOS** : installe Docker Desktop.
- **Linux** : installe Docker Engine ou Docker Desktop, puis vérifie que ton compte peut utiliser Docker.

Vérifie les conditions de licence de Docker Desktop applicables à ton organisation. Aucune modification de ton shell de connexion n’est nécessaire.

## 2. Ouvrir ton projet dans le conteneur

1. Clone ton dépôt localement et ouvre-le dans VS Code. Ouvrir le Codespace dans VS Code ne suffit pas : il resterait distant.
2. Copie [cette configuration autonome](modeles/devcontainer.local.json) dans **`.devcontainer/devcontainer.json`** du projet. Si ce fichier existe déjà, adapte-le sans l’écraser ; conserve les outils nécessaires à ton projet.
3. Lis la configuration, démarre Docker, puis lance **Dev Containers: Reopen in Container** depuis la palette de commandes.
4. Attends la préparation. Dans le terminal du conteneur, vérifie `pi --version` : le résultat attendu est `1.4.0`.

La configuration installe Node, Pi, la connexion aux trois modèles et les réglages de l’atelier ; elle refuse les réglages Pi existants qui diffèrent. Elle ne dépend pas du `package.json` de l’atelier. Elle ne configure pas automatiquement la stack de ton projet.

## 3. Fournir ta clé à la session locale

Les secrets Codespaces ne sont pas transférés. Dans le terminal **Bash du conteneur**, saisis ta clé à l’invite masquée :

```sh
read -rsp 'Clé API individuelle : ' WORKSHOP_API_KEY
printf '\n'
export WORKSHOP_API_KEY
pi --model atelier/gpt-luna --thinking xhigh --tools read,grep,find,ls --no-extensions --no-mcp --no-prompt-templates
unset WORKSHOP_API_KEY
```

La clé n’est ni dans un fichier `.env` ni dans l’historique de commande. Elle reste accessible aux processus qui l’héritent. Ne la colle pas dans une conversation. Si l’accès temporaire a expiré, arrête-toi et configure un fournisseur autorisé ; ne contourne pas les quotas.

## 4. Adapter l’accompagnement

- Écris un `AGENTS.md` adapté à ton projet et à une difficulté que tu veux travailler.
- Réutilise ton skill de déblocage, sans solution métier. Un fichier existant doit être adapté, pas remplacé aveuglément.
- Fais lire un fichier utile à Pi ; observe la trace, puis demande un indice sur ta tentative.
- Lance toi-même une vérification de ton projet et explique son résultat.

Le conteneur ne protège pas les fichiers que tu y montes : Pi voit le dépôt et les accès accordés. N’ajoute ni montage de ton dossier personnel, ni socket Docker, ni privilèges supplémentaires.

**Réussite :** Pi tourne dans le conteneur local de ton projet ; tu peux montrer une lecture, un indice utile et une vérification exécutée. Sinon, note le point bloquant sans annoncer le bonus réussi.

[Référence : Dev Containers dans VS Code](https://code.visualstudio.com/docs/devcontainers/containers).
