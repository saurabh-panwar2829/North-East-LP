import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: () => [{ source: "/", destination: "/north-east", permanent: false }],
  poweredByHeader: false,
  devIndicators: false,
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 85] },
};

export default nextConfig;
