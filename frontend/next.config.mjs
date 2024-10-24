/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa";
const withPWA = withPWAInit({
  dest: "public",
  register: true,
});

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  images: {
    // Limit the maximum width and height of images
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    // Set a maximum size for images
    domains: ["example.com"],
    // Enable strict mode to enforce these limits
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/_next/image",
        headers: [
          {
            key: "X-RateLimit-Limit",
            value: "10", // Limit to 10 requests per minute
          },
          {
            key: "X-RateLimit-Remaining",
            value: "10",
          },
          {
            key: "X-RateLimit-Reset",
            value: "60",
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
