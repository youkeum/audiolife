import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostArchive from "@/components/PostArchive";
import { getPostsByTag } from "@/lib/content";
import { archiveHref, archiveState, type ArchiveQuery } from "@/lib/archive";
import { decodeRouteSegment } from "@/lib/route-params";
type Props = { params: Promise<{ tag: string }>; searchParams: Promise<ArchiveQuery> };
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const tag = decodeRouteSegment((await params).tag);
  const posts = getPostsByTag(tag);
  const state = archiveState(posts, await searchParams);
  return { title: `태그: ${tag}${state.page > 1 ? ` - ${state.page}페이지` : ""}`,
    description: `${tag} 관련 오디오 글 모음`,
    alternates: { canonical: `https://audiolife.kr${archiveHref(`/tags/${encodeURIComponent(tag)}`, state)}` },
    robots: { index: posts.length >= 3 && !state.q && !state.category, follow: true }
  };
}
export default async function Page({ params, searchParams }: Props) {
  const tag = decodeRouteSegment((await params).tag);
  const posts = getPostsByTag(tag).sort((a, b) => b.date.localeCompare(a.date));
  if (!posts.length) notFound();
  return <PostArchive query={await searchParams} collection={{ posts, path: `/tags/${encodeURIComponent(tag)}`, title: `태그: ${tag}`, description: "관심 있는 주제의 리뷰, 기사와 컬럼을 모았습니다." }} />;
}
