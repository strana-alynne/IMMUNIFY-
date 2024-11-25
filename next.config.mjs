/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
});

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    domains: ["example.com"],
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
            value: "10",
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
      {
        source: "/notification-sw.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
