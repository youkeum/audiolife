import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type PostType = "reviews" | "articles";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  type: PostType;
  coverImage?: string;
  heroTextColor?: "white" | "black";
};

export type Post = PostMeta & {
  contentHtml: string;
};

type Frontmatter = {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage?: string;
  heroTextColor?: "white" | "black";
};

function getContentDir(type: PostType) {
  return path.join(process.cwd(), "content", type);
}

function extractFirstImagePath(markdown: string): string | undefined {
  const match = markdown.match(/!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  return match?.[1];
}

function removeFirstImage(markdown: string): string {
  return markdown.replace(/\n?!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)\n?/, "\n");
}

function extractYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = parsed.searchParams.get("v");
      return id && id.length >= 11 ? id : null;
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id || null;
    }

    return null;
  } catch {
    return null;
  }
}

function withYoutubeEmbeds(markdown: string): string {
  const youtubeLine = /^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?[^\s]+|youtu\.be\/[^\s]+))$/gm;
  return markdown.replace(youtubeLine, (url) => {
    const id = extractYoutubeId(url.trim());
    if (!id) {
      return url;
    }

    return `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${id}" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function extractMeta(content: string, property: string): string | null {
  const byProperty = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  const byName = new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  const match = content.match(byProperty) ?? content.match(byName);
  return match?.[1]?.trim() ?? null;
}

function normalizeCharset(label: string): string {
  const charset = label.trim().toLowerCase().replaceAll("_", "-");
  if (charset === "x-sjis" || charset === "ms932" || charset === "windows-31j") {
    return "shift_jis";
  }
  if (charset === "sjis") {
    return "shift_jis";
  }
  if (charset === "eucjp") {
    return "euc-jp";
  }
  if (charset === "latin1") {
    return "iso-8859-1";
  }
  return charset;
}

function detectCharsetFromBytes(bytes: Uint8Array): string | null {
  const headerProbe = Buffer.from(bytes.subarray(0, Math.min(4096, bytes.length))).toString("latin1");
  const metaCharset =
    headerProbe.match(/<meta[^>]+charset=["']?\s*([a-zA-Z0-9._-]+)/i)?.[1] ??
    headerProbe.match(/<meta[^>]+content=["'][^"']*charset=([a-zA-Z0-9._-]+)/i)?.[1];
  return metaCharset ? normalizeCharset(metaCharset) : null;
}

function decodeHtmlBytes(bytes: Uint8Array, contentType: string | null): string {
  const headerCharsetMatch = contentType?.match(/charset=([a-zA-Z0-9._-]+)/i)?.[1];
  const detectedCharset = headerCharsetMatch ? normalizeCharset(headerCharsetMatch) : detectCharsetFromBytes(bytes);
  const candidates = [detectedCharset, "utf-8"].filter(Boolean) as string[];

  for (const charset of candidates) {
    try {
      return new TextDecoder(charset).decode(bytes);
    } catch {
      continue;
    }
  }

  return new TextDecoder().decode(bytes);
}

function extractTitle(content: string): string | null {
  const ogTitle = extractMeta(content, "og:title");
  if (ogTitle) return ogTitle;
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch?.[1]?.trim() ?? null;
}

async function fetchLinkPreview(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; AudioLifeBot/1.0)" },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    const htmlText = decodeHtmlBytes(bytes, response.headers.get("content-type"));
    const title = extractTitle(htmlText);
    const description = extractMeta(htmlText, "og:description") ?? extractMeta(htmlText, "description");
    const image = extractMeta(htmlText, "og:image");
    const siteName = extractMeta(htmlText, "og:site_name");
    const hostname = new URL(url).hostname.replace("www.", "");

    return [
      `<div class="link-card">`,
      `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">`,
      image ? `<img class="link-card-image" src="${escapeHtml(image)}" alt="${escapeHtml(title ?? hostname)}" />` : "",
      `<div class="link-card-body">`,
      `<p class="link-card-domain">${escapeHtml(siteName ?? hostname)}</p>`,
      title ? `<h4>${escapeHtml(title)}</h4>` : "",
      description ? `<p class="link-card-description">${escapeHtml(description)}</p>` : "",
      `</div>`,
      `</a>`,
      `</div>`
    ].join("");
  } catch {
    return null;
  }
}

