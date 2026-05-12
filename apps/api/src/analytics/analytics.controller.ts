import { Controller, Get, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AnalyticsService } from './analytics.service'

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('dashboard')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('creator/stats')
  @ApiOperation({ summary: 'Get creator analytics and earnings' })
  getCreatorStats(@Request() req: any) {
    return this.analyticsService.getCreatorStats(req.userId)
  }
}
