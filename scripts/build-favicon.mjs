/**
 * Vygeneruje src/app/favicon.ico ze značkového monogramu v src/app/icon.svg.
 *
 * Proč vůbec: Next.js z icon.svg obslouží /icon.svg, ale /favicon.ico ne — a
 * prohlížeče i roboti si ho vyžádají podle konvence. Search Console kvůli tomu
 * hlásila 404. Konvence Next.js: soubor musí být .ico přímo v kořeni app/.
 *
 * ICO je kontejner; jako data nesou jednotlivé velikosti rovnou PNG, což čtou
 * všechny dnešní prohlížeče. Spouští se ručně: npm run favicon
 */
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const SRC = "src/app/icon.svg";
const OUT = "src/app/favicon.ico";
const SIZES = [16, 32, 48];

const pngs = [];
for (const size of SIZES) pngs.push(await sharp(SRC).resize(size, size).png().toBuffer());

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // typ 1 = ikona
header.writeUInt16LE(SIZES.length, 4);

const entries = [];
let offset = header.length + 16 * SIZES.length;
SIZES.forEach((size, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size, 0); // šířka
  e.writeUInt8(size, 1); // výška
  e.writeUInt8(0, 2); // velikost palety (0 = bez palety)
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // barevné roviny
  e.writeUInt16LE(32, 6); // bitů na pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  entries.push(e);
  offset += pngs[i].length;
});

writeFileSync(OUT, Buffer.concat([header, ...entries, ...pngs]));
console.log(`${OUT}: ${SIZES.join("/")} px`);
