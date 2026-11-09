/**
 * Ubah path relatif "/uploads/..." menjadi URL absolut secara rekursif
 * (URL backend untuk driver local, URL MinIO untuk driver minio),
 * agar website di domain lain bisa menampilkan file hasil upload CMS.
 * Path di dalam teks Markdown (mis. ![](/uploads/a.jpg)) ikut diubah.
 */
export function absolutizeUploads<T>(value: T, resolve: (path: string) => string): T {
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/')) return resolve(value) as unknown as T;
    if (value.includes('/uploads/')) {
      return value.replace(/(\(|"|'|\s|^)(\/uploads\/[^\s)"']+)/g, (_m, pre: string, p: string) => `${pre}${resolve(p)}`) as unknown as T;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map((v) => absolutizeUploads(v, resolve)) as unknown as T;
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = absolutizeUploads(v, resolve);
    return out as T;
  }
  return value;
}
