import type { MetadataRoute } from 'next'
import { CATEGORY_GROUPS } from '@/lib/categories'

const BASE_URL = 'https://pipiklo-web.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,              lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/license`, lastModified: now, changeFrequency: 'yearly',  priority: 0.5 },
    { url: `${BASE_URL}/search`,  lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_GROUPS.map((g) => ({
    url: `${BASE_URL}/${g.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  const subcategoryRoutes: MetadataRoute.Sitemap = CATEGORY_GROUPS.flatMap((g) =>
    g.subcategories.map((sub) => ({
      url: `${BASE_URL}/${g.slug}?subcategory=${encodeURIComponent(sub.slug)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  )

  return [...staticRoutes, ...categoryRoutes, ...subcategoryRoutes]
}
