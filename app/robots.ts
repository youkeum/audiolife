import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ms-briefing-7f3a", "/ms-policy-31x9"]
      }
    ],
    sitemap: "https://audiolife.kr/sitemap.xml",
    host: "https://audiolife.kr"
  };
}
