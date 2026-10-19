import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.join(process.cwd(), "public", "posts");
const output = path.join(process.cwd(), "lib", "image-dimensions.json");
const dimensions = {};

async function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await scan(file);
    } else if (entry.isFile() && /\.(?:png|jpe?g|webp|avif)$/i.test(entry.name)) {
      const metadata = await sharp(file).metadata();
      if (!metadata.width || !metadata.height) continue;
      const rotated = metadata.orientation && metadata.orientation >= 5;
      const src = `/posts/${path.relative(root, file).split(path.sep).map(encodeURIComponent).join("/")}`;
      dimensions[src] = {
        width: rotated ? metadata.height : metadata.width,
        height: rotated ? metadata.width : metadata.height
      };
    }
  }
}

await scan(root);
fs.writeFileSync(output, `${JSON.stringify(dimensions, null, 2)}\n`);
console.log(`Recorded dimensions for ${Object.keys(dimensions).length} post images.`);
