import { createHash, randomUUID } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = path.resolve("public/posts");
const publicRoot = path.resolve("public/_post-images");
const cacheRoot = path.resolve(".next/cache/post-images");
const manifestPath = path.resolve("lib/generated/post-images.json");
const widths = [360, 720, 1200];
const webpOptions = { quality: 76, effort: 3 };
const cacheVersion = JSON.stringify({ version: 1, sharp: sharp.versions, webpOptions });

async function findImages(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findImages(file));
    else if (entry.isFile() && /\.(?:jpe?g|png|webp|avif)$/i.test(entry.name)) files.push(file);
  }
  return files;
}

async function variant(buffer, hash, width) {
  const name = `${hash}-${width}.webp`;
  const cached = path.join(cacheRoot, name);
  const cachedSize = await stat(cached).then(file => file.size, error => {
    if (error.code !== "ENOENT") throw error;
    return 0;
  });

  if (cachedSize === 1) return null; // A previous build found that the source was smaller.
  if (!cachedSize) {
    const webp = await sharp(buffer).rotate().resize({ width, withoutEnlargement: true }).webp(webpOptions).toBuffer();
    const temporary = `${cached}.${randomUUID()}.tmp`;
    await writeFile(temporary, webp.length < buffer.length ? webp : Buffer.alloc(1));
    await rename(temporary, cached);
    if (webp.length >= buffer.length) return null;
  }

  await copyFile(cached, path.join(publicRoot, name));
  return { src: `/_post-images/${name}`, width };
}

async function prepare(file) {
  const buffer = await readFile(file);
  const metadata = await sharp(buffer).metadata();
  if ((metadata.pages ?? 1) > 1 || !metadata.width || !metadata.height) return null;

  const rotated = (metadata.orientation ?? 0) >= 5;
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;
  const hash = createHash("sha256").update(cacheVersion).update(buffer).digest("hex").slice(0, 24);
  const variants = [];
  for (const target of new Set(widths.map(size => Math.min(size, width)))) {
    const result = await variant(buffer, hash, target);
    if (result) variants.push(result);
  }
  const src = `/posts/${path.relative(sourceRoot, file).split(path.sep).map(encodeURIComponent).join("/")}`;
  return [src, { width, height, variants }];
}

await Promise.all([publicRoot, cacheRoot, path.dirname(manifestPath)].map(dir => mkdir(dir, { recursive: true })));
const files = (await findImages(sourceRoot)).sort();
const entries = new Array(files.length);
let nextFile = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (nextFile < files.length) {
    const index = nextFile++;
    entries[index] = await prepare(files[index]);
  }
}));

const manifest = Object.fromEntries(entries.filter(Boolean));
const published = new Set(Object.values(manifest).flatMap(image => image.variants.map(({ src }) => path.basename(src))));
for (const file of await readdir(publicRoot)) {
  if (/^[a-f0-9]{24}-\d+\.webp$/.test(file) && !published.has(file)) await rm(path.join(publicRoot, file));
}
await writeFile(manifestPath, JSON.stringify(manifest));
console.log(`Prepared ${published.size} WebP files for ${Object.keys(manifest).length} post images.`);
