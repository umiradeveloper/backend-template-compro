import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseContentDto, BaseTranslationDto, TranslationsField } from '../../common/content/content.dto';

export class BlogTranslationDto extends BaseTranslationDto {
  @IsOptional() @IsString() @MaxLength(255) detail?: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() content?: string;
}

export class CreateBlogDto extends BaseContentDto {
  @IsOptional() @IsDateString() publishedAt?: string;
  @IsOptional() @IsString() @MaxLength(500) coverImage?: string;
  @IsOptional() @IsString() @MaxLength(500) galleryImg?: string;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsString() @MaxLength(300) tags?: string;

  @TranslationsField(() => BlogTranslationDto)
  translations: BlogTranslationDto[];
}

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
