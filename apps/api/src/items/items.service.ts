import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { prisma } from '@pipiklo/database'
import { v4 as uuid } from 'uuid'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { ItemsQueryDto } from './dto/items-query.dto'

@Injectable()
export class ItemsService {
  async findAll(query: ItemsQueryDto) {
    const { category, subcategory, isFree, sortBy = 'downloads', page = 1, limit = 24 } = query
    const skip = (page - 1) * limit

    const where: any = { status: 'approved' }
    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category } })
      if (cat) where.categoryId = cat.id
    }
    if (subcategory) where.subcategory = subcategory
    if (isFree !== undefined) where.isFree = isFree

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

    return { data: items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async findOne(id: string) {
    const item = await prisma.item.findUnique({
      where: { id },
      include: { creator: { select: { id: true, name: true, avatar: true, bio: true } }, category: true },
    })
    if (!item) throw new NotFoundException('Item not found')

    await prisma.item.update({ where: { id }, data: { views: { increment: 1 } } })
    return item
  }

  async findSimilar(id: string) {
    const item = await prisma.item.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('Item not found')

    return prisma.item.findMany({
      where: { categoryId: item.categoryId, id: { not: id }, status: 'approved' },
      take: 8,
      orderBy: { downloads: 'desc' },
      include: { creator: { select: { id: true, name: true, avatar: true } } },
    })
  }

  async create(dto: CreateItemDto, creatorId: string) {
    const category = await prisma.category.findUnique({ where: { slug: dto.categorySlug } })
    if (!category) throw new NotFoundException('Category not found')

    return prisma.item.create({
      data: {
        title: dto.title,
        description: dto.description,
        categoryId: category.id,
        subcategory: dto.subcategory,
        tags: dto.tags,
        thumbnailUrl: dto.thumbnailUrl,
        previewUrls: dto.previewUrls,
        fileUrl: dto.fileUrl,
        fileSize: dto.fileSize,
        fileFormat: dto.fileFormat,
        isFree: true,
        creatorId,
        status: 'pending',
        compatibleTools: dto.compatibleTools ?? [],
      },
    })
  }

  async update(id: string, dto: UpdateItemDto, userId: string) {
    const item = await prisma.item.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('Item not found')

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (item.creatorId !== userId && user?.role !== 'admin') throw new ForbiddenException()

    return prisma.item.update({ where: { id }, data: { ...dto } })
  }

  async remove(id: string, userId: string) {
    const item = await prisma.item.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('Item not found')

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (item.creatorId !== userId && user?.role !== 'admin') throw new ForbiddenException()

    return prisma.item.delete({ where: { id } })
  }

  async download(itemId: string, userId: string, projectName = 'My Project') {
    const item = await prisma.item.findUnique({ where: { id: itemId } })
    if (!item) throw new NotFoundException('Item not found')

    const licenseKey = `PIL-${uuid().toUpperCase().replace(/-/g, '').slice(0, 16)}`

    const download = await prisma.download.create({
      data: { userId, itemId, licenseKey, projectName },
    })

    await prisma.license.create({
      data: {
        userId,
        itemId,
        downloadId: download.id,
        licenseKey,
        projectName,
        certificateUrl: `${process.env.R2_PUBLIC_URL}/certificates/${licenseKey}.pdf`,
        isValid: true,
      },
    })

    await prisma.item.update({ where: { id: itemId }, data: { downloads: { increment: 1 } } })

    return { download, licenseKey, certificateUrl: `${process.env.R2_PUBLIC_URL}/certificates/${licenseKey}.pdf` }
  }
}
