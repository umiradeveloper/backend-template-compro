import {
  BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { memoryStorage, Options } from 'multer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ALLOWED_MIME, MediaService } from './media.service';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { AuthUser, CurrentUser } from '../../common/decorators/current-user.decorator';
import configuration from '../../config/configuration';

class MediaQueryDto extends PaginationQueryDto {
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() folder?: string;
}

class UpdateMediaDto {
  @IsOptional() @IsString() @MaxLength(255) alt?: string;
  @IsOptional() @IsString() @MaxLength(60) folder?: string;
}

const cfg = configuration();

/** file ditampung di memori lalu diteruskan ke StorageService (local / MinIO) */
const uploadOptions: Options = {
  storage: memoryStorage(),
  limits: { fileSize: cfg.upload.maxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.some((re) => re.test(file.mimetype))) cb(null, true);
    else cb(new BadRequestException(`Tipe file ${file.mimetype} tidak diizinkan`) as any, false);
  },
};

@ApiTags('Admin - Media')
@ApiBearerAuth()
@Controller('admin/media')
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @Get()
  findAll(@Query() q: MediaQueryDto) {
    return this.service.findAll(q);
  }

  @Get('folders')
  folders() {
    return this.service.folders();
  }

  @Get(':id/usage')
  usage(@Param('id', ParseIntPipe) id: number) {
    return this.service.usage(id);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } }, folder: { type: 'string' } },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 20, uploadOptions))
  upload(@UploadedFiles() files: Express.Multer.File[], @Body('folder') folder: string, @CurrentUser() u: AuthUser) {
    return this.service.saveUploaded(files, folder, u.id);
  }

  /** Ganti isi file; URL tetap sama sehingga semua halaman ikut berubah */
  @Post(':id/replace')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  replace(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
    return this.service.replace(id, file);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMediaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
