/**
 * Aset gambar/video/dokumen bawaan website yang disimpan di backend (folder seeds/assets).
 * Saat seed: file disalin ke folder upload CMS (UPLOAD_DIR/site/...), didaftarkan ke
 * Media Library, dan semua konten seed memakai alamat /uploads/site/... dari backend.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { dirname, extname, join, relative, sep } from 'path';

export const SITE_PREFIX = '/uploads/site';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.pdf': 'application/pdf',
};

export interface SeedAsset {
  /** path di website lama, mis. /images/home/team/team-img.jpg */
  sitePath: string;
  /** path di CMS, mis. /uploads/site/images/home/team/team-img.jpg */
  uploadPath: string;
  abs: string;
  rel: string;
  mime: string;
  size: number;
}

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    if (name.startsWith('.')) return [];
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

export class SeedAssets {
  readonly list: SeedAsset[];
  private readonly bySitePath = new Map<string, SeedAsset>();

  constructor(readonly root: string) {
    this.list = walk(root)
      .map((abs) => {
        const rel = relative(root, abs).split(sep).join('/');
        const mime = MIME[extname(abs).toLowerCase()];
        if (!mime) return null;
        return { sitePath: `/${rel}`, uploadPath: `${SITE_PREFIX}/${rel}`, abs, rel, mime, size: statSync(abs).size };
      })
      .filter((a): a is SeedAsset => !!a);
    for (const a of this.list) this.bySitePath.set(a.sitePath, a);
  }

  get count() {
    return this.list.length;
  }

  /** "/images/a.jpg" → "/uploads/site/images/a.jpg" bila file ada di seeds/assets */
  map(value: string | null | undefined): string | null | undefined {
    if (!value) return value;
    return this.bySitePath.get(value)?.uploadPath ?? value;
  }

  /** ubah semua path aset di dalam objek/array/teks (termasuk gambar di Markdown) */
  mapDeep<T>(value: T): T {
    if (typeof value === 'string') {
      const exact = this.bySitePath.get(value);
      if (exact) return exact.uploadPath as unknown as T;
      if (!value.includes('/')) return value;
      return value.replace(/(\(|"|')(\/(?:images|video|docs)\/[^)"'\s]+)/g, (m, pre: string, p: string) => {
        const a = this.bySitePath.get(p);
        return a ? `${pre}${a.uploadPath}` : m;
      }) as unknown as T;
    }
    if (Array.isArray(value)) return value.map((v) => this.mapDeep(v)) as unknown as T;
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = this.mapDeep(v);
      return out as T;
    }
    return value;
  }

  /** salin file ke UPLOAD_DIR/site/..., lewati yang sudah ada & sama ukurannya */
  copyTo(uploadRoot: string, asset: SeedAsset): boolean {
    const target = join(uploadRoot, 'site', asset.rel);
    if (existsSync(target) && statSync(target).size === asset.size) return false;
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(asset.abs, target);
    return true;
  }
}
