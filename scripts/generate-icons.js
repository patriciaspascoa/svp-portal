import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, "../public/icon.svg");
const svg = readFileSync(svgPath);

const sizes = [
  { size: 192, out: "icon-192.png" },
  { size: 512, out: "icon-512.png" },
  { size: 180, out: "apple-touch-icon.png" },
];

for (const { size, out } of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(resolve(__dirname, `../public/${out}`));
  console.log(`✓ public/${out}`);
}
