import { Injectable } from '@nestjs/common'
import { prisma } from '@pipiklo/database'

@Injectable()
export class AdminService {
  async getStats() {
    const [totalUsers, totalItems, totalDownloads, activeSubscriptions] = await Promise.all([
      prisma.user.count(),
      prisma.item.count({ where: { status: 'approved' } }),
      prisma.download.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
    ])
    return { totalUsers, totalItems, totalDownloads, activeSubscriptions }
  }

  async getPendingItems() {
    return prisma.item.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      include: { creator: { select: { id: true, name: true, avatar: true } }, category: true },
    })
  }

  async updateItemStatus(id: string, status: string, rejectionReason?: string) {
    return prisma.item.update({ where: { id }, data: { status: status as any, rejectionReason } })
  }

  async getUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, avatar: true, isVerified: true, createdAt: true },
    })
  }
}
