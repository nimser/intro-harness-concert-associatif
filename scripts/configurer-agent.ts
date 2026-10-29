import { lstat, mkdir, mkdtemp, readFile, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { isDeepStrictEqual } from "node:util";

function objet(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export async function configurerAgent(agentDir = process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent")) {
  const modele = await Bun.file(new URL("../modeles/models.example.json", import.meta.url)).json();
  const fichier = join(agentDir, "models.json");
  let configuration: Record<string, unknown> = {};
  try {
    const info = await lstat(fichier);
    if (!info.isFile()) throw new Error("models.json doit être un fichier ordinaire, sans lien symbolique.");
    const texte = await readFile(fichier, "utf8");
    let contenu: unknown;
    try { contenu = JSON.parse(texte); } catch { throw new Error("models.json contient du JSON invalide ; corrige-le sans publier son contenu."); }
    if (!objet(contenu)) throw new Error("models.json doit contenir un objet JSON.");
    configuration = contenu;
  } catch (erreur) {
    if ((erreur as NodeJS.ErrnoException).code !== "ENOENT") throw erreur;
  }
  const fournisseurs = configuration.providers ?? {};
  if (!objet(fournisseurs)) throw new Error("Le champ providers de models.json doit être un objet.");
  if (Object.hasOwn(fournisseurs, "atelier")) {
    if (!isDeepStrictEqual(fournisseurs.atelier, modele.providers.atelier)) {
      throw new Error("Le fournisseur atelier existe avec une autre configuration ; examine-le et renomme-le avant de relancer l’installation.");
    }
    return "inchangé";
  }
  await mkdir(agentDir, { recursive: true, mode: 0o700 });
  const temporaire = await mkdtemp(join(agentDir, ".configuration-"));
  try {
    const sortie = join(temporaire, "models.json");
    await writeFile(sortie, JSON.stringify({ ...configuration, providers: { ...fournisseurs, atelier: modele.providers.atelier } }, null, 2) + "\n", { mode: 0o600 });
    await rename(sortie, fichier);
  } finally {
    await rm(temporaire, { recursive: true, force: true });
  }
  return "installé";
}

if (import.meta.main) {
  try {
    const resultat = await configurerAgent();
    console.log(`Fournisseur Pi atelier ${resultat} ; la clé reste référencée par $WORKSHOP_API_KEY.`);
  } catch (erreur) {
    console.error(erreur instanceof Error ? erreur.message : "Configuration Pi impossible.");
    process.exitCode = 1;
  }
}
