import { preparatifs, type Action } from "../src/concert.ts";

type CasDisponible = { nom: string; etape: "disponibles"; actions: readonly Action[]; terminees: readonly string[]; attendu: readonly string[] };
type CasOrdre = { nom: string; etape: "ordre"; actions: readonly Action[]; attendu: "ordre valide" | null };
export type CasConcert = CasDisponible | CasOrdre;

const cycle: readonly Action[] = [
  { id: "a", titre: "Préparer A", prerequis: ["b"] },
  { id: "b", titre: "Préparer B", prerequis: ["a"] },
];

export const casConcert: readonly CasConcert[] = [
  { nom: "premiers préparatifs", etape: "disponibles", actions: preparatifs, terminees: [], attendu: ["affiches", "salle"] },
  { nom: "salle sécurisée, affiches encore à imprimer", etape: "disponibles", actions: preparatifs, terminees: ["salle"], attendu: ["tables", "sono", "affiches"] },
  { nom: "tout est terminé", etape: "disponibles", actions: preparatifs, terminees: preparatifs.map(a => a.id), attendu: [] },
  { nom: "ouvrir les portes du concert", etape: "ordre", actions: preparatifs, attendu: "ordre valide" },
  { nom: "deux préparatifs indépendants", etape: "ordre", actions: preparatifs.filter(a => a.prerequis.length === 0), attendu: "ordre valide" },
  { nom: "données dans l’ordre inverse", etape: "ordre", actions: [
    { id: "c", titre: "Accueillir", prerequis: ["b"] },
    { id: "b", titre: "Installer", prerequis: ["a"] },
    { id: "a", titre: "Livrer", prerequis: [] },
  ], attendu: "ordre valide" },
  { nom: "aucun préparatif", etape: "ordre", actions: [], attendu: "ordre valide" },
  { nom: "deux tâches s’attendent", etape: "ordre", actions: cycle, attendu: null },
  { nom: "une action attend sa propre fin", etape: "ordre", actions: [{ id: "a", titre: "Préparer A", prerequis: ["a"] }], attendu: null },
  { nom: "une action possible ne débloque pas le cycle", etape: "ordre", actions: [...cycle, { id: "c", titre: "Imprimer", prerequis: [] }], attendu: null },
];

export function ordreValide(actions: readonly Action[], ordre: unknown): boolean {
  if (!Array.isArray(ordre) || ordre.length !== actions.length || new Set(ordre).size !== ordre.length) return false;
  const positions = new Map(ordre.map((id, i) => [id, i]));
  return actions.every(action => positions.has(action.id) && action.prerequis.every(id => positions.has(id) && positions.get(id)! < positions.get(action.id)!));
}

export function resultatConforme(cas: CasConcert, obtenu: unknown): boolean {
  if (cas.etape === "ordre") return cas.attendu === null ? obtenu === null : ordreValide(cas.actions, obtenu);
  return Array.isArray(obtenu) && obtenu.length === cas.attendu.length && new Set(obtenu).size === obtenu.length && cas.attendu.every(id => obtenu.includes(id));
}
