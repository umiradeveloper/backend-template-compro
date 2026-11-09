import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionItem } from './collection-item.entity';
import { COLLECTION_SCHEMAS } from '../content-schemas/collections.schemas';
import { resolveValues, sanitizeValues, SchemaValues, titleOf } from '../content-schemas/schema-values';

export interface CollectionItemInput extends Partial<SchemaValues> {
  isActive?: boolean;
}

@Injectable()
export class CollectionsService {
  constructor(@InjectRepository(CollectionItem) private readonly repo: Repository<CollectionItem>) {}

  schema(key: string) {
    const s = COLLECTION_SCHEMAS.find((c) => c.key === key);
    if (!s) throw new NotFoundException(`Koleksi "${key}" tidak dikenal`);
    return s;
  }

  private withTitle(key: string, item: CollectionItem) {
    return { ...item, title: titleOf(this.schema(key), item) };
  }

  async list(key: string, onlyActive = false) {
    this.schema(key);
    const items = await this.repo.find({
      where: onlyActive ? { collection: key, isActive: true } : { collection: key },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return items.map((i) => this.withTitle(key, i));
  }

  async counts() {
    const rows = await this.repo
      .createQueryBuilder('c')
      .select('c.collection', 'collection')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.collection')
      .getRawMany<{ collection: string; count: string }>();
    return Object.fromEntries(rows.map((r) => [r.collection, Number(r.count)]));
  }

  async findOne(key: string, id: number) {
    const item = await this.repo.findOne({ where: { id, collection: key } });
    if (!item) throw new NotFoundException('Item tidak ditemukan');
    return this.withTitle(key, item);
  }

  async create(key: string, input: CollectionItemInput) {
    const values = sanitizeValues(this.schema(key), input);
    const max = await this.repo
      .createQueryBuilder('c')
      .select('MAX(c.sortOrder)', 'max')
      .where('c.collection = :key', { key })
      .getRawOne<{ max: number | null }>();
    const saved = await this.repo.save(
      this.repo.create({
        collection: key,
        ...values,
        isActive: input.isActive ?? true,
        sortOrder: (max?.max ?? -1) + 1,
      }),
    );
    return this.withTitle(key, saved);
  }

  async update(key: string, id: number, input: CollectionItemInput) {
    const item = await this.findOne(key, id);
    const merged: Partial<SchemaValues> = {
      data: { ...item.data, ...(input.data ?? {}) },
      translations: {
        en: { ...(item.translations?.en ?? {}), ...(input.translations?.en ?? {}) },
        id: { ...(item.translations?.id ?? {}), ...(input.translations?.id ?? {}) },
      },
    };
    const values = sanitizeValues(this.schema(key), merged);
    await this.repo.update(id, {
      data: values.data as any,
      translations: values.translations as any,
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    });
    return this.findOne(key, id);
  }

  async remove(key: string, id: number) {
    const item = await this.findOne(key, id);
    await this.repo.delete(id);
    return { id, title: item.title, success: true };
  }

  async reorder(key: string, ids: number[]) {
    await Promise.all(ids.map((id, i) => this.repo.update({ id, collection: key }, { sortOrder: i })));
    return { success: true };
  }

  /** Item aktif yang sudah di-resolve sesuai bahasa (untuk website) */
  async resolved(key: string, locale: string) {
    const schema = this.schema(key);
    const items = await this.list(key, true);
    return items.map((i) => ({ id: i.id, ...resolveValues(schema, i, locale) }));
  }
}
