import Link from "next/link";
import type { PostMeta } from "@/lib/content";

type PostCardProps = {
  post: PostMeta;
  basePath: "/reviews" | "/articles";
};

export default function PostCard({ post, basePath }: PostCardProps) {
  return (
    <Link className="card" href={`${basePath}/${post.slug}`}>
      {post.coverImage ? <img className="card-image" src={post.coverImage} alt={post.title} /> : null}
      <div className="meta">{post.date} · {post.category}</div>
      <h3>{post.title}</h3>
      <p className="description">{post.excerpt}</p>
      <div className="pill-row">
        {post.tags.map((tag) => (
          <span key={tag} className="pill">
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
