import PostCard from "@/components/PostCard";
import { getAllTags, getPostsByTag } from "@/lib/content";

type Props = {
  params: { tag: string };
};

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export default function TagPage({ params }: Props) {
  const posts = getPostsByTag(params.tag);

  return (
    <>
      <h1 className="page-title">태그: #{params.tag}</h1>
      <section className="grid">
        {posts.map((post) => (
          <PostCard
            key={`${post.type}-${post.slug}`}
            post={post}
            basePath={post.type === "reviews" ? "/reviews" : "/articles"}
          />
        ))}
      </section>
    </>
  );
}
