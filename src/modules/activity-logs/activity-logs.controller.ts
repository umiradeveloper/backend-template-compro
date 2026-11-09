import { Controller, Delete, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ActivityLogsService } from './activity-logs.service';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { MinRole } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums';
import { IsOptional, IsString } from 'class-validator';

class LogQueryDto extends PaginationQueryDto {
  @IsOptional() @IsString() entity?: string;
  @IsOptional() @IsString() action?: string;
}

@ApiTags('Admin - Activity Logs')
@ApiBearerAuth()
@MinRole(Role.ADMIN)
@Controller('admin/activity-logs')
export class ActivityLogsController {
  constructor(private readonly logs: ActivityLogsService) {}

  @Get()
  findAll(@Query() q: LogQueryDto) {
    return this.logs.findAll(q);
  }

  @MinRole(Role.SUPERADMIN)
  @ApiQuery({ name: 'days', required: true })
  @Delete()
  clear(@Query('days', ParseIntPipe) days: number) {
    return this.logs.clearOlderThan(days);
  }
}
