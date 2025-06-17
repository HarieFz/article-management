import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.sellerpintar.com",
        port: "",
        pathname: "/articles/articles/**",
        search: "",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
