import Link from "next/link";
import MemberComments from "./MemberComments";
import PostImage from "./PostImage";
import PostCard from "./PostCard";
import { getAllPosts, getPostBasePath, type Post } from "@/lib/content";
import { ARCHIVES } from "@/lib/archive";
import { hasDistinctExcerpt } from "@/lib/presentation";
import { categoryPath } from "@/lib/category-route";
import styles from "./PostDetail.module.css";

export default function PostDetail({ post, schema }: { post: Post; schema: object }) {
  const candidates = [...getAllPosts("reviews"), ...getAllPosts("articles"), ...getAllPosts("columns")]
    .filter(entry => !(entry.slug === post.slug && entry.type === post.type));
  const related = candidates.map(entry => ({ entry, score:
    (entry.category === post.category ? 4 : 0) +
    entry.tags.filter(tag => post.tags.includes(tag) && !["리뷰", "기사", "오디오", "컬럼"].includes(tag)).length * 2 +
    (entry.type === post.type ? 1 : 0)
  })).sort((a, b) => b.score - a.score || b.entry.date.localeCompare(a.entry.date)).slice(0, 3);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <article className={styles.article}>
      <header className={styles.header}>
        <nav className={styles.breadcrumbs} aria-label="현재 위치"><Link href="/">홈</Link><span>/</span><Link href={getPostBasePath(post.type)}>{ARCHIVES[post.type].title}</Link><span>/</span><Link href={categoryPath(post.category)}>{post.category}</Link></nav>
        <h1>{post.title}</h1>
        {hasDistinctExcerpt(post) && <p className={styles.intro}>{post.excerpt}</p>}
        <div className={styles.byline}><span>{post.type === "reviews" ? "리뷰어 YK" : "audiolife"}</span><time dateTime={post.date}>{post.date}</time>{post.updated && post.updated !== post.date && <span>수정 <time dateTime={post.updated}>{post.updated}</time></span>}</div>
      </header>
      {post.coverImage && <PostImage src={post.coverImage} alt={post.title} contain priority className={styles.cover} sizes="(max-width: 980px) 94vw, 960px" />}
      <div className={`prose ${styles.prose}`} dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <nav className={styles.tags} aria-label="관련 태그">{post.tags.map(tag => <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>#{tag}</Link>)}</nav>
      <section className={styles.related} aria-labelledby="related-heading"><h2 id="related-heading">함께 읽으면 좋은 글</h2><div>{related.map(({ entry }) => <PostCard key={`${entry.type}-${entry.slug}`} post={entry} basePath={getPostBasePath(entry.type)} />)}</div></section>
      <section className={`comment-box ${styles.comments}`} aria-label="댓글"><h2>댓글</h2><MemberComments postType={post.type} postSlug={post.slug} /></section>
    </article>
  </>;
}
