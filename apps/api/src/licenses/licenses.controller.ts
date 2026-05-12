import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { LicensesService } from './licenses.service'

@ApiTags('licenses')
@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Get('verify/:key')
  @ApiOperation({ summary: 'Verify a license key' })
  verify(@Param('key') key: string) {
    return this.licensesService.verify(key)
  }
}
