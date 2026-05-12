import { IsString, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateItemDto {
  @ApiProperty() @IsString() title: string
  @ApiProperty() @IsString() description: string
  @ApiProperty() @IsString() categorySlug: string
  @ApiProperty() @IsString() subcategory: string
  @ApiProperty({ type: [String] }) @IsArray() tags: string[]
  @ApiProperty() @IsString() thumbnailUrl: string
  @ApiProperty({ type: [String] }) @IsArray() previewUrls: string[]
  @ApiProperty({ required: false }) @IsOptional() @IsString() fileUrl?: string
  @ApiProperty({ required: false }) @IsOptional() @IsString() fileSize?: string
  @ApiProperty({ required: false }) @IsOptional() @IsString() fileFormat?: string
  @ApiProperty({ type: [String], required: false }) @IsOptional() @IsArray() compatibleTools?: string[]
}
