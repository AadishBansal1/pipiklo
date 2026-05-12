import { Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from '@pipiklo/database'

@Injectable()
export class LicensesService {
  async verify(licenseKey: string) {
    const license = await prisma.license.findUnique({
      where: { licenseKey },
      include: {
        item: { select: { id: true, title: true, thumbnailUrl: true } },
        user: { select: { id: true, name: true } },
      },
    })
    if (!license) throw new NotFoundException('License not found')
    return { valid: license.isValid, license }
  }
}
