import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/content";
import { createItemListJsonLd, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "컬럼",
  description: "Hi-Fi/Head-Fi 지식 컬럼 모음",
  alternates: {
    canonical: `${SITE_URL}/columns`
  }
};

export default function ColumnsPage() {
  const posts = getAllPosts("columns");
  const itemListJsonLd = createItemListJsonLd({
    name: "AudioLife 컬럼 목록",
    description: "Hi-Fi/Head-Fi 지식 컬럼 모음",
    path: "/columns",
    posts
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <h1 className="page-title">컬럼</h1>
      <p className="description">초보자부터 중급자까지 단계적으로 쌓는 오디오 지식 컬럼입니다.</p>
      <section className="grid">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} basePath="/columns" />
        ))}
      </section>
    </>
  );
}
