import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SiteText } from './site-text.entity';
import { LOCALES } from '../../common/enums';
import { flatten, unflatten } from '../../common/utils/nested';
import { CollectionsService } from '../collections/collections.service';

export interface SiteTextRow {
  key: string;
  values: Record<string, string>;
}

/**
 * Key berikut dikelola lewat Koleksi (bukan Teks Website), lalu disisipkan
 * ke message next-intl saat diambil website.
 */
export const COLLECTION_DRIVEN_KEYS = ['ServicesSection.items', 'FaqSection.items', 'StatsFacts.scores', 'AboutStats.stats'];

@Injectable()
export class SiteTextsService {
  constructor(
    @InjectRepository(SiteText) private readonly repo: Repository<SiteText>,
    private readonly collections: CollectionsService,
  ) {}

  /** Semua key dalam bentuk baris {key, values:{en,id}} untuk editor admin */
  async list(search?: string): Promise<{ groups: string[]; rows: SiteTextRow[] }> {
    const qb = this.repo.createQueryBuilder('s').orderBy('s.key', 'ASC');
    if (search) qb.where('(s.key LIKE :s OR s.value LIKE :s)', { s: `%${search}%` });
    const all = await qb.getMany();
    const map = new Map<string, SiteTextRow>();
    for (const t of all) {
      if (!map.has(t.key)) map.set(t.key, { key: t.key, values: {} });
      map.get(t.key)!.values[t.locale] = t.value;
    }
    const rows = [...map.values()].sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
    const groups = [...new Set(rows.map((r) => r.key.split('.')[0]))];
    return { groups, rows };
  }

  async bulkUpsert(rows: SiteTextRow[]) {
    let changed = 0;
    for (const row of rows) {
      const key = row.key?.trim();
      if (!key || !/^[A-Za-z0-9_\-]+(\.[A-Za-z0-9_\-]+)*$/.test(key)) {
        throw new BadRequestException(`Key tidak valid: "${row.key}"`);
      }
      for (const locale of LOCALES) {
        const value = row.values?.[locale];
        if (value === undefined) continue;
        await this.repo.upsert({ key, locale, value }, ['locale', 'key']);
        changed++;
      }
    }
    return { changed, title: `${rows.length} teks` };
  }

  async removeKeys(keys: string[]) {
    const res = await this.repo.delete({ key: In(keys) });
    return { deleted: res.affected ?? 0 };
  }

  /** Impor objek message JSON (format next-intl) */
  async importMessages(locale: string, messages: Record<string, unknown>, overwrite = false) {
    const flat = flatten(messages);
    let count = 0;
    for (const [key, value] of Object.entries(flat)) {
      if (COLLECTION_DRIVEN_KEYS.some((k) => key === k || key.startsWith(`${k}.`))) continue;
      if (!overwrite && (await this.repo.exist({ where: { key, locale } }))) continue;
      await this.repo.upsert({ key, locale, value }, ['locale', 'key']);
      count++;
    }
    return { imported: count, title: `import ${locale}` };
  }

  /** Message lengkap untuk next-intl: teks + item koleksi */
  async messages(locale: string) {
    const rows = await this.repo.find({ where: { locale } });
    const flat: Record<string, string> = {};
    for (const r of rows) flat[r.key] = r.value;
    const msg = unflatten(flat) as Record<string, any>;

    const services = await this.collections.resolved('services', locale);
    const faqs = await this.collections.resolved('faqs', locale);
    const stats = await this.collections.resolved('home-stats', locale);
    const aboutStats = await this.collections.resolved('about-stats', locale);

    msg.ServicesSection = { ...(msg.ServicesSection ?? {}), items: services.map((s: any) => ({ heading: s.heading ?? '', desc: s.desc ?? '' })) };
    msg.FaqSection = { ...(msg.FaqSection ?? {}), items: faqs.map((f: any) => ({ question: f.question ?? '', answer: f.answer ?? '' })) };
    msg.StatsFacts = { ...(msg.StatsFacts ?? {}), scores: stats.map((s: any) => s.description ?? '') };
    msg.AboutStats = { ...(msg.AboutStats ?? {}), stats: aboutStats.map((s: any) => ({ title: s.title ?? '', descp: s.description ?? '' })) };
    return msg;
  }
}
