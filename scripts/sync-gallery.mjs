import { readdir, readFile, writeFile } from "node:fs/promises";

const gallery_folder = new URL("../assets/gallery/", import.meta.url);
// excluded photos remain available elsewhere on the site
const excluded = new Set(JSON.parse(await readFile(new URL("excluded.json", gallery_folder), "utf8")));
const entries = await readdir(gallery_folder, { withFileTypes: true });
const images = entries
  .filter((entry) => entry.isFile() && /\.(avif|gif|jpe?g|png|webp)$/i.test(entry.name))
  .map((entry) => entry.name)
  .filter((name) => !excluded.has(name))
  .sort((first, second) => first.localeCompare(second, "en", { numeric: true }));

const output = "// generated gallery file list refreshed by the gallery sync script\n"
  + "window.AASA_GALLERY = " + JSON.stringify(images, null, 2) + ";\n";
await writeFile(new URL("../gallery.js", import.meta.url), output);
console.log(`gallery updated with ${images.length} images`);
