import type { Metadata } from "next";
import type { PostMeta, PostType } from "./content";
import { ARCHIVE_PAGE_SIZE } from "./site";

export type ArchiveQuery = Record<string, string | string[] | undefined>;
export const ARCHIVES: Record<PostType, { title: string; description: string }> = {
  reviews: { title: "오디오 리뷰", description: "하이파이와 헤드파이, 제품과 청음 공간의 경험을 기록합니다." },
  articles: { title: "오디오 소식", description: "신제품부터 업계의 움직임까지, 오디오의 새로운 소식을 전합니다." },
  columns: { title: "오디오 컬럼", description: "더 깊이 듣고 이해하기 위한 오디오 이야기와 가이드." }
};
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() || "";
export function archiveState(posts: PostMeta[], query: ArchiveQuery) {
  const q = first(query.q).slice(0, 200);
  const category = first(query.category);
  const rawPage = first(query.page);
  const page = /^\d+$/.test(rawPage) ? Math.max(1, Number(rawPage)) : 1;
  const filtered = posts.filter(post => (!category || post.category === category) &&
    (!q || [post.title, post.excerpt, ...post.tags].join(" ").toLocaleLowerCase().includes(q.toLocaleLowerCase())));
  const pages = Math.max(1, Math.ceil(filtered.length / ARCHIVE_PAGE_SIZE));
  return { q, category, page, pages, total: filtered.length, posts: filtered.slice((page - 1) * ARCHIVE_PAGE_SIZE, page * ARCHIVE_PAGE_SIZE) };
}
export function archiveHref(path: string, state: { q: string; category: string; page: number }) {
  const query = new URLSearchParams();
  if (state.q) query.set("q", state.q);
  if (state.category) query.set("category", state.category);
  if (state.page > 1) query.set("page", String(state.page));
  return `${path}${query.size ? `?${query}` : ""}`;
}
export function archiveMetadata(type: PostType, query: ArchiveQuery): Metadata {
  const state = archiveState([], query);
  return {
    title: `${ARCHIVES[type].title}${state.page > 1 ? ` - ${state.page}페이지` : ""}`,
    description: ARCHIVES[type].description,
    alternates: { canonical: `https://audiolife.kr${archiveHref(`/${type}`, state)}` },
    ...(state.q || state.category ? { robots: { index: false, follow: true } } : {})
  };
}
