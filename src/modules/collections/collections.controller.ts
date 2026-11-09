import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsObject, IsOptional } from 'class-validator';
import { CollectionsService } from './collections.service';
import { COLLECTION_SCHEMAS } from '../content-schemas/collections.schemas';
import { SETTING_SCHEMAS } from '../content-schemas/settings.schemas';

class CollectionItemDto {
  @IsOptional() @IsObject() data?: Record<string, unknown>;
  @IsOptional() @IsObject() translations?: Record<string, Record<string, unknown>>;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

class ReorderDto {
  @IsArray() @ArrayNotEmpty() @IsInt({ each: true }) ids: number[];
}

@ApiTags('Admin - Collections')
@ApiBearerAuth()
@Controller('admin')
export class CollectionsController {
  constructor(private readonly service: CollectionsService) {}

  @Get('schemas')
  async schemas() {
    const counts = await this.service.counts();
    return {
      collections: COLLECTION_SCHEMAS.map((s) => ({ ...s, count: counts[s.key] ?? 0 })),
      settings: SETTING_SCHEMAS,
    };
  }

  @Get('collections/:key')
  list(@Param('key') key: string) {
    return this.service.list(key);
  }

  @Get('collections/:key/:id')
  findOne(@Param('key') key: string, @Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(key, id);
  }

  @Post('collections/:key')
  create(@Param('key') key: string, @Body() dto: CollectionItemDto) {
    return this.service.create(key, dto);
  }

  @Post('collections/:key/reorder')
  reorder(@Param('key') key: string, @Body() dto: ReorderDto) {
    return this.service.reorder(key, dto.ids);
  }

  @Patch('collections/:key/:id')
  update(@Param('key') key: string, @Param('id', ParseIntPipe) id: number, @Body() dto: CollectionItemDto) {
    return this.service.update(key, id, dto);
  }

  @Delete('collections/:key/:id')
  remove(@Param('key') key: string, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(key, id);
  }
}
