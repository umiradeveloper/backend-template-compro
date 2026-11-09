import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';
import { PRIVATE_SETTING_FIELDS, SETTING_SCHEMAS } from '../content-schemas/settings.schemas';
import { resolveValues, sanitizeValues, SchemaValues } from '../content-schemas/schema-values';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Setting) private readonly repo: Repository<Setting>) {}

  schema(key: string) {
    const s = SETTING_SCHEMAS.find((x) => x.key === key);
    if (!s) throw new NotFoundException(`Grup pengaturan "${key}" tidak dikenal`);
    return s;
  }

  async getAll() {
    const rows = await this.repo.find();
    const out: Record<string, SchemaValues & { updatedAt?: Date }> = {};
    for (const s of SETTING_SCHEMAS) {
      const row = rows.find((r) => r.key === s.key);
      out[s.key] = row
        ? { data: row.data, translations: row.translations, updatedAt: row.updatedAt }
        : { data: {}, translations: { en: {}, id: {} } };
    }
    return out;
  }

  async get(key: string): Promise<SchemaValues> {
    this.schema(key);
    const row = await this.repo.findOne({ where: { key } });
    return row ? { data: row.data, translations: row.translations } : { data: {}, translations: { en: {}, id: {} } };
  }

  async upsert(key: string, input: Partial<SchemaValues>) {
    const values = sanitizeValues(this.schema(key), input);
    await this.repo.save({ key, ...values });
    return { key, title: this.schema(key).label, ...(await this.get(key)) };
  }

  /** Nilai setting untuk website, sudah sesuai bahasa, tanpa field privat */
  async resolved(key: string, locale: string) {
    const values = resolveValues(this.schema(key), await this.get(key), locale);
    for (const f of PRIVATE_SETTING_FIELDS[key] ?? []) delete values[f];
    return values;
  }

  async resolvedAll(locale: string) {
    const out: Record<string, Record<string, unknown>> = {};
    for (const s of SETTING_SCHEMAS) out[s.key] = await this.resolved(s.key, locale);
    return out;
  }

  async privateValue(key: string, field: string): Promise<unknown> {
    const v = await this.get(key);
    return v.data?.[field];
  }
}
