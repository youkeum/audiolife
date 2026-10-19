import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostArchive from "@/components/PostArchive";
import { getPostsByTag } from "@/lib/content";
import { archiveHref, archiveState, type ArchiveQuery } from "@/lib/archive";
type Props = { params: { tag: string }; searchParams: ArchiveQuery };
export function generateMetadata({ params, searchParams }: Props): Metadata {
  const posts = getPostsByTag(params.tag);
  const state = archiveState(posts, searchParams);
  return { title: `태그: ${params.tag}${state.page > 1 ? ` - ${state.page}페이지` : ""}`,
    description: `${params.tag} 관련 오디오 글 모음`,
    alternates: { canonical: `https://audiolife.kr${archiveHref(`/tags/${encodeURIComponent(params.tag)}`, state)}` },
    robots: { index: posts.length >= 3 && !state.q && !state.category, follow: true }
  };
}
export default function Page({ params, searchParams }: Props) {
  const posts = getPostsByTag(params.tag).sort((a, b) => b.date.localeCompare(a.date));
  if (!posts.length) notFound();
  return <PostArchive query={searchParams} collection={{ posts, path: `/tags/${encodeURIComponent(params.tag)}`, title: `태그: ${params.tag}`, description: "관심 있는 주제의 리뷰, 기사와 컬럼을 모았습니다." }} />;
}
