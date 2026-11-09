import { Body, Controller, Delete, Get, Header, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsInt } from 'class-validator';
import { InquiriesService } from './inquiries.service';
import { InquiryQueryDto, UpdateInquiryDto } from './inquiries.dto';
import { InquiryStatus } from '../../common/enums';
import { SkipAudit } from '../../common/decorators/skip-audit.decorator';

class BulkInquiryDto {
  @IsArray() @ArrayNotEmpty() @IsInt({ each: true }) ids: number[];
}
class BulkInquiryStatusDto extends BulkInquiryDto {
  @IsEnum(InquiryStatus) status: InquiryStatus;
}

@ApiTags('Admin - Inquiries (Pesan Masuk)')
@ApiBearerAuth()
@Controller('admin/inquiries')
export class InquiriesController {
  constructor(private readonly service: InquiriesService) {}

  @Get()
  findAll(@Query() q: InquiryQueryDto) {
    return this.service.findAll(q);
  }

  @Get('counts')
  counts() {
    return this.service.counts();
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="pesan-masuk.csv"')
  export(@Query() q: InquiryQueryDto) {
    return this.service.exportCsv(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id, true);
  }

  @SkipAudit()
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInquiryDto) {
    return this.service.update(id, dto);
  }

  @Post('bulk-status')
  bulkStatus(@Body() dto: BulkInquiryStatusDto) {
    return this.service.bulkStatus(dto.ids, dto.status);
  }

  @Post('bulk-delete')
  bulkDelete(@Body() dto: BulkInquiryDto) {
    return this.service.bulkRemove(dto.ids);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
