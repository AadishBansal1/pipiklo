import { Injectable } from '@nestjs/common'
import { prisma } from '@pipiklo/database'

@Injectable()
export class DownloadsService {
  async findByUser(userId: string) {
    return prisma.download.findMany({
      where: { userId },
      orderBy: { downloadedAt: 'desc' },
      include: { item: { include: { creator: { select: { id: true, name: true, avatar: true } } } }, license: true },
    })
  }
}
