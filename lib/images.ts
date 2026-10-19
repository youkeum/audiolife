import path from "node:path";
import sharp from "sharp";
import { getImageProps } from "next/image";

const publicRoot = path.join(process.cwd(), "public");
const dimensions = new Map<string, Promise<{ width: number; height: number } | null>>();
const escapeAttribute = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

function imageDimensions(src: string) {
  if (!dimensions.has(src)) {
    dimensions.set(src, (async () => {
      try {
        const file = path.resolve(publicRoot, `.${decodeURIComponent(src)}`);
        if (!file.startsWith(`${publicRoot}${path.sep}`)) return null;
        const metadata = await sharp(file).metadata();
        if (!metadata.width || !metadata.height) return null;
        const rotated = metadata.orientation && metadata.orientation >= 5;
        return { width: rotated ? metadata.height : metadata.width, height: rotated ? metadata.width : metadata.height };
      } catch { return null; }
    })());
  }
  return dimensions.get(src)!;
}

// Leave source files untouched; responsive variants are generated and cached by Next.js.
export async function optimizeContentImages(html: string): Promise<string> {
  const images = [...html.matchAll(/<img\b[^>]*>/gi)];
  const replacements = await Promise.all(images.map(async ([tag]) => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    const size = src && /^\/(?!\/).+\.(?:png|jpe?g|webp|avif)$/i.test(src) ? await imageDimensions(src) : null;
    let attributes = ' loading="lazy" decoding="async"';
    let clean = tag.replace(/\s(?:loading|decoding)=["'][^"']*["']/gi, "");
    if (src && size) {
      const { props } = getImageProps({ src, alt: "", ...size, sizes: "(max-width: 800px) 94vw, 760px", quality: 75 });
      clean = clean.replace(/\s(?:src|srcset|sizes|width|height)=["'][^"']*["']/gi, "");
      attributes += ` src="${escapeAttribute(props.src)}" srcset="${escapeAttribute(props.srcSet || "")}" sizes="${escapeAttribute(props.sizes || "")}" width="${size.width}" height="${size.height}"`;
    }
    return clean.replace(/\s*\/?>$/, `${attributes}>`);
  }));
  let index = 0;
  return html.replace(/<img\b[^>]*>/gi, () => replacements[index++]);
}
