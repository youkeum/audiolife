import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getPostBasePath, getPostTypeLabel } from "@/lib/content";

export const metadata: Metadata = {
  title: "Search",
  description: "오디오 리뷰, 기사, 컬럼 검색",
  alternates: {
    canonical: "https://audiolife.kr/search"
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams?.q ?? "").trim();
  const keyword = query.toLowerCase();

  const posts = [...getAllPosts("reviews"), ...getAllPosts("articles"), ...getAllPosts("columns")]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .filter((post) => {
      if (!keyword) return false;
      return [post.title, post.excerpt, post.category, post.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });

  return (
    <section>
      <h1 className="page-title">SEARCH</h1>
      <p className="description">검색어: {query || "(없음)"}</p>

      {!query ? <p className="description">상단 검색창에서 키워드를 입력해 주세요.</p> : null}

      <div className="search-results">
        {posts.map((post) => (
          <Link
            key={`${post.type}-${post.slug}`}
            className="search-item"
            href={`${getPostBasePath(post.type)}/${post.slug}`}
          >
            {post.coverImage ? <img src={post.coverImage} alt={post.title} /> : <div className="search-thumb-empty" />}
            <div>
              <p className="meta">{getPostTypeLabel(post.type)} · {post.date}</p>
              <h3>{post.title}</h3>
              <p className="description">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      {query && posts.length === 0 ? <p className="description">검색 결과가 없습니다.</p> : null}
    </section>
  );
}
