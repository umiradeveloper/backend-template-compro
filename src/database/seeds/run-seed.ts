/**
 * Seeder: buat super admin, pengaturan default, koleksi konten, teks website,
 * dan impor artikel/proyek/karir dari folder markdown website lama.
 *
 *   npm run seed            (development, ts-node)
 *   npm run seed:prod       (setelah build)
 *
 * Aman dijalankan berulang: data yang sudah ada tidak ditimpa.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../../app.module';
import { User } from '../../modules/users/user.entity';
import { Role, ContentStatus, LOCALES } from '../../common/enums';
import { SettingsService } from '../../modules/settings/settings.service';
import { CollectionsService } from '../../modules/collections/collections.service';
import { SiteTextsService } from '../../modules/site-texts/site-texts.service';
import { BlogsService } from '../../modules/blogs/blogs.service';
import { ProjectsService } from '../../modules/projects/projects.service';
import { CareersService } from '../../modules/careers/careers.service';
import { Setting } from '../../modules/settings/setting.entity';
import { CollectionItem } from '../../modules/collections/collection-item.entity';
import { COLLECTION_SEED, SETTINGS_SEED } from './seed-data';

const log = new Logger('Seeder');

function readMdx(dir: string) {
  const out: Record<string, Record<string, { data: Record<string, any>; content: string }>> = {};
  if (!existsSync(dir)) return out;
  for (const locale of LOCALES) {
    const d = join(dir, locale);
    if (!existsSync(d)) continue;
    for (const file of readdirSync(d).filter((f) => /\.mdx?$/.test(f))) {
      const slug = file.replace(/\.mdx?$/, '');
      const parsed = matter(readFileSync(join(d, file), 'utf8'));
      out[slug] = out[slug] ?? {};
      out[slug][locale] = { data: parsed.data, content: parsed.content.trim() };
    }
  }
  return out;
}

const toDate = (v: unknown) => (v ? new Date(v as string).toISOString() : undefined);
const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : v);

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });
  const contentDir = resolve(process.env.SEED_CONTENT_DIR ?? '../package');
  log.log(`Folder konten website: ${contentDir}`);

  // 1. Super admin
  const users = app.get<Repository<User>>(getRepositoryToken(User));
  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@umiraglobal.com').toLowerCase();
  if (!(await users.exist({ where: { email } }))) {
    await users.save(
      users.create({
        name: process.env.SEED_ADMIN_NAME ?? 'Super Admin',
        email,
        password: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? 'Admin@12345', 10),
        role: Role.SUPERADMIN,
      }),
    );
    log.log(`✔ Super admin dibuat: ${email}`);
  } else log.log(`• Super admin sudah ada: ${email}`);

  // 2. Pengaturan
  const settings = app.get(SettingsService);
  const settingRepo = app.get<Repository<Setting>>(getRepositoryToken(Setting));
  for (const [key, value] of Object.entries(SETTINGS_SEED)) {
    if (await settingRepo.exist({ where: { key } })) continue;
    await settings.upsert(key, value as any);
    log.log(`✔ Pengaturan "${key}"`);
  }

  // 3. Message JSON next-intl
  const messages: Record<string, any> = {};
  for (const l of LOCALES) {
    const f = join(contentDir, 'src', 'message', l, `${l}.json`);
    messages[l] = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
  }

  // 4. Koleksi
  const collections = app.get(CollectionsService);
  const itemRepo = app.get<Repository<CollectionItem>>(getRepositoryToken(CollectionItem));
  const fromMsg: Record<string, (l: string, i: number) => Record<string, unknown>> = {
    services: (l, i) => ({ heading: messages[l]?.ServicesSection?.items?.[i]?.heading, desc: messages[l]?.ServicesSection?.items?.[i]?.desc }),
    faqs: (l, i) => ({ question: messages[l]?.FaqSection?.items?.[i]?.question, answer: messages[l]?.FaqSection?.items?.[i]?.answer }),
    'home-stats': (l, i) => ({ description: messages[l]?.StatsFacts?.scores?.[i] }),
    'about-stats': (l, i) => ({ title: messages[l]?.AboutStats?.stats?.[i]?.title, description: messages[l]?.AboutStats?.stats?.[i]?.descp }),
  };
  for (const [key, items] of Object.entries(COLLECTION_SEED)) {
    if ((await itemRepo.count({ where: { collection: key } })) > 0) continue;
    for (const [i, item] of items.entries()) {
      const tr = { en: { ...(item.translations?.en ?? {}) }, id: { ...(item.translations?.id ?? {}) } };
      if (fromMsg[key]) {
        Object.assign(tr.en, fromMsg[key]('en', i));
        Object.assign(tr.id, fromMsg[key]('id', i));
      }
      await collections.create(key, { data: item.data ?? {}, translations: tr });
    }
    log.log(`✔ Koleksi "${key}" (${items.length} item)`);
  }

  // 5. Teks website
  const siteTexts = app.get(SiteTextsService);
  for (const l of LOCALES) {
    const res = await siteTexts.importMessages(l, messages[l], false);
    log.log(`✔ Teks website [${l}]: ${res.imported} key baru`);
  }

  // 6. Blog
  const blogs = app.get(BlogsService);
  const blogMdx = readMdx(join(contentDir, 'markdown', 'blogs'));
  let n = 0;
  for (const [slug, byLocale] of Object.entries(blogMdx)) {
    if (await blogs.findBySlug(slug, false)) continue;
    const base = (byLocale.en ?? byLocale.id).data;
    await blogs.create({
      slug,
      status: ContentStatus.PUBLISHED,
      publishedAt: toDate(base.date),
      coverImage: clean(base.coverImage),
      galleryImg: clean(base.galleryImg),
      translations: Object.entries(byLocale).map(([locale, { data, content }]) => ({
        locale, title: clean(data.title), detail: clean(data.detail), excerpt: clean(data.scrolltoread), content,
      })),
    });
    n++;
  }
  log.log(`✔ Blog diimpor: ${n}`);

  // 7. Proyek
  const projects = app.get(ProjectsService);
  const projectMdx = readMdx(join(contentDir, 'markdown', 'projects'));
  n = 0;
  let order = 0;
  for (const [slug, byLocale] of Object.entries(projectMdx)) {
    if (await projects.findBySlug(slug, false)) continue;
    const base = (byLocale.en ?? byLocale.id).data;
    await projects.create({
      slug,
      status: ContentStatus.PUBLISHED,
      coverImage: clean(base.coverImage),
      gallery: Array.isArray(base.gallery) ? base.gallery : [],
      area: clean(base.raised) || undefined,
      website: clean(base.website) || undefined,
      sortOrder: order++,
      translations: Object.entries(byLocale).map(([locale, { data, content }]) => ({
        locale, title: clean(data.title), industry: clean(data.industry), scopeOfWork: data.ScopeOfWork ?? [], description: clean(data.description), content,
      })),
    });
    n++;
  }
  log.log(`✔ Proyek diimpor: ${n}`);

  // 8. Karir
  const careers = app.get(CareersService);
  const careerMdx = readMdx(join(contentDir, 'markdown', 'career'));
  n = 0;
  for (const [slug, byLocale] of Object.entries(careerMdx)) {
    if (await careers.findBySlug(slug, false)) continue;
    const base = (byLocale.en ?? byLocale.id).data;
    await careers.create({
      slug,
      status: ContentStatus.PUBLISHED,
      publishedAt: toDate(base.date),
      coverImage: clean(base.coverImage),
      galleryImg: clean(base.galleryImg),
      department: 'Engineering',
      employmentType: 'trainee',
      applyEmail: 'recruitment@umiraglobal.com',
      translations: Object.entries(byLocale).map(([locale, { data, content }]) => ({
        locale, title: clean(data.title), detail: clean(data.detail), excerpt: clean(data.scrolltoread), content,
      })),
    });
    n++;
  }
  log.log(`✔ Lowongan diimpor: ${n}`);

  await app.close();
  log.log('Selesai ✅');
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
