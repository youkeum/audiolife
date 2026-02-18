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
      {latestPost ? (
        <Link
          className="magazine-hero hero-latest"
          href={`${latestPost.type === "reviews" ? "/reviews" : "/articles"}/${latestPost.slug}`}
          style={
            latestPost.coverImage
              ? {
                  backgroundImage:
                    `linear-gradient(110deg, rgba(5,5,5,0.88) 10%, rgba(20,10,5,0.52) 55%, rgba(12,7,5,0.82) 100%), url(${latestPost.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }
              : undefined
          }
        >
          <p className="magazine-kicker">LATEST POST</p>
          <h1>{latestPost.title}</h1>
          <p className="hero-meta">{latestPost.type === "reviews" ? "REVIEW" : "ARTICLE"} · {latestPost.date}</p>
          <p className="hero-excerpt">{latestPost.excerpt}</p>
        </Link>
      ) : (
        <section className="magazine-hero">
          <h1>최신 글이 아직 없습니다.</h1>
        </section>
      )}

      <section className="banner-row" aria-label="배너 영역">
        <a
          className="banner-slot"
          href="https://blog.naver.com/audiolife-"
          target="_blank"
          rel="noreferrer"
        >
          <img className="banner-image" src="/banners/banner1.jpg" alt="AudioLife Naver Blog" />
        </a>
        <a
          className="banner-slot"
          href="https://www.youtube.com/@portablewave"
          target="_blank"
          rel="noreferrer"
        >
          <img className="banner-image" src="/banners/banner2.jpg" alt="PortableWave YouTube" />
        </a>
        <a className="banner-slot" href="/about">
          <span>SPONSOR BANNER 03</span>
        </a>
      </section>

      <section className="magazine-grid">
        <div className="mag-col">
          <div className="mag-col-head">
            <h2>LATEST REVIEWS</h2>
            <Link href="/reviews">ALL REVIEWS</Link>
          </div>

          {featureReview ? (
            <Link className="mag-feature" href={`/reviews/${featureReview.slug}`}>
              {featureReview.coverImage ? (
                <img className="mag-thumb-image" src={featureReview.coverImage} alt={featureReview.title} />
              ) : (
                <div className="mag-thumb">{featureReview.category.toUpperCase()}</div>
              )}
              <div className="meta">{featureReview.date}</div>
              <h3>{featureReview.title}</h3>
              <p className="description">{featureReview.excerpt}</p>
            </Link>
          ) : null}

          <div className="mag-list">
            {reviewList.map((post) => (
              <Link
                key={post.slug}
                className={`mag-row ${post.coverImage ? "has-thumb" : "no-thumb"}`}
                href={`/reviews/${post.slug}`}
              >
                {post.coverImage ? <img className="mag-row-thumb" src={post.coverImage} alt={post.title} /> : null}
                <div>
                  <div className="meta">{post.date}</div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
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
              {featureArticle.coverImage ? (
                <img className="mag-thumb-image" src={featureArticle.coverImage} alt={featureArticle.title} />
              ) : (
                <div className="mag-thumb">{featureArticle.category.toUpperCase()}</div>
              )}
              <div className="meta">{featureArticle.date}</div>
              <h3>{featureArticle.title}</h3>
              <p className="description">{featureArticle.excerpt}</p>
            </Link>
          ) : null}

          <div className="mag-list">
            {articleList.map((post) => (
              <Link
                key={post.slug}
                className={`mag-row ${post.coverImage ? "has-thumb" : "no-thumb"}`}
                href={`/articles/${post.slug}`}
              >
                {post.coverImage ? <img className="mag-row-thumb" src={post.coverImage} alt={post.title} /> : null}
                <div>
                  <div className="meta">{post.date}</div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
