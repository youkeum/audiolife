import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GiscusComments from "@/components/GiscusComments";
import { getAllPosts, getPostBySlug } from "@/lib/content";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return getAllPosts("reviews").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug("reviews", params.slug);
    return {
      title: post.title,
      description: post.excerpt
    };
  } catch {
    return { title: "리뷰" };
  }
}

export default async function ReviewDetailPage({ params }: Props) {
  try {
    const post = await getPostBySlug("reviews", params.slug);
    const recentPosts = [...getAllPosts("reviews"), ...getAllPosts("articles")]
      .filter((entry) => !(entry.type === "reviews" && entry.slug === params.slug))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 6);

    return (
      <div className="detail-layout">
        <article className="article">
          {post.coverImage ? (
            <section className="post-hero">
              <img className="post-cover" src={post.coverImage} alt={post.title} />
              <div className={`post-hero-content text-${post.heroTextColor ?? "white"}`}>
                <div className="meta post-hero-meta">{post.date} · {post.category}</div>
                <h1 className="page-title post-hero-title">{post.title}</h1>
                <p className="description post-hero-subtitle">{post.excerpt}</p>
              </div>
            </section>
          ) : (
            <>
              <div className="meta">{post.date} · {post.category}</div>
              <h1 className="page-title">{post.title}</h1>
              <p className="description">{post.excerpt}</p>
            </>
          )}
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          <div className="pill-row">
            {post.tags.map((tag) => (
              <span key={tag} className="pill">
                #{tag}
              </span>
            ))}
          </div>
          <section className="comment-box" aria-label="댓글">
            <h2>댓글</h2>
            <GiscusComments term={`reviews/${post.slug}`} />
          </section>
        </article>

        <aside className="recent-sidebar" aria-label="최근 글">
          <h3>RECENT POSTS</h3>
          <div className="recent-list">
            {recentPosts.map((entry) => (
              <Link
                key={`${entry.type}-${entry.slug}`}
                className="recent-item"
                href={`${entry.type === "reviews" ? "/reviews" : "/articles"}/${entry.slug}`}
              >
                <div className="recent-item-media">
                  {entry.coverImage ? (
                    <img src={entry.coverImage} alt={entry.title} />
                  ) : (
                    <div className="recent-item-fallback">{entry.type === "reviews" ? "REVIEW" : "ARTICLE"}</div>
                  )}
                </div>
                <div className="recent-item-body">
                  <p>{entry.title}</p>
                  <span>{entry.type === "reviews" ? "REVIEW" : "ARTICLE"} · {entry.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    );
  } catch {
    notFound();
  }
}
