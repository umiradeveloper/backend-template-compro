import { BadRequestException, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { BaseContent, BaseTranslation } from './base.entities';
import { ContentQueryDto } from './content.dto';
import { paginated } from '../dto/pagination.dto';
import { ContentStatus, DEFAULT_LOCALE } from '../enums';
import { toSlug } from '../utils/slug';

type AnyDto = { slug?: string; status?: ContentStatus; translations?: Array<Record<string, any>>; [k: string]: any };

/**
 * Service generik untuk konten multi-bahasa (blog, proyek, karir).
 * Turunan cukup menentukan field skalar & kolom foreign key terjemahan.
 */
type WithTr<T> = { translations: T[] };

export abstract class TranslatableContentService<E extends BaseContent & WithTr<T>, T extends BaseTranslation> {
  /** nama kolom FK di tabel terjemahan, mis. "blogId" */
  protected abstract readonly parentKey: string;
  /** field skalar (non-terjemahan) yang boleh diisi dari DTO */
  protected abstract readonly scalarFields: string[];
  /** field terjemahan yang boleh diisi dari DTO */
  protected abstract readonly translationFields: string[];
  /** kolom yang boleh dipakai untuk sorting */
  protected readonly sortable = ['createdAt', 'updatedAt', 'slug', 'status', 'id'];
  protected readonly defaultSort: { field: string; order: 'ASC' | 'DESC' } = { field: 'createdAt', order: 'DESC' };
  protected abstract readonly label: string;

  constructor(protected readonly repo: Repository<E>, protected readonly trRepo: Repository<T>) {}

  /** Hook sebelum simpan (mis. set publishedAt) */
  protected beforeSave(_entity: E, _dto: AnyDto): void {}

  async findAll(q: ContentQueryDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 10;
    const qb = this.repo.createQueryBuilder('c').leftJoinAndSelect('c.translations', 't');
    if (q.status) qb.andWhere('c.status = :status', { status: q.status });
    if (q.search) {
      const trTable = this.trRepo.metadata.tableName;
      qb.andWhere(
        `(c.slug LIKE :s OR c.id IN (SELECT tt.${this.parentKey} FROM ${trTable} tt WHERE tt.title LIKE :s))`,
        { s: `%${q.search}%` },
      );
    }
    this.applyFilters(qb, q);
    const sortField = q.sortBy && this.sortable.includes(q.sortBy) ? q.sortBy : this.defaultSort.field;
    const sortOrder = (q.sortOrder?.toUpperCase() as 'ASC' | 'DESC') ?? this.defaultSort.order;
    qb.orderBy(`c.${sortField}`, sortOrder).addOrderBy('c.id', 'DESC');
    const [rows, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    return paginated(rows, total, page, limit);
  }

  /** Override untuk filter tambahan */
  protected applyFilters(_qb: any, _q: any) {}

  async findOne(id: number): Promise<E> {
    const item = await this.repo.findOne({ where: { id } as any, relations: { translations: true } as any });
    if (!item) throw new NotFoundException(`${this.label} tidak ditemukan`);
    return item;
  }

  async findBySlug(slug: string, onlyPublished = true): Promise<E | null> {
    const where: any = { slug };
    if (onlyPublished) where.status = ContentStatus.PUBLISHED;
    return this.repo.findOne({ where, relations: { translations: true } as any });
  }

  async create(dto: AnyDto, userId?: number): Promise<E> {
    if (!dto.translations?.length) throw new BadRequestException('Minimal satu terjemahan wajib diisi');
    const entity = this.repo.create() as E;
    this.assignScalars(entity, dto);
    entity.status = dto.status ?? ContentStatus.DRAFT;
    entity.slug = await this.uniqueSlug(dto.slug || this.titleFor(dto.translations));
    entity.createdById = userId ?? null;
    entity.updatedById = userId ?? null;
    this.beforeSave(entity, dto);
    const saved = await this.repo.save(entity);
    await this.syncTranslations(saved.id, dto.translations);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: AnyDto, userId?: number): Promise<E> {
    const entity = await this.findOne(id);
    this.assignScalars(entity, dto);
    if (dto.status) entity.status = dto.status;
    if (dto.slug !== undefined && dto.slug !== entity.slug) {
      entity.slug = await this.uniqueSlug(dto.slug || this.titleFor(dto.translations ?? entity.translations), id);
    }
    entity.updatedById = userId ?? entity.updatedById;
    this.beforeSave(entity, dto);
    const { translations: _omit, ...plain } = entity as any;
    await this.repo.save(plain);
    if (dto.translations) await this.syncTranslations(id, dto.translations);
    return this.findOne(id);
  }

  async remove(id: number) {
    const entity = await this.findOne(id);
    await this.trRepo.delete({ [this.parentKey]: id } as any);
    await this.repo.delete(id);
    return { id, title: this.titleFor(entity.translations), success: true };
  }

  async bulkRemove(ids: number[]) {
    await this.trRepo.delete({ [this.parentKey]: In(ids) } as any);
    const res = await this.repo.delete(ids);
    return { deleted: res.affected ?? 0 };
  }

  async bulkStatus(ids: number[], status: ContentStatus) {
    const items = await this.repo.find({ where: { id: In(ids) } as any });
    for (const item of items) {
      item.status = status;
      this.beforeSave(item, { status });
    }
    await this.repo.save(items as any);
    return { updated: items.length };
  }

  async duplicate(id: number, userId?: number) {
    const src = await this.findOne(id);
    const dto: AnyDto = { status: ContentStatus.DRAFT, slug: `${src.slug}-copy` };
    for (const f of this.scalarFields) dto[f] = (src as any)[f];
    dto.translations = src.translations.map((t) => {
      const tr: Record<string, any> = { locale: t.locale };
      for (const f of this.translationFields) tr[f] = (t as any)[f];
      tr.title = `${t.title} (Copy)`;
      return tr;
    });
    return this.create(dto, userId);
  }

  countByStatus() {
    return this.repo
      .createQueryBuilder('c')
      .select('c.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.status')
      .getRawMany<{ status: string; count: string }>()
      .then((rows) => {
        const out: Record<string, number> = { total: 0, draft: 0, published: 0, archived: 0 };
        for (const r of rows) {
          out[r.status] = Number(r.count);
          out.total += Number(r.count);
        }
        return out;
      });
  }

  /** Ambil terjemahan sesuai locale, fallback ke en lalu ke terjemahan pertama */
  pickTranslation(entity: E, locale: string): T | undefined {
    const list = entity.translations ?? [];
    return (
      list.find((t) => t.locale === locale) ?? list.find((t) => t.locale === DEFAULT_LOCALE) ?? list[0]
    );
  }

  protected titleFor(translations?: Array<Record<string, any>>): string {
    if (!translations?.length) return 'untitled';
    return String((translations.find((t) => t.locale === DEFAULT_LOCALE) ?? translations[0]).title ?? 'untitled');
  }

  protected assignScalars(entity: E, dto: AnyDto) {
    for (const f of this.scalarFields) {
      if (dto[f] !== undefined) (entity as any)[f] = dto[f] === '' ? null : dto[f];
    }
  }

  protected async syncTranslations(parentId: number, translations: Array<Record<string, any>>) {
    const existing = await this.trRepo.find({ where: { [this.parentKey]: parentId } as any });
    for (const tr of translations) {
      const current = existing.find((e) => e.locale === tr.locale);
      const data: Record<string, any> = { locale: tr.locale, [this.parentKey]: parentId };
      for (const f of ['title', 'metaTitle', 'metaDescription', ...this.translationFields]) {
        if (tr[f] !== undefined) data[f] = tr[f];
      }
      if (current) await this.trRepo.update(current.id, data as any);
      else await this.trRepo.insert(data as any);
    }
  }

  protected async uniqueSlug(base: string, excludeId?: number): Promise<string> {
    const root = toSlug(base) || `item-${Date.now()}`;
    let slug = root;
    let i = 2;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const found = await this.repo.findOne({ where: { slug } as any, select: { id: true } as any });
      if (!found || (excludeId && found.id === excludeId)) return slug;
      slug = `${root}-${i++}`;
    }
  }
}
