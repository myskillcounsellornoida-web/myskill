import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['[::1]', 'localhost'],
  // Sharp loads native binaries dynamically; include both the addon and libvips.
  outputFileTracingIncludes: {
    "/api/upload": ["node_modules/sharp/**/*", "node_modules/@img/sharp-*/**/*"],
  },
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
