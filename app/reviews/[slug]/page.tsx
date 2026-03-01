import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MemberComments from "@/components/MemberComments";
import { getAllPosts, getPostBasePath, getPostBySlug, getPostTypeLabel } from "@/lib/content";

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
        modifiedTime: post.date,
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
    const itemType = post.reviewItemType === "Place" ? "Place" : "Product";
    const itemName = post.reviewItemName?.trim() || post.title;
    const reviewCore = {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "YK"
      },
      name: post.title,
      datePublished: post.date,
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
            dateModified: post.date,
            image: [ogImage],
            reviewBody: post.excerpt,
            author: {
              "@type": "Person",
              name: "YK"
            },
            itemReviewed: {
              "@type": "Place",
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

    const recentPosts = [...getAllPosts("reviews"), ...getAllPosts("articles"), ...getAllPosts("columns")]
      .filter((entry) => !(entry.type === "reviews" && entry.slug === params.slug))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, 6);

    return (
      <div className="detail-layout">
        <article className="article">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }} />
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
            <MemberComments postType="reviews" postSlug={post.slug} />
          </section>
        </article>

        <aside className="recent-sidebar" aria-label="최근 글">
          <h3>RECENT POSTS</h3>
          <div className="recent-list">
            {recentPosts.map((entry) => (
              <Link
                key={`${entry.type}-${entry.slug}`}
                className="recent-item"
                href={`${getPostBasePath(entry.type)}/${entry.slug}`}
              >
                <div className="recent-item-media">
                  {entry.coverImage ? (
                    <img src={entry.coverImage} alt={entry.title} />
                  ) : (
                    <div className="recent-item-fallback">{getPostTypeLabel(entry.type)}</div>
                  )}
                </div>
                <div className="recent-item-body">
                  <p>{entry.title}</p>
                  <span>{getPostTypeLabel(entry.type)} · {entry.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    );
  } catch {
    notFound();
  }
}
