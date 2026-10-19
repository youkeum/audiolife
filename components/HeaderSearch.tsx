"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setOpen(false);
  }

  return (
    <div className="header-search" onKeyDown={(event) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    }}>
      <button
        type="button"
        ref={trigger}
        className="search-trigger"
        aria-expanded={open}
        aria-label="검색"
        aria-controls="header-search-form"
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
      </button>

      {open ? (
        <form id="header-search-form" className="search-panel" role="search" onSubmit={onSubmit}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="제품명, 브랜드, 주제 검색"
            aria-label="검색어"
            autoFocus
          />
          <button type="submit">검색</button>
        </form>
      ) : null}
    </div>
  );
}
