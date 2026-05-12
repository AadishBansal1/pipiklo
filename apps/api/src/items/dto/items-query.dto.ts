import { IsOptional, IsString, IsBoolean, IsNumber, IsEnum } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class ItemsQueryDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() category?: string
  @ApiProperty({ required: false }) @IsOptional() @IsString() subcategory?: string
  @ApiProperty({ required: false }) @IsOptional() @Transform(({ value }) => value === 'true') @IsBoolean() isFree?: boolean
  @ApiProperty({ required: false, enum: ['downloads', 'rating', 'newest', 'relevance'] }) @IsOptional() @IsString() sortBy?: string
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() page?: number
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() limit?: number
  @ApiProperty({ required: false }) @IsOptional() @Type(() => Number) @IsNumber() minRating?: number
}
