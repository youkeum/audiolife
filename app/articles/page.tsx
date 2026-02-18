import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "기사",
  description: "오디오 산업 및 문화 기사 모음"
};

export default function ArticlesPage() {
  const posts = getAllPosts("articles");

  return (
    <>
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
