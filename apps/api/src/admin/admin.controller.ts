import { Controller, Get, Put, Param, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AdminService } from './admin.service'

@ApiTags('admin')
@ApiBearerAuth()
@Controller('dashboard/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get platform overview stats' })
  getStats() { return this.adminService.getStats() }

  @Get('items/pending')
  @ApiOperation({ summary: 'Get pending content review queue' })
  getPendingItems() { return this.adminService.getPendingItems() }

  @Put('items/:id/approve')
  @ApiOperation({ summary: 'Approve item' })
  approveItem(@Param('id') id: string) { return this.adminService.updateItemStatus(id, 'approved') }

  @Put('items/:id/reject')
  @ApiOperation({ summary: 'Reject item' })
  rejectItem(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adminService.updateItemStatus(id, 'rejected', body.reason)
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  getUsers() { return this.adminService.getUsers() }
}
