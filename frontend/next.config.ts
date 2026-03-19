const nextConfig = {
  eslint: {
    // This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Similarly, ignore type errors for now
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
