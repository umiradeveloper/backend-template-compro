import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './blogs.dto';
import { BulkIdsDto, BulkStatusDto, ContentQueryDto } from '../../common/content/content.dto';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Admin - Blogs')
@ApiBearerAuth()
@Controller('admin/blogs')
export class BlogsController {
  constructor(private readonly service: BlogsService) {}

  @Get()
  findAll(@Query() q: ContentQueryDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBlogDto, @CurrentUser() u: AuthUser) {
    return this.service.create(dto, u.id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBlogDto, @CurrentUser() u: AuthUser) {
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
