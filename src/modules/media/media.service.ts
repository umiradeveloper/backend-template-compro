import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { extname } from 'path';
import { randomBytes } from 'crypto';
import { Media } from './media.entity';
import { paginated, PaginationQueryDto } from '../../common/dto/pagination.dto';
import { StorageService } from '../storage/storage.service';

export const ALLOWED_MIME = [
  /^image\/(jpeg|png|gif|webp|svg\+xml|avif)$/,
  /^application\/pdf$/,
  /^video\/(mp4|webm|quicktime)$/,
];

const kind = (mime: string) => (mime.startsWith('image/') ? 'image' : mime.startsWith('video/') ? 'video' : 'document');

/** nama file aman: "Foto Proyek 1.JPG" → "foto-proyek-1-a1b2c3d4.jpg" */
export function safeFileName(original: string) {
  const ext = extname(original).toLowerCase().replace(/[^.a-z0-9]/g, '');
  const base = original
    .replace(extname(original), '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return `${base || 'file'}-${randomBytes(4).toString('hex')}${ext}`;
}

/** Tabel/kolom yang bisa menyimpan path file — dipakai untuk mencari "dipakai di mana" */
const USAGE_SOURCES: { table: string; columns: string[]; label: string; id: string; title?: string; link: (ref: string, title?: string) => string }[] = [
  { table: 'blogs', columns: ['coverImage', 'galleryImg'], label: 'Gambar artikel', id: 'id', link: (r) => `/blogs/${r}` },
  { table: 'blog_translations', columns: ['content'], label: 'Isi artikel', id: 'blogId', title: 'title', link: (r) => `/blogs/${r}` },
  { table: 'projects', columns: ['coverImage', 'gallery'], label: 'Gambar proyek', id: 'id', link: (r) => `/projects/${r}` },
  { table: 'project_translations', columns: ['content'], label: 'Isi proyek', id: 'projectId', title: 'title', link: (r) => `/projects/${r}` },
  { table: 'careers', columns: ['coverImage', 'galleryImg'], label: 'Gambar lowongan', id: 'id', link: (r) => `/careers/${r}` },
  { table: 'career_translations', columns: ['content'], label: 'Isi lowongan', id: 'careerId', title: 'title', link: (r) => `/careers/${r}` },
  { table: 'collection_items', columns: ['data', 'translations'], label: 'Konten halaman', id: 'id', title: 'collection', link: (_r, t) => `/collections/${t}` },
  { table: 'settings', columns: ['data', 'translations'], label: 'Pengaturan', id: '`key`', link: () => '/settings' },
  { table: 'users', columns: ['avatar'], label: 'Foto pengguna', id: 'id', title: 'name', link: () => '/profile' },
];

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly repo: Repository<Media>,
    private readonly storage: StorageService,
    private readonly ds: DataSource,
  ) {}

  /** url = URL publik + ?v= agar preview langsung berubah setelah file diganti */
  withUrl(m: Media) {
    const v = m.updatedAt ? new Date(m.updatedAt).getTime() : 0;
    return { ...m, url: `${this.storage.publicUrl(m.path)}${v ? `?v=${v}` : ''}`, storage: this.storage.driver };
  }

  async findAll(q: PaginationQueryDto & { type?: string; folder?: string }) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 24;
    const qb = this.repo.createQueryBuilder('m').orderBy('m.createdAt', 'DESC').addOrderBy('m.id', 'DESC');
    if (q.search) qb.andWhere('(m.originalName LIKE :s OR m.alt LIKE :s OR m.path LIKE :s)', { s: `%${q.search}%` });
    if (q.type === 'image') qb.andWhere("m.mimeType LIKE 'image/%'");
    if (q.type === 'video') qb.andWhere("m.mimeType LIKE 'video/%'");
    if (q.type === 'document') qb.andWhere("m.mimeType NOT LIKE 'image/%' AND m.mimeType NOT LIKE 'video/%'");
    if (q.folder) qb.andWhere('m.folder = :folder', { folder: q.folder });
    const [rows, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return paginated(rows.map((r) => this.withUrl(r)), total, page, limit);
  }

  async findOne(id: number) {
    const m = await this.repo.findOne({ where: { id } });
    if (!m) throw new NotFoundException('File tidak ditemukan');
    return m;
  }

  async folders() {
    const rows = await this.repo.createQueryBuilder('m').select('DISTINCT m.folder', 'folder').getRawMany<{ folder: string }>();
    return rows.map((r) => r.folder);
  }

  private originalName(f: Express.Multer.File) {
    return Buffer.from(f.originalname, 'latin1').toString('utf8');
  }

  async saveUploaded(files: Express.Multer.File[], folder: string, userId?: number) {
    if (!files?.length) throw new BadRequestException('Tidak ada file yang diupload');
    const now = new Date();
    const prefix = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
    const saved: Media[] = [];
    for (const f of files) {
      const name = this.originalName(f);
      const filename = safeFileName(name);
      const key = `${prefix}/${filename}`;
      await this.storage.put(key, f.buffer, f.mimetype);
      saved.push(
        await this.repo.save(
          this.repo.create({
            filename,
            originalName: name,
            mimeType: f.mimetype,
            size: f.size,
            path: this.storage.pathFromKey(key),
            folder: folder || 'general',
            uploadedById: userId ?? null,
          }),
        ),
      );
    }
    const out = saved.map((m) => this.withUrl(m));
    return out.length === 1 ? out[0] : { items: out, originalName: `${out.length} file` };
  }

  /**
   * Ganti isi file tanpa mengubah alamatnya.
   * Semua konten yang memakai file ini otomatis menampilkan file baru.
   */
  async replace(id: number, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Pilih file pengganti');
    const m = await this.findOne(id);
    if (kind(m.mimeType) !== kind(file.mimetype)) {
      throw new BadRequestException(`File pengganti harus berjenis sama (${kind(m.mimeType) === 'image' ? 'gambar' : kind(m.mimeType)})`);
    }
    await this.storage.put(this.storage.keyFromPath(m.path), file.buffer, file.mimetype);
    m.mimeType = file.mimetype;
    m.size = file.size;
    m.originalName = this.originalName(file);
    m.updatedAt = new Date();
    return this.withUrl(await this.repo.save(m));
  }

  async update(id: number, data: { alt?: string; folder?: string }) {
    const m = await this.findOne(id);
    if (data.alt !== undefined) m.alt = data.alt;
    if (data.folder) m.folder = data.folder;
    return this.withUrl(await this.repo.save(m));
  }

  async remove(id: number) {
    const m = await this.findOne(id);
    await this.storage.remove(this.storage.keyFromPath(m.path));
    await this.repo.delete(id);
    return { id, originalName: m.originalName, success: true };
  }

  /** Cari konten yang memakai file ini */
  async usage(id: number) {
    const m = await this.findOne(id);
    const needle = `%${m.path}%`;
    const out: { label: string; ref: string; title?: string; link: string }[] = [];
    for (const src of USAGE_SOURCES) {
      const where = src.columns.map((c) => `CAST(\`${c}\` AS CHAR) LIKE ?`).join(' OR ');
      const select = `${src.id} AS ref${src.title ? `, \`${src.title}\` AS title` : ''}`;
      const rows: { ref: string | number; title?: string }[] = await this.ds.query(
        `SELECT ${select} FROM \`${src.table}\` WHERE ${where} LIMIT 50`,
        src.columns.map(() => needle),
      );
      for (const r of rows) {
        const ref = String(r.ref);
        if (out.some((o) => o.link === src.link(ref, r.title) && o.label === src.label)) continue;
        out.push({ label: src.label, ref, title: r.title, link: src.link(ref, r.title) });
      }
    }
    return { path: m.path, count: out.length, items: out };
  }

  async stats() {
    const row = await this.repo
      .createQueryBuilder('m')
      .select('COUNT(*)', 'count')
      .addSelect('COALESCE(SUM(m.size),0)', 'size')
      .getRawOne<{ count: string; size: string }>();
    return { count: Number(row?.count ?? 0), totalSize: Number(row?.size ?? 0), storage: this.storage.driver };
  }
}
