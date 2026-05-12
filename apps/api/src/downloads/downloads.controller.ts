import { Controller, Get, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { DownloadsService } from './downloads.service'

@ApiTags('downloads')
@Controller('dashboard/customer')
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}

  @Get('downloads')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get customer download history' })
  getDownloads(@Request() req: any) {
    return this.downloadsService.findByUser(req.userId)
  }
}
