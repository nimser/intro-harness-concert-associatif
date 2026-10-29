import type { Action } from "../src/concert.ts";

export function actionsDisponibles(actions: readonly Action[], terminees: readonly string[]): string[] {
  return actions
    .filter(action => !terminees.includes(action.id) && action.prerequis.every(id => terminees.includes(id)))
    .map(action => action.id);
}

export function ordonnerPreparatifs(actions: readonly Action[]): string[] | null {
  const ordre: string[] = [];
  while (ordre.length < actions.length) {
    const suivantes = actionsDisponibles(actions, ordre);
    if (suivantes.length === 0) return null;
    ordre.push(...suivantes);
  }
  return ordre;
}
