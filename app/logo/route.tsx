import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

// Keep the existing public logo URL working; new consumers use versioned assets.
export async function GET() {
  const image = await readFile(path.join(process.cwd(), "public/brand/audiolife-wordmark-v3.png"));
  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
