import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/PostDetail";
import { getAllPosts, getPostBySlug } from "@/lib/content";

type Props = {
  params: { slug: string };
};

const SITE_URL = "https://audiolife.kr";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image?v=3`;

function toAbsoluteUrl(url?: string): string {
  if (!url) return DEFAULT_OG_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function generateStaticParams() {
  return getAllPosts("articles").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug("articles", params.slug);
    const canonicalUrl = `${SITE_URL}/articles/${post.slug}`;
    const ogImage = toAbsoluteUrl(post.coverImage);

    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags,
      alternates: {
        canonical: canonicalUrl
      },
      openGraph: {
        type: "article",
        url: canonicalUrl,
        title: post.title,
        description: post.excerpt,
        siteName: "audiolife",
        locale: "ko_KR",
        publishedTime: post.date,
        modifiedTime: post.updated ?? post.date,
        section: post.category,
        tags: post.tags,
        images: [
          {
            url: ogImage,
            alt: post.title
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: [ogImage]
      }
    };
  } catch {
    return { title: "기사" };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  try {
    const post = await getPostBySlug("articles", params.slug);
    const canonicalUrl = `${SITE_URL}/articles/${post.slug}`;
    const ogImage = toAbsoluteUrl(post.coverImage);
    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      image: [ogImage],
      articleSection: post.category,
      keywords: post.tags.join(", "),
      mainEntityOfPage: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: "audiolife",
        url: SITE_URL
      }
    };

    return <PostDetail post={post} schema={articleJsonLd} />;
  } catch {
    notFound();
  }
}
