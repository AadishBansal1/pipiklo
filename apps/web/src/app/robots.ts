import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin-login', '/api/'],
      },
    ],
    sitemap: 'https://pipiklo-web.vercel.app/sitemap.xml',
    host: 'https://pipiklo-web.vercel.app',
  }
}
