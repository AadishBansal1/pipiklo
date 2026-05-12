import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CategoriesService } from './categories.service'

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get full category tree' })
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug)
  }

  @Get(':slug/items')
  @ApiOperation({ summary: 'Get items by category slug' })
  findItems(@Param('slug') slug: string) {
    return this.categoriesService.findItems(slug)
  }
}
