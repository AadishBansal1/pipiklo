import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsString } from 'class-validator'
import { CreateItemDto } from './create-item.dto'

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsOptional() @IsString() status?: string
  @IsOptional() @IsString() rejectionReason?: string
}
