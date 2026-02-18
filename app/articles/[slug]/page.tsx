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
        {post.coverImage ? <img className="post-cover" src={post.coverImage} alt={post.title} /> : null}
        <div className="meta">{post.date} · {post.category}</div>
        <h1 className="page-title">{post.title}</h1>
        <p className="description">{post.excerpt}</p>
        <div className="pill-row">
          {post.tags.map((tag) => (
            <span key={tag} className="pill">
              #{tag}
            </span>
          ))}
        </div>
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    );
  } catch {
    notFound();
  }
}
