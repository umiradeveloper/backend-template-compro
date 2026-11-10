/**
 * Ubah path relatif "/uploads/..." menjadi URL absolut backend secara rekursif,
 * agar website (domain lain) bisa menampilkan file hasil upload CMS.
 * Path di dalam teks Markdown (mis. ![](/uploads/a.jpg)) ikut diubah.
 */
export function absolutizeUploads<T>(value: T, appUrl: string): T {
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/')) return `${appUrl}${value}` as unknown as T;
    if (value.includes('/uploads/')) {
      return value.replace(/(\(|"|'|\s|^)(\/uploads\/[^\s)"']+)/g, (_m, pre: string, p: string) => `${pre}${appUrl}${p}`) as unknown as T;
    }
    return value;
  }
  if (Array.isArray(value)) return value.map((v) => absolutizeUploads(v, appUrl)) as unknown as T;
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = absolutizeUploads(v, appUrl);
    return out as T;
  }
  return value;
}
