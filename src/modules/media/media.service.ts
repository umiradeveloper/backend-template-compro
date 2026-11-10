import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { Media } from './media.entity';
import { uploadUrl } from '../../common/utils/asset-url';
import { paginated, PaginationQueryDto } from '../../common/dto/pagination.dto';

export const ALLOWED_MIME = [
  /^image\/(jpeg|png|gif|webp|svg\+xml|avif)$/,
  /^application\/pdf$/,
  /^video\/(mp4|webm|quicktime)$/,
];

@Injectable()
export class MediaService {
  private readonly assetUrl: string;
  private readonly uploadRoot: string;

  constructor(@InjectRepository(Media) private readonly repo: Repository<Media>, config: ConfigService) {
    this.assetUrl = config.get<string>('assetUrl')!;
    this.uploadRoot = resolve(config.get<string>('upload.dir')!);
  }

  withUrl(m: Media) {
    return { ...m, url: uploadUrl(m.path, this.assetUrl) };
  }

  async findAll(q: PaginationQueryDto & { type?: string; folder?: string }) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 24;
    const qb = this.repo.createQueryBuilder('m').orderBy('m.createdAt', 'DESC').addOrderBy('m.id', 'DESC');
    if (q.search) qb.andWhere('(m.originalName LIKE :s OR m.alt LIKE :s)', { s: `%${q.search}%` });
    if (q.type === 'image') qb.andWhere("m.mimeType LIKE 'image/%'");
    if (q.type === 'video') qb.andWhere("m.mimeType LIKE 'video/%'");
    if (q.type === 'document') qb.andWhere("m.mimeType NOT LIKE 'image/%' AND m.mimeType NOT LIKE 'video/%'");
    if (q.folder) qb.andWhere('m.folder = :folder', { folder: q.folder });
    const [rows, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return paginated(rows.map((r) => this.withUrl(r)), total, page, limit);
  }

  async folders() {
    const rows = await this.repo.createQueryBuilder('m').select('DISTINCT m.folder', 'folder').getRawMany<{ folder: string }>();
    return rows.map((r) => r.folder);
  }

  async saveUploaded(files: Express.Multer.File[], folder: string, userId?: number) {
    if (!files?.length) throw new BadRequestException('Tidak ada file yang diupload');
    const saved: Media[] = [];
    for (const f of files) {
      const rel = f.path.replace(this.uploadRoot, '').split('\\').join('/');
      const media = await this.repo.save(
        this.repo.create({
          filename: f.filename,
          originalName: Buffer.from(f.originalname, 'latin1').toString('utf8'),
          mimeType: f.mimetype,
          size: f.size,
          path: `/uploads${rel.startsWith('/') ? rel : `/${rel}`}`,
          folder: folder || 'general',
          uploadedById: userId ?? null,
        }),
      );
      saved.push(media);
    }
    const out = saved.map((m) => this.withUrl(m));
    return out.length === 1 ? out[0] : { items: out, originalName: `${out.length} file` };
  }

  async update(id: number, data: { alt?: string; folder?: string }) {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('File tidak ditemukan');
    if (data.alt !== undefined) m.alt = data.alt;
    if (data.folder) m.folder = data.folder;
    return this.withUrl(await this.repo.save(m));
  }

  async remove(id: number) {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('File tidak ditemukan');
    const abs = join(this.uploadRoot, m.path.replace(/^\/uploads/, ''));
    if (abs.startsWith(this.uploadRoot)) await fs.unlink(abs).catch(() => undefined);
    await this.repo.delete(id);
    return { id, originalName: m.originalName, success: true };
  }

  async stats() {
    const row = await this.repo
      .createQueryBuilder('m')
      .select('COUNT(*)', 'count')
      .addSelect('COALESCE(SUM(m.size),0)', 'size')
      .getRawOne<{ count: string; size: string }>();
    return { count: Number(row?.count ?? 0), totalSize: Number(row?.size ?? 0) };
  }
}
