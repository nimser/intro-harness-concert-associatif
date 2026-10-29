import { actionsDisponibles, ordonnerPreparatifs } from "../../../../src/concert.ts";
import { casConcert, resultatConforme } from "../../../../tests/cas-concert.ts";

export function verifier() {
  const resultats = casConcert.map(cas => {
    const obtenu = cas.etape === "disponibles" ? actionsDisponibles(cas.actions, cas.terminees) : ordonnerPreparatifs(cas.actions);
    return { nom: cas.nom, etape: cas.etape, attendu: cas.attendu, obtenu, conforme: resultatConforme(cas, obtenu) };
  });
  const echecs = resultats.filter(resultat => !resultat.conforme).length;
  return { total: resultats.length, echecs, conforme: echecs === 0, resultats };
}

if (import.meta.main) {
  try {
    const rapport = verifier();
    console.log(JSON.stringify(rapport, null, 2));
    process.exitCode = rapport.conforme ? 0 : 1;
  } catch {
    console.error("Impossible de vérifier les cas : examine le code et la sortie des tests.");
    process.exitCode = 2;
  }
}
