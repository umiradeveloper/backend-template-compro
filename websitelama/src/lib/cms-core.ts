/**
 * Fungsi dasar koneksi ke Umira CMS (tanpa akses file) — aman dipakai di i18n/request.ts.
 */
export const CMS_API_URL = (process.env.CMS_API_URL || process.env.NEXT_PUBLIC_CMS_API_URL || "").replace(/\/$/, "");
/** detik cache sebelum konten CMS diambil ulang */
const REVALIDATE = Number(process.env.CMS_REVALIDATE ?? 60);

type CmsResult<T> = { reachable: boolean; status: number; data: T | null };

export async function cmsGet<T = any>(path: string): Promise<CmsResult<T>> {
  if (!CMS_API_URL) return { reachable: false, status: 0, data: null };
  try {
    const res = await fetch(`${CMS_API_URL}/api/public${path}`, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { reachable: true, status: res.status, data: null };
    return { reachable: true, status: res.status, data: (await res.json()) as T };
  } catch (e) {
    console.warn(`[cms] gagal menghubungi CMS (${path}):`, (e as Error).message);
    return { reachable: false, status: 0, data: null };
  }
}

// ---------------- TEKS (next-intl) ----------------
function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

/** gabungkan: nilai dari CMS menimpa file lokal, array diganti utuh */
export function deepMerge(base: Record<string, unknown>, over: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(over ?? {})) {
    out[k] = isObj(v) && isObj(base[k]) ? deepMerge(base[k] as Record<string, unknown>, v) : v;
  }
  return out;
}

export async function getMessagesCms(locale: string, local: Record<string, unknown>) {
  const r = await cmsGet<Record<string, unknown>>(`/messages/${locale}`);
  return r.data ? deepMerge(local, r.data) : local;
}
