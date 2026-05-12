import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { StorageService } from './storage.service'

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presign')
  @ApiOperation({ summary: 'Get a presigned R2 upload URL' })
  getPresignedUrl(@Body() body: { fileName: string; contentType: string; folder: string }) {
    return this.storageService.getPresignedUrl(body.fileName, body.contentType, body.folder)
  }
}
