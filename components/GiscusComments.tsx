"use client";

import { useEffect, useRef } from "react";

type GiscusCommentsProps = {
  term: string;
};

export default function GiscusComments({ term }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  const isConfigured = Boolean(repo && repoId && category && categoryId);
  const missingKeys = [
    !repo ? "NEXT_PUBLIC_GISCUS_REPO" : null,
    !repoId ? "NEXT_PUBLIC_GISCUS_REPO_ID" : null,
    !category ? "NEXT_PUBLIC_GISCUS_CATEGORY" : null,
    !categoryId ? "NEXT_PUBLIC_GISCUS_CATEGORY_ID" : null
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (!isConfigured || !containerRef.current) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", repo as string);
    script.setAttribute("data-repo-id", repoId as string);
    script.setAttribute("data-category", category as string);
    script.setAttribute("data-category-id", categoryId as string);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", term);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "dark_dimmed");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);
  }, [category, categoryId, isConfigured, repo, repoId, term]);

  if (!isConfigured) {
    return (
      <div className="giscus-placeholder">
        Giscus 설정이 필요합니다. 누락 키: {missingKeys.join(", ")}
      </div>
    );
  }

  return <div ref={containerRef} />;
}
