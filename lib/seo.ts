import { getPostBasePath, type PostMeta } from "@/lib/content";

import { SITE_DESCRIPTION } from "./site";

export const SITE_URL = "https://audiolife.kr";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;

type ItemListOptions = {
  name: string;
  description?: string;
  path: string;
  posts: PostMeta[];
};

export function toAbsoluteUrl(url?: string): string {
  if (!url) return DEFAULT_OG_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export function createWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AudioLife",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "ko-KR",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AudioLife",
    description: "오디오 리뷰, 기사, 컬럼 콘텐츠를 발행하는 한국어 오디오 웹매거진",
    url: SITE_URL,
    logo: `${SITE_URL}/logo?v=2`
  };
}

export function createItemListJsonLd({ name, description, path, posts }: ItemListOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url: `${SITE_URL}${path}`,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${getPostBasePath(post.type)}/${post.slug}`,
      name: post.title
    }))
  };
}
