import type { Metadata } from "next";
import PostArchive from "@/components/PostArchive";
import { getAllPosts } from "@/lib/content";
import type { ArchiveQuery } from "@/lib/archive";
export const metadata: Metadata = {
  title: "검색", description: "오디오 리뷰, 기사, 컬럼 검색",
  robots: { index: false, follow: true }
};
export default function SearchPage({ searchParams }: { searchParams: ArchiveQuery }) {
  const posts = [...getAllPosts("reviews"), ...getAllPosts("articles"), ...getAllPosts("columns")].sort((a, b) => b.date.localeCompare(a.date));
  return <PostArchive query={searchParams} collection={{ posts, path: "/search", title: "통합 검색", description: "제품명, 브랜드와 주제로 AudioLife의 모든 글을 찾아보세요." }} />;
}
