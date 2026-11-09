/**
 * Impor file ke penyimpanan CMS (MinIO / local) dan daftarkan ke Media Library.
 *
 *   npm run media:migrate                → migrasi lengkap:
 *                                          1) file lama di folder UPLOAD_DIR → MinIO (bila STORAGE_DRIVER=minio)
 *                                          2) gambar/video/PDF website (package/public) → penyimpanan CMS,
 *                                             lalu semua rujukan "/images/..." di database diubah ke file Media Library
 *   npm run media:migrate -- --only-local   → hanya langkah 1
 *   npm run media:migrate -- --only-site    → hanya langkah 2
 *   npm run media:migrate -- --dry-run      → tampilkan apa yang akan dilakukan tanpa mengubah apa pun
 *
 * Aman dijalankan berulang: file yang sudah terdaftar dilewati.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { extname, join, relative, resolve, sep } from 'path';
import { AppModule } from '../../app.module';
import { Media } from '../../modules/media/media.entity';
import { StorageService } from '../../modules/storage/storage.service';

const log = new Logger('MediaImport');
const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const ONLY_LOCAL = args.includes('--only-local') || args.includes('--local');
const ONLY_SITE = args.includes('--only-site');

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.pdf': 'application/pdf',
};

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    if (name.startsWith('.')) return [];
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** kolom yang menyimpan path file persis */
const EXACT: [string, string][] = [
  ['blogs', 'coverImage'], ['blogs', 'galleryImg'], ['projects', 'coverImage'],
  ['careers', 'coverImage'], ['careers', 'galleryImg'], ['users', 'avatar'],
];
/** kolom JSON yang berisi path dalam tanda kutip */
const JSON_COLS: [string, string][] = [
  ['projects', 'gallery'], ['collection_items', 'data'], ['collection_items', 'translations'],
  ['settings', 'data'], ['settings', 'translations'],
];
/** kolom Markdown */
const TEXT_COLS: [string, string][] = [
  ['blog_translations', 'content'], ['project_translations', 'content'], ['career_translations', 'content'],
];

async function rewriteReferences(ds: DataSource, oldPath: string, newPath: string) {
  let changed = 0;
  for (const [t, c] of EXACT) {
    const r = await ds.query(`UPDATE \`${t}\` SET \`${c}\` = ? WHERE \`${c}\` = ?`, [newPath, oldPath]);
    changed += r.affectedRows ?? 0;
  }
  for (const [t, c] of JSON_COLS) {
    const r = await ds.query(
      `UPDATE \`${t}\` SET \`${c}\` = CAST(REPLACE(CAST(\`${c}\` AS CHAR), ?, ?) AS JSON) WHERE CAST(\`${c}\` AS CHAR) LIKE ?`,
      [`"${oldPath}"`, `"${newPath}"`, `%"${oldPath}"%`],
    );
    changed += r.affectedRows ?? 0;
  }
  for (const [t, c] of TEXT_COLS) {
    const r = await ds.query(
      `UPDATE \`${t}\` SET \`${c}\` = REPLACE(REPLACE(\`${c}\`, ?, ?), ?, ?) WHERE \`${c}\` LIKE ?`,
      [`(${oldPath})`, `(${newPath})`, `"${oldPath}"`, `"${newPath}"`, `%${oldPath}%`],
    );
    changed += r.affectedRows ?? 0;
  }
  return changed;
}

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });
  await app.init();
  const storage = app.get(StorageService);
  const ds = app.get(DataSource);
  const repo = app.get<Repository<Media>>(getRepositoryToken(Media));
  log.log(`Storage: ${storage.driver}${DRY ? ' (dry-run)' : ''}`);
  if (storage.driver === 'minio' && (await storage.health()) !== 'up') {
    throw new Error('MinIO tidak bisa dihubungi. Periksa MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, dan MINIO_BUCKET di .env');
  }
  if (storage.driver === 'local' && !ONLY_LOCAL) {
    log.warn('STORAGE_DRIVER=local — file akan disalin ke folder UPLOAD_DIR, bukan ke MinIO.');
  }

  if (!ONLY_SITE) {
    // ---------- pindahkan file lokal ke MinIO ----------
    if (storage.driver !== 'minio') {
      if (ONLY_LOCAL) throw new Error('Set STORAGE_DRIVER=minio untuk memindahkan file lokal ke MinIO');
      log.log('• Langkah 1 dilewati (STORAGE_DRIVER bukan minio)');
    } else {
    const root = storage.localUploadRoot;
    const files = walk(root).filter((f) => !f.endsWith('.gitkeep'));
    let n = 0;
    for (const f of files) {
      const key = relative(root, f).split(sep).join('/');
      const mime = MIME[extname(f).toLowerCase()] ?? 'application/octet-stream';
      if (!DRY) await storage.put(key, readFileSync(f), mime);
      n++;
    }
    log.log(`✔ Langkah 1: ${n} file upload lama dipindahkan ke MinIO (path di database tetap)`);
    }
  }

  if (!ONLY_LOCAL) {
    // ---------- impor aset website lama ----------
    const siteDir = resolve(process.env.SEED_CONTENT_DIR ?? '../package', 'public');
    log.log(`Folder aset website: ${siteDir}`);
    const files = ['images', 'video', 'docs'].flatMap((d) => walk(join(siteDir, d)));
    let uploaded = 0;
    let skipped = 0;
    let refs = 0;
    for (const f of files) {
      const rel = relative(siteDir, f).split(sep).join('/'); // images/home/a.jpg
      const mime = MIME[extname(f).toLowerCase()];
      if (!mime) continue;
      const oldPath = `/${rel}`;
      const key = `site/${rel}`;
      const newPath = storage.pathFromKey(key);
      const exists = await repo.exist({ where: { path: newPath } });
      if (!exists) {
        if (!DRY) {
          await storage.put(key, readFileSync(f), mime);
          await repo.save(
            repo.create({
              filename: rel.split('/').pop()!,
              originalName: rel.split('/').pop()!,
              mimeType: mime,
              size: statSync(f).size,
              path: newPath,
              folder: `website/${rel.split('/')[0]}`,
              alt: null,
              uploadedById: null,
            }),
          );
        }
        uploaded++;
      } else skipped++;
      if (!DRY) refs += await rewriteReferences(ds, oldPath, newPath);
    }
    log.log(`✔ Langkah 2: ${uploaded} file diupload, ${skipped} sudah ada, ${refs} rujukan konten diperbarui`);
    log.log('File asli di package/public tetap ada sebagai cadangan bila CMS tidak aktif.');
  }

  await app.close();
  log.log('Selesai ✅');
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
