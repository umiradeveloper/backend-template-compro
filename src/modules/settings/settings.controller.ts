import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import { SettingsService } from './settings.service';
import { MinRole } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums';

class SettingDto {
  @IsOptional() @IsObject() data?: Record<string, unknown>;
  @IsOptional() @IsObject() translations?: Record<string, Record<string, unknown>>;
}

@ApiTags('Admin - Settings')
@ApiBearerAuth()
@Controller('admin/settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':key')
  get(@Param('key') key: string) {
    return this.service.get(key);
  }

  @MinRole(Role.ADMIN)
  @Put(':key')
  update(@Param('key') key: string, @Body() dto: SettingDto) {
    return this.service.upsert(key, dto);
  }
}
