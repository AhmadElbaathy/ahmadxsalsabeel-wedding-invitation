import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-0eb17f52-f7f8-4119-86d2-15eae9d52c7f.space.z.ai",
  ],
};

export default nextConfig;
