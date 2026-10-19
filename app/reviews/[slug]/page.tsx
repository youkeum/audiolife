import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/PostDetail";
import { getAllPosts, getPostBySlug } from "@/lib/content";

type Props = {
  params: { slug: string };
};

const SITE_URL = "https://audiolife.kr";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;

function toAbsoluteUrl(url?: string): string {
  if (!url) return DEFAULT_OG_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function generateStaticParams() {
  return getAllPosts("reviews").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug("reviews", params.slug);
    const canonicalUrl = `${SITE_URL}/reviews/${post.slug}`;
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
        siteName: "AudioLife",
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
    return { title: "리뷰" };
  }
}

export default async function ReviewDetailPage({ params }: Props) {
  try {
    const post = await getPostBySlug("reviews", params.slug);
    const canonicalUrl = `${SITE_URL}/reviews/${post.slug}`;
    const ogImage = toAbsoluteUrl(post.coverImage);
    const itemType = post.reviewItemType === "Place" ? "LocalBusiness" : "Product";
    const itemName = post.reviewItemName?.trim() || post.title;
    const reviewCore = {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "YK"
      },
      name: post.title,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      reviewBody: post.excerpt
    };

    const reviewJsonLd =
      itemType === "Product"
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: itemName,
            description: post.excerpt,
            image: [ogImage],
            review: reviewCore,
            mainEntityOfPage: canonicalUrl
          }
        : {
            "@context": "https://schema.org",
            "@type": "Review",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
            image: [ogImage],
            reviewBody: post.excerpt,
            author: {
              "@type": "Person",
              name: "YK"
            },
            itemReviewed: {
              "@type": "LocalBusiness",
              name: itemName
            },
            keywords: post.tags.join(", "),
            mainEntityOfPage: canonicalUrl,
            publisher: {
              "@type": "Organization",
              name: "AudioLife",
              url: SITE_URL
            }
          };

    return <PostDetail post={post} schema={reviewJsonLd} />;
  } catch {
    notFound();
  }
}
