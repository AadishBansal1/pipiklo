import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { SearchService } from './search.service'

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search items via Typesense' })
  search(
    @Query('q') q: string,
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '24',
    @Query('sortBy') sortBy = 'downloads'
  ) {
    return this.searchService.search(q, { category, subcategory, page: +page, limit: +limit, sortBy })
  }
}
