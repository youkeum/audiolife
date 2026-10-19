import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "./PostCard";
import { getAllPosts, getPostBasePath, type PostType, type PostMeta } from "@/lib/content";
import { ARCHIVES, archiveHref, archiveState, type ArchiveQuery } from "@/lib/archive";
import { createItemListJsonLd } from "@/lib/seo";
import styles from "./PostArchive.module.css";

type Collection = { posts: PostMeta[]; path: string; title: string; description: string };
export default function PostArchive({ type = "articles", query, collection }: { type?: PostType; query: ArchiveQuery; collection?: Collection }) {
  const allPosts = collection?.posts ?? getAllPosts(type);
  const state = archiveState(allPosts, query);
  if (state.page > state.pages) notFound();
  const path = collection?.path ?? getPostBasePath(type);
  const heading = collection ?? ARCHIVES[type];
  const categories = [...new Set(allPosts.map(post => post.category))].sort();
  const schema = createItemListJsonLd({ name: heading.title, path: archiveHref(path, state), posts: state.posts });
  return <section className={styles.archive}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <header><p className={styles.eyebrow}>{collection ? "EXPLORE AUDIOLIFE" : type.toUpperCase()}</p><h1>{heading.title}</h1><p className="description">{heading.description}</p></header>
    <form key={`${state.q}-${state.category}`} action={path} className={styles.filters}>
      <label>검색<input type="search" name="q" defaultValue={state.q} placeholder="제품명, 브랜드, 주제" maxLength={200} /></label>
      <label>카테고리<select name="category" defaultValue={state.category}><option value="">전체 카테고리</option>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
      <button type="submit">적용</button><Link href={path}>초기화</Link>
    </form>
    <p className={styles.count}>{state.total}개의 글 · {state.page} / {state.pages} 페이지</p>
    <div className={styles.grid}>{state.posts.map(post => <PostCard key={`${post.type}-${post.slug}`} post={post} basePath={getPostBasePath(post.type)} />)}</div>
    {!state.total && <p className={styles.empty}>일치하는 글이 없습니다. 검색어나 카테고리를 바꿔 보세요.</p>}
    {state.pages > 1 && <nav className={styles.pagination} aria-label="목록 페이지">
      {state.page > 1 && <Link rel="prev" href={archiveHref(path, { ...state, page: state.page - 1 })}>이전</Link>}
      {Array.from({ length: state.pages }, (_, i) => i + 1).map(page => <Link key={page} aria-label={`${page}페이지`} aria-current={page === state.page ? "page" : undefined} href={archiveHref(path, { ...state, page })}>{page}</Link>)}
      {state.page < state.pages && <Link rel="next" href={archiveHref(path, { ...state, page: state.page + 1 })}>다음</Link>}
    </nav>}
  </section>;
}