function renderLinkFallback(url: string): string {
  let hostLabel = "OPEN LINK";
  try {
    hostLabel = new URL(url).hostname.replace("www.", "").toUpperCase();
  } catch {
    // Keep default label when URL parsing fails.
  }

  return [
    `<div class="link-fallback">`,
    `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">`,
    `${hostLabel} 방문하기`,
    `</a>`,
    `</div>`
  ].join("");
}

async function withLinkCards(markdown: string): Promise<string> {
  const lines = markdown.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const isStandaloneUrl = /^https?:\/\/\S+$/i.test(trimmed);
    const isYoutube = /(?:youtube\.com\/watch|youtu\.be\/)/i.test(trimmed);
    const isImageUrl = /\.(?:png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(trimmed);

    if (isStandaloneUrl && !isYoutube && !isImageUrl) {
      const card = await fetchLinkPreview(trimmed);
      if (card) {
        result.push(card);
        continue;
      }

      result.push(renderLinkFallback(trimmed));
      continue;
    }

    result.push(line);
  }

  return result.join("\n");
}

function withSoftLineBreaks(markdown: string): string {
  return markdown
    .split("\n")
    .map((line, index, lines) => {
      const next = lines[index + 1] ?? "";
      const isEmpty = line.trim() === "";
      const nextIsEmpty = next.trim() === "";
      const isMdSyntax =
        /^(#{1,6}\s|>\s|[-*]\s|\d+\.\s|```|!\[|\[.*\]\(.*\)|\||<)/.test(line.trim()) ||
        line.trim().endsWith("|");

      if (isEmpty || nextIsEmpty || isMdSyntax) {
        return line;
      }

      return `${line}  `;
    })
    .join("\n");
}

function parseFile(type: PostType, fileName: string): { meta: PostMeta; content: string } {
  const fullPath = path.join(getContentDir(type), fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as Frontmatter;
  const slug = fileName.replace(/\.md$/, "");
  const firstImage = extractFirstImagePath(content);

  return {
    meta: {
      slug,
      type,
      title: frontmatter.title,
      date: frontmatter.date,
      excerpt: frontmatter.excerpt,
      category: frontmatter.category,
      tags: frontmatter.tags ?? [],
      coverImage: frontmatter.coverImage ?? firstImage,
      heroTextColor: frontmatter.heroTextColor ?? "white"
    },
    content
  };
}

export function getAllPosts(type: PostType): PostMeta[] {
  const files = fs
    .readdirSync(getContentDir(type))
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"));

  return files
    .map((file) => parseFile(type, file).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(type: PostType, slug: string): Promise<Post> {
  const { meta, content } = parseFile(type, `${slug}.md`);
  const contentWithoutCover = removeFirstImage(content);
  const markdownWithEmbeds = withYoutubeEmbeds(contentWithoutCover);
  const markdownWithCards = await withLinkCards(markdownWithEmbeds);
  const markdownWithBreaks = withSoftLineBreaks(markdownWithCards);
  const processed = await remark().use(html, { sanitize: false }).process(markdownWithBreaks);

  return {
    ...meta,
    contentHtml: processed.toString()
  };
}

export function getAllCategories() {
  const entries = [...getAllPosts("reviews"), ...getAllPosts("articles")];
  return Array.from(new Set(entries.map((post) => post.category))).sort();
}

export function getAllTags() {
  const entries = [...getAllPosts("reviews"), ...getAllPosts("articles")];
  return Array.from(new Set(entries.flatMap((post) => post.tags))).sort();
}

export function getPostsByCategory(category: string): PostMeta[] {
  const entries = [...getAllPosts("reviews"), ...getAllPosts("articles")];
  return entries.filter((post) => post.category.toLowerCase() === category.toLowerCase());
}

export function getPostsByTag(tag: string): PostMeta[] {
  const entries = [...getAllPosts("reviews"), ...getAllPosts("articles")];
  return entries.filter((post) => post.tags.some((entry) => entry.toLowerCase() === tag.toLowerCase()));
}
