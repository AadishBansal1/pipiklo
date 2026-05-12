import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@pipiklo/database'

@Injectable()
export class UsersService {
  async findByClerkId(clerkId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, avatar: true, bio: true, website: true, role: true, createdAt: true } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async update(clerkId: string, data: { name?: string; bio?: string; website?: string; payoutInfo?: any }) {
    return prisma.user.update({ where: { clerkId }, data })
  }

  async syncFromClerk(event: any) {
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = event.data
    const email = email_addresses?.[0]?.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ') || 'Pipiklo User'

    return prisma.user.upsert({
      where: { clerkId },
      create: { clerkId, email, name, avatar: image_url, role: 'customer' },
      update: { email, name, avatar: image_url },
    })
  }
}
