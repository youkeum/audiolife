import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default async function Icon() {
  const image = await readFile(path.join(process.cwd(), "public/brand/audiolife-icon-256-v3.png"));
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": contentType }
  });
}
