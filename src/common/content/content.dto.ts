import { Type } from 'class-transformer';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { ContentStatus, LOCALES } from '../enums';
import { PaginationQueryDto } from '../dto/pagination.dto';

export class BaseTranslationDto {
  @IsIn([...LOCALES])
  locale: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  metaTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescription?: string;
}

export class ContentQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @IsOptional()
  @IsIn([...LOCALES])
  locale?: string;
}

export class BulkIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}

export class BulkStatusDto extends BulkIdsDto {
  @IsEnum(ContentStatus)
  status: ContentStatus;
}

export class BaseContentDto {
  @IsOptional()
  @IsString()
  @MaxLength(180)
  slug?: string;

  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

/** helper agar setiap DTO turunan bisa mendefinisikan tipe terjemahannya sendiri */
export function TranslationsField(type: () => any) {
  return function (target: object, key: string) {
    IsArray()(target, key);
    ArrayMinSize(1)(target, key);
    ValidateNested({ each: true })(target, key);
    Type(type)(target, key);
  };
}
