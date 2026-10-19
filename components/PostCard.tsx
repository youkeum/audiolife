import Link from "next/link";
import type { PostBasePath, PostMeta } from "@/lib/content";
import PostImage from "./PostImage";
import styles from "./PostCard.module.css";

type PostCardProps = { post: PostMeta; basePath: PostBasePath };
export default function PostCard({ post, basePath }: PostCardProps) {
  return <article className={styles.card}>
    <Link href={`${basePath}/${post.slug}`}>
      {post.coverImage && <PostImage src={post.coverImage} alt={post.title} sizes="(max-width: 560px) 94vw, (max-width: 980px) 46vw, 31vw" />}
      <div className={styles.meta}><time dateTime={post.date}>{post.date}</time> · {post.category}</div>
      <h2>{post.title}</h2><p>{post.excerpt}</p>
    </Link>
    <div className={styles.tags}>{post.tags.slice(0, 3).map(tag => <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div>
  </article>;
}
