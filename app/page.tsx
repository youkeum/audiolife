import Link from "next/link";
import { getAllPosts } from "@/lib/content";

export default function HomePage() {
  const latestReviews = getAllPosts("reviews");
  const latestArticles = getAllPosts("articles");
  const latestMixed = [...latestReviews, ...latestArticles].sort((a, b) => (a.date < b.date ? 1 : -1));
  const latestPost = latestMixed[0];
  const featureReview = latestReviews[0];
  const featureArticle = latestArticles[0];
  const reviewList = latestReviews.slice(1, 8);
  const articleList = latestArticles.slice(1, 8);

  return (
    <>
      <section className="magazine-hero">
        <p className="magazine-kicker">AUDIO LIFE JOURNAL</p>
        <h1>오디오 리뷰와 기사를 한 곳에서 읽는 매거진</h1>
        {latestPost ? (
          <Link
            className="latest-banner"
            href={`${latestPost.type === "reviews" ? "/reviews" : "/articles"}/${latestPost.slug}`}
          >
            <span>LATEST</span>
            <strong>{latestPost.title}</strong>
            <em>{latestPost.type === "reviews" ? "리뷰" : "기사"} · {latestPost.date}</em>
          </Link>
        ) : null}
      </section>

      <section className="magazine-grid">
        <div className="mag-col">
          <div className="mag-col-head">
            <h2>LATEST REVIEWS</h2>
            <Link href="/reviews">ALL REVIEWS</Link>
          </div>

          {featureReview ? (
            <Link className="mag-feature" href={`/reviews/${featureReview.slug}`}>
              <div className="mag-thumb">{featureReview.category.toUpperCase()}</div>
              <div className="meta">{featureReview.date}</div>
              <h3>{featureReview.title}</h3>
              <p className="description">{featureReview.excerpt}</p>
            </Link>
          ) : null}

          <div className="mag-list">
            {reviewList.map((post) => (
              <Link key={post.slug} className="mag-row" href={`/reviews/${post.slug}`}>
                <div>
                  <div className="meta">{post.date}</div>
                  <h3>{post.title}</h3>
                </div>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mag-col">
          <div className="mag-col-head">
            <h2>LATEST ARTICLES</h2>
            <Link href="/articles">ALL ARTICLES</Link>
          </div>

          {featureArticle ? (
            <Link className="mag-feature" href={`/articles/${featureArticle.slug}`}>
              <div className="mag-thumb">{featureArticle.category.toUpperCase()}</div>
              <div className="meta">{featureArticle.date}</div>
              <h3>{featureArticle.title}</h3>
              <p className="description">{featureArticle.excerpt}</p>
            </Link>
          ) : null}

          <div className="mag-list">
            {articleList.map((post) => (
              <Link key={post.slug} className="mag-row" href={`/articles/${post.slug}`}>
                <div>
                  <div className="meta">{post.date}</div>
                  <h3>{post.title}</h3>
                </div>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
