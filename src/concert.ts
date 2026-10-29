export interface Action {
  id: string;
  titre: string;
  prerequis: readonly string[];
}

export const preparatifs: readonly Action[] = [
  { id: "portes", titre: "Ouvrir les portes au public", prerequis: ["accueil", "balances"] },
  { id: "accueil", titre: "Préparer l’accueil", prerequis: ["tables", "affiches"] },
  { id: "balances", titre: "Faire les balances : régler et tester le son", prerequis: ["sono"] },
  { id: "tables", titre: "Installer les tables", prerequis: ["salle"] },
  { id: "sono", titre: "Brancher la sono", prerequis: ["salle"] },
  { id: "affiches", titre: "Imprimer les affiches", prerequis: [] },
  { id: "salle", titre: "Sécuriser la salle", prerequis: [] },
];

export function actionsDisponibles(actions: readonly Action[], terminees: readonly string[]): string[] {
  // À toi : quelles actions peuvent commencer maintenant ?
  return [];
}

export function ordonnerPreparatifs(actions: readonly Action[]): string[] | null {
  // À toi : un ordre complet, ou null si les prérequis rendent l’ouverture impossible.
  return [];
}
