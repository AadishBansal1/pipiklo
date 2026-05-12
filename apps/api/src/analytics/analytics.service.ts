import { Injectable } from '@nestjs/common'
import { prisma } from '@pipiklo/database'

@Injectable()
export class AnalyticsService {
  async getCreatorStats(creatorId: string) {
    const [totalItems, earnings] = await Promise.all([
      prisma.item.count({ where: { creatorId } }),
      prisma.creatorEarning.findMany({ where: { creatorId }, include: { item: { select: { id: true, title: true } } } }),
    ])

    const totalDownloads = earnings.reduce((sum, e) => sum + e.downloadCount, 0)
    const totalEarnings = earnings.reduce((sum, e) => sum + e.totalEarned, 0)
    const pendingPayout = earnings.reduce((sum, e) => sum + e.pendingPayout, 0)

    return { totalItems, totalDownloads, totalEarnings, pendingPayout, earnings }
  }
}
