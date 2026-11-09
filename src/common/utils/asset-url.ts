/**
 * Ubah path relatif "/uploads/..." menjadi URL absolut backend secara rekursif,
 * agar website (domain lain) bisa menampilkan file hasil upload CMS.
 */
export function absolutizeUploads<T>(value: T, appUrl: string): T {
  if (typeof value === 'string') {
    return (value.startsWith('/uploads/') ? `${appUrl}${value}` : value) as unknown as T;
  }
  if (Array.isArray(value)) return value.map((v) => absolutizeUploads(v, appUrl)) as unknown as T;
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = absolutizeUploads(v, appUrl);
    return out as T;
  }
  return value;
}
