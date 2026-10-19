import type { PostMeta } from "./content";

export function hasDistinctExcerpt(post: Pick<PostMeta, "excerpt" | "bodyPreview">): boolean {
  const normalize = (text: string) => text.replace(/\s+/g, " ").replace(/[.\u2026]+$/, "").trim();
  const excerpt = normalize(post.excerpt || "");
  const body = normalize(post.bodyPreview || "");
  return Boolean(excerpt) && (!body || !body.startsWith(excerpt));
}
