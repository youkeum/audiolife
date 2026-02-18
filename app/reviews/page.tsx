import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "오디오 리뷰",
  description: "헤드폰, 스피커, DAC, 앰프 리뷰 모음"
};

export default function ReviewsPage() {
  const posts = getAllPosts("reviews");

  return (
    <>
      <h1 className="page-title">오디오 리뷰</h1>
      <p className="description">실사용 중심으로 기록한 장비 리뷰 아카이브입니다.</p>
      <section className="grid">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} basePath="/reviews" />
        ))}
      </section>
    </>
  );
}
