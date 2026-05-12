import { Controller, Get, Put, Body, Request, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@Request() req: any) { return this.usersService.findByClerkId(req.userId) }

  @Put('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@Body() body: any, @Request() req: any) { return this.usersService.update(req.userId, body) }

  @Get(':id')
  @ApiOperation({ summary: 'Get user public profile' })
  findOne(@Param('id') id: string) { return this.usersService.findById(id) }
}
