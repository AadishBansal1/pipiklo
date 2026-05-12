import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ItemsService } from './items.service'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { ItemsQueryDto } from './dto/items-query.dto'

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'List items with filters and pagination' })
  findAll(@Query() query: ItemsQueryDto) {
    return this.itemsService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id)
  }

  @Get(':id/similar')
  @ApiOperation({ summary: 'Get similar items' })
  findSimilar(@Param('id') id: string) {
    return this.itemsService.findSimilar(id)
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new item (creator)' })
  create(@Body() dto: CreateItemDto, @Request() req: any) {
    return this.itemsService.create(dto, req.userId)
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update item (creator/admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateItemDto, @Request() req: any) {
    return this.itemsService.update(id, dto, req.userId)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete item (creator/admin)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.itemsService.remove(id, req.userId)
  }

  @Post(':id/download')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download item and generate license' })
  download(@Param('id') id: string, @Body() body: { projectName?: string }, @Request() req: any) {
    return this.itemsService.download(id, req.userId, body.projectName)
  }
}
