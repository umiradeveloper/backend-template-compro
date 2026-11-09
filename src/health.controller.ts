import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { Public } from './common/decorators/public.decorator';
import { StorageService } from './modules/storage/storage.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly ds: DataSource, private readonly storage: StorageService) {}

  @Public()
  @Get()
  async check() {
    let db = 'up';
    try {
      await this.ds.query('SELECT 1');
    } catch {
      db = 'down';
    }
    return { status: 'ok', db, storage: { driver: this.storage.driver, status: await this.storage.health() }, time: new Date().toISOString() };
  }
}
