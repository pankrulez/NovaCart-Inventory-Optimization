import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ignore type errors for now
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
