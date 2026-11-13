/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/webp"],
    deviceSizes: [360, 480, 640, 768, 960, 1200, 1600],
    imageSizes: [64, 96, 160, 240],
    minimumCacheTTL: 86400
  },
  async headers() {
    return [{
      source: "/_post-images/:file",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
    }];
  }
};

export default nextConfig;
