import { PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseContentDto, BaseTranslationDto, TranslationsField } from '../../common/content/content.dto';

export class ProjectTranslationDto extends BaseTranslationDto {
  @IsOptional() @IsString() @MaxLength(160) industry?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) scopeOfWork?: string[];
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() content?: string;
}

export class CreateProjectDto extends BaseContentDto {
  @IsOptional() @IsString() @MaxLength(500) coverImage?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) gallery?: string[];
  @IsOptional() @IsString() @MaxLength(120) area?: string;
  @IsOptional() @IsString() @MaxLength(255) website?: string;
  @IsOptional() @IsString() @MaxLength(160) location?: string;
  @IsOptional() @IsString() @MaxLength(160) client?: string;
  @IsOptional() @IsString() @MaxLength(20) year?: string;
  @IsOptional() @IsString() @MaxLength(40) projectStatus?: string;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;

  @TranslationsField(() => ProjectTranslationDto)
  translations: ProjectTranslationDto[];
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
