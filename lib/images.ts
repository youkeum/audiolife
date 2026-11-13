import imageDimensions from "./image-dimensions.json";
import generatedImages from "./generated/post-images.json";

type Dimensions = { width: number; height: number };
type GeneratedImage = Dimensions & { variants: { src: string; width: number }[] };

const dimensions = imageDimensions as Record<string, Dimensions>;
const generated = generatedImages as Record<string, GeneratedImage>;
const escapeAttribute = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

export function postImageSources(src: string, sizes: string) {
  let key = src.split(/[?#]/, 1)[0];
  if (!key.startsWith("/posts/")) return { src };
  try {
    key = key.split("/").map(part => encodeURIComponent(decodeURIComponent(part))).join("/");
  } catch {
    return { src };
  }

  const image = generated[key];
  const size = image ?? dimensions[key];
  if (!image?.variants.length) return { src, width: size?.width, height: size?.height };

  const variants = [...image.variants];
  const largest = variants[variants.length - 1];
  if (largest.width < Math.min(image.width, 1200)) {
    variants.push({ src, width: image.width });
  }

  return {
    src: variants[variants.length - 1].src,
    srcSet: variants.map(({ src: url, width }) => `${url} ${width}w`).join(", "),
    sizes,
    width: image.width,
    height: image.height
  };
}

export function optimizeContentImages(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, tag => {
    const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
    let attributes = ' loading="lazy" decoding="async"';
    let clean = tag.replace(/\s(?:loading|decoding)=["'][^"']*["']/gi, "");
    if (src) {
      const image = postImageSources(src.replaceAll("&amp;", "&").replaceAll("&#x26;", "&"), "(max-width: 800px) 94vw, 760px");
      if (image.width && image.height) {
        clean = clean.replace(/\s(?:width|height)=["'][^"']*["']/gi, "");
        attributes += ` width="${image.width}" height="${image.height}"`;
      }
      if (image.srcSet) {
        clean = clean.replace(/\s(?:src|srcset|sizes)=["'][^"']*["']/gi, "");
        attributes += ` src="${escapeAttribute(image.src)}" srcset="${escapeAttribute(image.srcSet)}" sizes="${escapeAttribute(image.sizes)}"`;
      }
    }
    return clean.replace(/\s*\/?>$/, `${attributes}>`);
  });
}
