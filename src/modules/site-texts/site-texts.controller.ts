import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsIn, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SiteTextsService, COLLECTION_DRIVEN_KEYS } from './site-texts.service';
import { LOCALES, Role } from '../../common/enums';
import { MinRole } from '../../common/decorators/roles.decorator';

class SiteTextRowDto {
  @IsString() key: string;
  @IsObject() values: Record<string, string>;
}

class BulkSiteTextDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => SiteTextRowDto) rows: SiteTextRowDto[];
}

class DeleteKeysDto {
  @IsArray() @ArrayNotEmpty() @IsString({ each: true }) keys: string[];
}

class ImportDto {
  @IsIn([...LOCALES]) locale: string;
  @IsObject() messages: Record<string, unknown>;
  @IsOptional() @IsBoolean() overwrite?: boolean;
}

@ApiTags('Admin - Site Texts')
@ApiBearerAuth()
@Controller('admin/site-texts')
export class SiteTextsController {
  constructor(private readonly service: SiteTextsService) {}

  @Get()
  async list(@Query('search') search?: string) {
    return { ...(await this.service.list(search)), collectionDrivenKeys: COLLECTION_DRIVEN_KEYS };
  }

  @Put()
  bulk(@Body() dto: BulkSiteTextDto) {
    return this.service.bulkUpsert(dto.rows);
  }

  @Post('delete')
  remove(@Body() dto: DeleteKeysDto) {
    return this.service.removeKeys(dto.keys);
  }

  @MinRole(Role.ADMIN)
  @Post('import')
  import(@Body() dto: ImportDto) {
    return this.service.importMessages(dto.locale, dto.messages, dto.overwrite);
  }

  @Get('export/:locale')
  export(@Param('locale') locale: string) {
    return this.service.messages(locale);
  }
}
