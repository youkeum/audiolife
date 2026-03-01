import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getAllTags, getPostBasePath, getPostsByTag } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

type Props = {
  params: { tag: string };
};

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const encodedTag = encodeURIComponent(params.tag);
  const canonicalUrl = `${SITE_URL}/tags/${encodedTag}`;
  const posts = getPostsByTag(params.tag);

  return {
    title: `#${params.tag} 태그`,
    description: `'#${params.tag}' 태그 글 ${posts.length}개`,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: `#${params.tag} 태그 | AudioLife`,
      description: `'#${params.tag}' 관련 오디오 글 모음`,
      siteName: "AudioLife",
      locale: "ko_KR"
    }
  };
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
            basePath={getPostBasePath(post.type)}
          />
        ))}
      </section>
    </>
  );
}
