import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/_mintlify/:path*",
        destination: "https://envtrap.mintlifysite.com/_mintlify/:path*",
      },
      {
        source: "/api/request",
        destination: "https://envtrap.mintlifysite.com/_mintlify/api/request",
      },
      {
        source: "/docs",
        destination: "https://envtrap.mintlifysite.com/docs",
      },
      {
        source: "/docs/:path*",
        destination: "https://envtrap.mintlifysite.com/docs/:path*",
      },
      {
        source: "/mintlify-assets/:path*",
        destination: "https://envtrap.mintlifysite.com/mintlify-assets/:path*",
      },
    ];
  },
};

export default nextConfig;
