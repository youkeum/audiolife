import PostCard from "@/components/PostCard";
import { getAllCategories, getPostsByCategory } from "@/lib/content";

type Props = {
  params: { category: string };
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export default function CategoryPage({ params }: Props) {
  const posts = getPostsByCategory(params.category);

  return (
    <>
      <h1 className="page-title">카테고리: {params.category}</h1>
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
