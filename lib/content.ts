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
};

function getContentDir(type: PostType) {
  return path.join(process.cwd(), "content", type);
}

function parseFile(type: PostType, fileName: string): { meta: PostMeta; content: string } {
  const fullPath = path.join(getContentDir(type), fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as Frontmatter;
  const slug = fileName.replace(/\.md$/, "");

  return {
    meta: {
      slug,
      type,
      title: frontmatter.title,
      date: frontmatter.date,
      excerpt: frontmatter.excerpt,
      category: frontmatter.category,
      tags: frontmatter.tags ?? []
    },
    content
  };
}

export function getAllPosts(type: PostType): PostMeta[] {
  const files = fs
    .readdirSync(getContentDir(type))
    .filter((file) => file.endsWith(".md"));

  return files
    .map((file) => parseFile(type, file).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(type: PostType, slug: string): Promise<Post> {
  const { meta, content } = parseFile(type, `${slug}.md`);
  const processed = await remark().use(html).process(content);

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
