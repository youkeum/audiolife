import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://audiolife.kr";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    }
  ];

  const reviewRoutes: MetadataRoute.Sitemap = getAllPosts("reviews").map((post) => ({
    url: `${baseUrl}/reviews/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  const articleRoutes: MetadataRoute.Sitemap = getAllPosts("articles").map((post) => ({
    url: `${baseUrl}/articles/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8
  }));

  return [...staticRoutes, ...reviewRoutes, ...articleRoutes];
}
