import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/_mintlify/:path*",
        destination: "https://envtrap-fffa9110.mintlify.site/_mintlify/:path*",
      },
      {
        source: "/api/request",
        destination: "https://envtrap-fffa9110.mintlify.site/_mintlify/api/request",
      },
      {
        source: "/docs",
        destination: "https://envtrap-fffa9110.mintlify.site/docs",
      },
      {
        source: "/docs/:path*",
        destination: "https://envtrap-fffa9110.mintlify.site/docs/:path*",
      },
      {
        source: "/mintlify-assets/:path*",
        destination: "https://envtrap-fffa9110.mintlify.site/mintlify-assets/:path*",
      },
    ];
  },
};

export default nextConfig;
