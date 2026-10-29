import { expect, test } from "bun:test";
import { actionsDisponibles, ordonnerPreparatifs } from "../src/concert.ts";
import { casConcert, resultatConforme } from "./cas-concert.ts";

for (const cas of casConcert) {
  test(cas.nom, () => {
    const avant = structuredClone(cas.actions);
    const obtenu = cas.etape === "disponibles" ? actionsDisponibles(cas.actions, cas.terminees) : ordonnerPreparatifs(cas.actions);
    expect({ nom: cas.nom, obtenu, conforme: resultatConforme(cas, obtenu) }).toMatchObject({ conforme: true });
    expect(cas.actions).toEqual(avant);
  }, 1000);
}
