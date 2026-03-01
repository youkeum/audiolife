import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getAllCategories, getPostBasePath, getPostsByCategory } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

type Props = {
  params: { category: string };
};

export async function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const encodedCategory = encodeURIComponent(params.category);
  const canonicalUrl = `${SITE_URL}/categories/${encodedCategory}`;
  const posts = getPostsByCategory(params.category);

  return {
    title: `${params.category} 카테고리`,
    description: `'${params.category}' 관련 오디오 글 ${posts.length}개`,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `${params.category} 카테고리 | AudioLife`,
      description: `'${params.category}' 관련 오디오 글 모음`,
      siteName: "AudioLife",
      locale: "ko_KR"
    }
  };
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
            basePath={getPostBasePath(post.type)}
          />
        ))}
      </section>
    </>
  );
}
