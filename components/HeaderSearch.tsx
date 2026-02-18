"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

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
    <div className="header-search">
      <button
        type="button"
        className="search-trigger"
        aria-expanded={open}
        aria-label="검색"
        onClick={() => setOpen((prev) => !prev)}
      >
        🔍
      </button>

      {open ? (
        <form className="search-panel" onSubmit={onSubmit}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search any topic..."
            autoFocus
          />
          <button type="submit">Search</button>
        </form>
      ) : null}
    </div>
  );
}
