import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './projects.dto';
import { BulkIdsDto, BulkStatusDto, ContentQueryDto } from '../../common/content/content.dto';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';

class ReorderDto {
  @IsArray() @ArrayNotEmpty() @IsInt({ each: true }) ids: number[];
}

@ApiTags('Admin - Projects')
@ApiBearerAuth()
@Controller('admin/projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Get()
  findAll(@Query() q: ContentQueryDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProjectDto, @CurrentUser() u: AuthUser) {
    return this.service.create(dto, u.id);
  }

  @Post('reorder')
  reorder(@Body() dto: ReorderDto) {
    return this.service.reorder(dto.ids);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto, @CurrentUser() u: AuthUser) {
    return this.service.update(id, dto, u.id);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id', ParseIntPipe) id: number, @CurrentUser() u: AuthUser) {
    return this.service.duplicate(id, u.id);
  }

  @Post('bulk-status')
  bulkStatus(@Body() dto: BulkStatusDto) {
    return this.service.bulkStatus(dto.ids, dto.status);
  }

  @Post('bulk-delete')
  bulkDelete(@Body() dto: BulkIdsDto) {
    return this.service.bulkRemove(dto.ids);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
