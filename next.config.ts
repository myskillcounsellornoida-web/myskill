import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['[::1]', 'localhost'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
