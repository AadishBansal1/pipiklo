import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Serve images in WebP/AVIF for ~30% smaller file sizes
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'api.dicebear.com', pathname: '/**' },
      { protocol: 'https', hostname: 'r2.pipiklo.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  serverExternalPackages: [],
  // Compress responses
  compress: true,
  // Power of HTTP/2 keep-alive
  httpAgentOptions: { keepAlive: true },
  // Reduce logging noise during dev
  logging: {
    fetches: { fullUrl: false },
  },
}

export default nextConfig
