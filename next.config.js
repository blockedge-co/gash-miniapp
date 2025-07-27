/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // MiniApp specific configurations
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://worldcoin.org https://*.worldcoin.org",
          },
        ],
      },
    ];
  },
  // Enable standalone output for deployment
  output: "standalone",
  // Optimize for mobile
  images: {
    formats: ["image/webp", "image/avif"],
  },
};

module.exports = nextConfig;
