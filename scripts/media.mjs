// Prépare les images classées dans assets/<catégorie>/ pour le web :
// public/media/<catégorie>/<nom>.jpg (côté long 1600 px max). next/image sert ensuite l'AVIF/WebP à la bonne taille.
// Crée aussi l'image Open Graph (1200 × 630) et écrit les dimensions réelles dans data/media-sizes.json.
//   npm run media
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATS = ["hero", "mariages", "marocain", "europeen", "corporate", "animations", "galerie"];

let n = 0;
const sizes = {};
for (const cat of CATS) {
  const src = path.join(ROOT, "assets", cat);
  const out = path.join(ROOT, "public/media", cat);
  await mkdir(out, { recursive: true });
  const files = (await readdir(src).catch(() => [])).filter((f) => /\.jpe?g$/i.test(f));
  for (const f of files) {
    const info = await sharp(path.join(src, f))
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(path.join(out, f));
    sizes[`/media/${cat}/${f}`] = [info.width, info.height];
    n += 1;
  }
}
await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");

// Open Graph : le buffet du château (photo verticale recadrée)
await sharp(path.join(ROOT, "assets/hero/buffet-chateau-nappe-sauge.jpg"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

console.log(`${n} images prêtes`);
