/** @type {import('next').NextConfig} */
import withPWAInit from "next-pwa";
const withPWA = withPWAInit({
  dest: "public",
  register: true,
});

export default withPWA({
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
});
