/**
 * Ubah path relatif "/uploads/..." menjadi URL publik file secara rekursif,
 * agar website (domain lain) bisa menampilkan file hasil upload CMS.
 * assetUrl menggantikan awalan "/uploads" (lihat ASSET_URL di .env), contoh:
 *   /uploads/site/a.jpg + https://files.umiraglobal.com/uploads → https://files.umiraglobal.com/uploads/site/a.jpg
 * Path di dalam teks Markdown (mis. ![](/uploads/a.jpg)) ikut diubah.
 */
export function uploadUrl(path: string, assetUrl: string): string {
  return path.startsWith('/uploads/') ? `${assetUrl}${path.slice('/uploads'.length)}` : path;
}

export function absolutizeUploads<T>(value: T, assetUrl: string): T {
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/')) return uploadUrl(value, assetUrl) as unknown as T;
    if (value.includes('/uploads/')) {
      return value.replace(/(\(|"|'|\s|^)(\/uploads\/[^\s)"']+)/g, (_m, pre: string, p: string) => `${pre}${uploadUrl(p, assetUrl)}`) as unknown as T;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map((v) => absolutizeUploads(v, assetUrl)) as unknown as T;
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = absolutizeUploads(v, assetUrl);
    return out as T;
  }
  return value;
}
