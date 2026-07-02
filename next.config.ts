import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // Disabled temporarily: standalone builds on Windows currently fail due to colons in node module trace files (e.g., node:buffer)
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
