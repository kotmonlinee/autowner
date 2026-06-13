import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      {
        // /repair-cost/toyota/camry/brake-pads → /repair-cost/brake-pads-toyota-camry
        source: "/repair-cost/:make/:model/:repair",
        destination: "/repair-cost/:repair-:make-:model",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
