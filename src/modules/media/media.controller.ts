import {
  BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { mkdirSync } from 'fs';
import { extname, join, resolve } from 'path';
import { randomBytes } from 'crypto';
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
const UPLOAD_ROOT = resolve(cfg.upload.dir);

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    const now = new Date();
    const dir = join(UPLOAD_ROOT, String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, '0'));
    mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '');
    const base = file.originalname
      .replace(extname(file.originalname), '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
    cb(null, `${base || 'file'}-${randomBytes(4).toString('hex')}${ext}`);
  },
});

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

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } }, folder: { type: 'string' } },
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage,
      limits: { fileSize: cfg.upload.maxMb * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (ALLOWED_MIME.some((re) => re.test(file.mimetype))) cb(null, true);
        else cb(new BadRequestException(`Tipe file ${file.mimetype} tidak diizinkan`), false);
      },
    }),
  )
  upload(@UploadedFiles() files: Express.Multer.File[], @Body('folder') folder: string, @CurrentUser() u: AuthUser) {
    return this.service.saveUploaded(files, folder, u.id);
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
