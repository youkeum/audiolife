import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/content";
import { createItemListJsonLd, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "기사",
  description: "오디오 산업 및 문화 기사 모음",
  alternates: {
    canonical: `${SITE_URL}/articles`
  }
};

export default function ArticlesPage() {
  const posts = getAllPosts("articles");
  const itemListJsonLd = createItemListJsonLd({
    name: "AudioLife 기사 목록",
    description: "오디오 산업 및 문화 기사 모음",
    path: "/articles",
    posts
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <h1 className="page-title">기사</h1>
      <p className="description">오디오 시장/트렌드/문화에 대한 분석 기사 모음입니다.</p>
      <section className="grid">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} basePath="/articles" />
        ))}
      </section>
    </>
  );
}
