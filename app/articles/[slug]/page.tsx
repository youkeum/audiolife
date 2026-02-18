import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/content";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return getAllPosts("articles").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug("articles", params.slug);
    return {
      title: post.title,
      description: post.excerpt
    };
  } catch {
    return { title: "기사" };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  try {
    const post = await getPostBySlug("articles", params.slug);

    return (
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
          <form className="comment-form">
            <input type="text" name="name" placeholder="이름" />
            <textarea name="comment" rows={5} placeholder="댓글을 입력하세요." />
            <button type="button">댓글 남기기</button>
          </form>
        </section>
      </article>
    );
  } catch {
    notFound();
  }
}
