import { Injectable } from '@nestjs/common'
import { prisma } from '@pipiklo/database'

@Injectable()
export class SearchService {
  async search(
    q: string,
    opts: { category?: string; subcategory?: string; page?: number; limit?: number; sortBy?: string }
  ) {
    const { category, subcategory, page = 1, limit = 24, sortBy = 'downloads' } = opts
    const skip = (page - 1) * limit

    const where: any = { status: 'approved' }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { subcategory: { contains: q, mode: 'insensitive' } },
        { tags: { has: q.toLowerCase() } },
      ]
    }

    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category } })
      if (cat) where.categoryId = cat.id
    }
    if (subcategory) where.subcategory = subcategory

    const orderBy: any = {}
    if (sortBy === 'downloads') orderBy.downloads = 'desc'
    else if (sortBy === 'rating') orderBy.rating = 'desc'
    else if (sortBy === 'newest') orderBy.createdAt = 'desc'

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { creator: { select: { id: true, name: true, avatar: true } }, category: true },
      }),
      prisma.item.count({ where }),
    ])

    return { items, total, page, totalPages: Math.ceil(total / limit) }
  }
}
