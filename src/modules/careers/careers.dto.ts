import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseContentDto, BaseTranslationDto, TranslationsField } from '../../common/content/content.dto';

export class CareerTranslationDto extends BaseTranslationDto {
  @IsOptional() @IsString() @MaxLength(255) detail?: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() content?: string;
}

export class CreateCareerDto extends BaseContentDto {
  @IsOptional() @IsDateString() publishedAt?: string;
  @IsOptional() @IsDateString() closingDate?: string;
  @IsOptional() @IsString() @MaxLength(120) department?: string;
  @IsOptional() @IsString() @MaxLength(160) location?: string;
  @IsOptional() @IsString() @MaxLength(40) employmentType?: string;
  @IsOptional() @IsString() @MaxLength(160) applyEmail?: string;
  @IsOptional() @IsString() @MaxLength(500) applyUrl?: string;
  @IsOptional() @IsString() @MaxLength(500) coverImage?: string;
  @IsOptional() @IsString() @MaxLength(500) galleryImg?: string;

  @TranslationsField(() => CareerTranslationDto)
  translations: CareerTranslationDto[];
}

export class UpdateCareerDto extends PartialType(CreateCareerDto) {}
