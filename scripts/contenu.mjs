// Régénère CONTENU.md : propositions de titres, données à remplir, menus, puis tous les textes du site
// dans les 3 langues (FR, AR, EN), pour validation par Maison ZH.
//   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const json = async (p) => JSON.parse(await readFile(path.join(ROOT, p), "utf8"));
const L = { fr: await json("locales/fr.json"), ar: await json("locales/ar.json"), en: await json("locales/en.json") };
const formules = await json("data/formules.json");
const menus = await json("data/menus.json");
const anims = await json("data/animations.json");
const real = await json("data/realisations.json");
const site = await json("data/site.json");

const out = [];
out.push(`# MAISON ZH — contenu du site à valider

Site : ${site.url} (FR /fr, AR /ar, EN /en). Les textes se modifient dans \`locales/fr.json\`, \`ar.json\`, \`en.json\` ; les infos datées dans \`data/*.json\`. Ce fichier est régénéré par \`npm run contenu\`. Les infos à demander sont dans \`INFOS-A-DEMANDER.md\`.

## Titre du hero : 3 propositions

1. **Deux cuisines, une seule exigence** (en ligne)
2. La table française, l'âme marocaine
3. Le grand jour mérite une grande table

## Données à remplir

### Formules (\`data/formules.json\`)

| Formule | Prix à partir de (€/pers.) | Minimum |
|---|---|---|
${formules.formules.map((f) => `| ${L.fr.formules.items[f.id].name} | ${f.priceFrom ?? "à remplir"} | ${f.minGuests ?? "à remplir"} |`).join("\n")}

### Plats signature (\`data/menus.json\`)

Tirés de ses photos et légendes Instagram. « confirmé » = cité dans une légende ; « à valider » = vu en photo seulement.

${["europeen", "marocain"]
  .map((u) => `**${L.fr.univers[u].name}**\n\n${menus[u].map((d) => `- ${L.fr.univers.dishes[d.id].name} : ${L.fr.univers.dishes[d.id].text} (${d.confirmed ? "confirmé" : "à valider"})`).join("\n")}`)
  .join("\n\n")}

### Animations (\`data/animations.json\`)

${anims.animations.map((a) => `- ${L.fr.animations.items[a.id].name} : ${a.confirmed ? "citée dans une légende" : "vue en photo, à confirmer"} ; prix ${a.priceFrom ?? "à remplir"}`).join("\n")}

### Réalisations (\`data/realisations.json\`)

| Réalisation | Date | Lieu | Invités | Source |
|---|---|---|---|---|
${real.realisations.map((r) => `| ${L.fr.realisations.items[r.id].title} | ${r.date} | ${r.venue ?? "à remplir"} | ${r.guests ?? "à remplir"} | ${r.instagram} |`).join("\n")}

### Avis (\`data/avis.json\`)

Aucun avis affiché : la story « AVIS » n'est pas lisible sans connexion à Instagram. À recopier fidèlement (prénom, type d'événement, texte). Aucun avis n'a été inventé.
`);

const flat = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") return flat(v, key);
    return [[key, v]];
  });

const rows = { fr: Object.fromEntries(flat(L.fr)), ar: Object.fromEntries(flat(L.ar)), en: Object.fromEntries(flat(L.en)) };
const sections = [...new Set(Object.keys(rows.fr).map((k) => k.split(".")[0]))];
out.push(`## Tous les textes (FR · AR · EN)\n`);
for (const s of sections) {
  out.push(`### ${s}\n`);
  for (const k of Object.keys(rows.fr).filter((x) => x.split(".")[0] === s)) {
    out.push(`- \`${k}\`\n  - FR : ${rows.fr[k]}\n  - AR : ${rows.ar[k] ?? "—"}\n  - EN : ${rows.en[k] ?? "—"}`);
  }
  out.push("");
}

await writeFile(path.join(ROOT, "CONTENU.md"), out.join("\n") + "\n");
console.log("CONTENU.md écrit");
