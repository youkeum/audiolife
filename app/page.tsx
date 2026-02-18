import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/content";

export default function HomePage() {
  const latestReviews = getAllPosts("reviews").slice(0, 3);
  const latestArticles = getAllPosts("articles").slice(0, 3);

  return (
    <>
      <section className="hero">
        <h1>오디오 경험을 기록하는 아카이브</h1>
        <p>
          AudioLife는 헤드폰, 스피커, DAC, 앰프 등 실사용 기반 오디오 리뷰와
          오디오 문화/시장 분석 기사를 발행합니다.
        </p>
      </section>

      <div className="section-head">
        <h2>최신 오디오 리뷰</h2>
        <Link href="/reviews">전체 보기</Link>
      </div>
      <section className="grid">
        {latestReviews.map((post) => (
          <PostCard key={post.slug} post={post} basePath="/reviews" />
        ))}
      </section>

      <div className="section-head">
        <h2>최신 기사</h2>
        <Link href="/articles">전체 보기</Link>
      </div>
      <section className="grid">
        {latestArticles.map((post) => (
          <PostCard key={post.slug} post={post} basePath="/articles" />
        ))}
      </section>
    </>
  );
}
