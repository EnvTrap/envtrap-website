import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/docs",
        destination: "https://envtrap.mintlify.app/introduction",
      },
      {
        source: "/docs/:path*",
        destination: "https://envtrap.mintlify.app/:path*",
      },
      {
        source: "/_mintlify/:path*",
        destination: "https://envtrap.mintlify.app/_mintlify/:path*",
      },
      {
        source: "/mintlify-assets/:path*",
        destination: "https://envtrap.mintlify.app/mintlify-assets/:path*",
      },
    ];
  },
};

export default nextConfig;
