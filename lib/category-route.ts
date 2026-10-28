import type { ArchiveQuery } from "./archive";

export function canonicalCategory(category: string, categories: string[]): string | undefined {
  return categories.find(entry => entry.toLowerCase() === category.toLowerCase());
}

export function categoryPath(category: string): string {
  return `/categories/${encodeURIComponent(category)}`;
}

// Preserve every query value when changing only the category path casing.
export function categoryRedirectHref(category: string, query: ArchiveQuery): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) {
      search.append(key, item);
    }
  }
  return `${categoryPath(category)}${search.size ? `?${search}` : ""}`;
}
