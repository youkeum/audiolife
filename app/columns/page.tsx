import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "컬럼",
  description: "Hi-Fi/Head-Fi 지식 컬럼 모음"
};

export default function ColumnsPage() {
  const posts = getAllPosts("columns");

  return (
    <>
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
