import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import PostArchive from "@/components/PostArchive";
import { getAllCategories, getPostsByCategory } from "@/lib/content";
import { archiveHref, archiveState, type ArchiveQuery } from "@/lib/archive";
import { decodeRouteSegment } from "@/lib/route-params";
import { canonicalCategory, categoryPath, categoryRedirectHref } from "@/lib/category-route";
type Props = { params: { category: string }; searchParams: ArchiveQuery };
export function generateMetadata({ params, searchParams }: Props): Metadata {
  const category = canonicalCategory(decodeRouteSegment(params.category), getAllCategories());
  if (!category) notFound();
  const posts = getPostsByCategory(category);
  const state = archiveState(posts, searchParams);
  return { title: `카테고리: ${category}${state.page > 1 ? ` - ${state.page}페이지` : ""}`,
    description: `${category} 관련 오디오 글 모음`,
    alternates: { canonical: `https://audiolife.kr${archiveHref(categoryPath(category), state)}` },
    robots: { index: posts.length >= 3 && !state.q && !state.category, follow: true }
  };
}
export default function Page({ params, searchParams }: Props) {
  const requestedCategory = decodeRouteSegment(params.category);
  const category = canonicalCategory(requestedCategory, getAllCategories());
  if (!category) notFound();
  if (requestedCategory !== category) permanentRedirect(categoryRedirectHref(category, searchParams));
  const posts = getPostsByCategory(category).sort((a, b) => b.date.localeCompare(a.date));
  if (!posts.length) notFound();
  return <PostArchive query={searchParams} collection={{ posts, path: categoryPath(category), title: `카테고리: ${category}`, description: "관심 있는 주제의 리뷰, 기사와 컬럼을 모았습니다." }} />;
}
