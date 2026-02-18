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
      coverImage: frontmatter.coverImage ?? firstImage
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
  const processed = await remark().use(html, { sanitize: false }).process(markdownWithEmbeds);

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
