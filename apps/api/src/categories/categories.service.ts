import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@pipiklo/database'

@Injectable()
export class CategoriesService {
  async findAll() {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: { children: true },
      orderBy: { name: 'asc' },
    })
    return categories
  }

  async findOne(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { children: true, parent: true },
    })
    if (!category) throw new NotFoundException('Category not found')
    return category
  }

  async findItems(slug: string) {
    const category = await prisma.category.findUnique({ where: { slug } })
    if (!category) throw new NotFoundException('Category not found')

    return prisma.item.findMany({
      where: { categoryId: category.id, status: 'approved' },
      take: 24,
      orderBy: { downloads: 'desc' },
      include: { creator: { select: { id: true, name: true, avatar: true } } },
    })
  }
}
