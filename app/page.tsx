import type { Metadata } from "next";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import { getAllPosts, getPostBasePath, getPostTypeLabel, type PostMeta } from "@/lib/content";
import { createOrganizationJsonLd, createWebSiteJsonLd } from "@/lib/seo";
import { HOME_ARCHIVE_COUNT, SITE_DESCRIPTION } from "@/lib/site";
import { hasDistinctExcerpt } from "@/lib/presentation";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: { absolute: "AudioLife | 하이파이·헤드파이 리뷰와 오디오 소식" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "https://audiolife.kr" }
};

function PostLink({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  return <Link href={`${getPostBasePath(post.type)}/${post.slug}`} className={featured ? styles.feature : styles.card}>
    {post.coverImage && <PostImage src={post.coverImage} alt={post.title} sizes={featured ? "(max-width: 800px) 94vw, 46vw" : "(max-width: 800px) 46vw, 23vw"} />}
    <div className={styles.meta}><time dateTime={post.date}>{post.date}</time> · {post.category}</div>
    <h3>{post.title}</h3>
    {featured && <p className={styles.summary}>{post.excerpt}</p>}
  </Link>;
}

export default function HomePage() {
  const reviews = getAllPosts("reviews");
  const articles = getAllPosts("articles");
  const columns = getAllPosts("columns");
  const latest = [...reviews, ...articles, ...columns].sort((a, b) => b.date.localeCompare(a.date))[0];
  return <div className={styles.home}>
    {[createWebSiteJsonLd(), createOrganizationJsonLd()].map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />)}
    {latest && <Link className={styles.hero} href={`${getPostBasePath(latest.type)}/${latest.slug}`}>
      <div className={styles.heroText}>
        <p className={styles.kicker}>LATEST POST</p>
        <h1>{latest.title}</h1>
        <div className={styles.meta}>{getPostTypeLabel(latest.type)} · <time dateTime={latest.date}>{latest.date}</time></div>
        <p className={styles.summary}>{latest.excerpt}</p>
        <span className={styles.read}>자세히 읽기 →</span>
      </div>
      {latest.coverImage && <PostImage src={latest.coverImage} alt={latest.title} priority className={styles.heroImage} sizes="(max-width: 800px) 94vw, 55vw" />}
    </Link>}

    <div className={styles.editorial}>
      <section aria-labelledby="reviews-heading">
        <div className={styles.heading}><h2 id="reviews-heading">LATEST REVIEWS</h2><Link href="/reviews">리뷰 전체 보기 →</Link></div>
        {reviews[0] && <PostLink post={reviews[0]} featured />}
        <div className={styles.reviewGrid}>{reviews.slice(1, HOME_ARCHIVE_COUNT + 1).map(post => <PostLink key={post.slug} post={post} />)}</div>
      </section>
      <section aria-labelledby="articles-heading">
        <div className={styles.heading}><h2 id="articles-heading">LATEST ARTICLES</h2><Link href="/articles">기사 전체 보기 →</Link></div>
        {articles[0] && <PostLink post={articles[0]} featured />}
        <div className={styles.newsList}>{articles.slice(1, HOME_ARCHIVE_COUNT + 1).map(post => <Link key={post.slug} className={styles.news} href={`/articles/${post.slug}`}>
          <div className={styles.newsMeta}><time dateTime={post.date}>{post.date}</time><span>{post.category}</span></div>
          <div className={styles.newsText}><h3>{post.title}{hasDistinctExcerpt(post) && <span> - {post.excerpt}</span>}</h3><p>{post.bodyPreview || post.excerpt}</p></div>
          {post.coverImage && <PostImage src={post.coverImage} alt={post.title} sizes="(max-width: 800px) 22vw, 160px" />}
        </Link>)}</div>
      </section>
    </div>

    <section aria-labelledby="columns-heading">
      <div className={styles.heading}><h2 id="columns-heading">COLUMNS & GUIDES</h2><Link href="/columns">컬럼 전체 보기 →</Link></div>
      <div className={styles.columnGrid}>{columns.slice(0, 4).map(post => <PostLink key={post.slug} post={post} />)}</div>
    </section>
    <section className={styles.channels} aria-label="AudioLife 채널">
      <div><p className={styles.kicker}>MORE FROM AUDIOLIFE</p><h2>음악과 오디오, 더 깊이.</h2></div>
      <a href="https://blog.naver.com/audiolife-" target="_blank" rel="noreferrer">네이버 블로그 <span>오디오 이야기 더 읽기 ↗</span></a>
      <a href="https://www.youtube.com/@portablewave" target="_blank" rel="noreferrer">PortableWave <span>YouTube에서 영상 보기 ↗</span></a>
    </section>
  </div>;
}
