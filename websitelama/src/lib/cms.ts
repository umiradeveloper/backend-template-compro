/**
 * Integrasi website ↔ Umira CMS (backend NestJS).
 *
 * Bila CMS_API_URL (server) / NEXT_PUBLIC_CMS_API_URL (browser) diisi, konten diambil dari CMS.
 * Bila kosong atau CMS tidak bisa dihubungi, website otomatis memakai data lama
 * (file markdown/ & data statis) sehingga website tetap tampil.
 */
import { notFound } from "next/navigation";
import { cmsGet } from "./cms-core";
export { cmsGet, CMS_API_URL, deepMerge, getMessagesCms } from "./cms-core";
import { getAllBlogs, getBlogsBySlug } from "./blogmarkdown";
import { getAllProjects, getProjectsBySlug } from "./markdown";
import { getAllCareer, getCareerBySlug } from "./careermarkdown";

/** Ambil locale dari query ?locale= atau dari halaman yang memanggil (header Referer) */
export function localeFromRequest(req: Request, fallback = "en") {
  const url = new URL(req.url);
  const q = url.searchParams.get("locale");
  if (q === "id" || q === "en") return q;
  const ref = req.headers.get("referer") || "";
  const m = ref.match(/^https?:\/\/[^/]+\/(id|en)(\/|$)/);
  return m ? m[1] : fallback;
}

function byDateDesc<T extends { date?: string }>(list: T[]) {
  return list.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
}

// ---------------- BLOG ----------------
export async function getBlogsCms(locale: string, fields = ["title", "slug", "coverImage", "date"]) {
  const r = await cmsGet<{ data: any[] }>(`/blogs?locale=${locale}&limit=200`);
  if (r.data) return r.data.data;
  return byDateDesc(getAllBlogs(fields, locale));
}

export async function getBlogBySlugCms(slug: string, fields: string[], locale: string) {
  const r = await cmsGet<any>(`/blogs/${encodeURIComponent(slug)}?locale=${locale}`);
  if (r.data) return r.data;
  if (r.reachable && r.status === 404) notFound();
  try {
    return getBlogsBySlug(slug, fields, locale);
  } catch {
    notFound();
  }
}

// ---------------- PROJECTS ----------------
export async function getProjectsCms(locale: string, fields = ["title", "slug", "ScopeOfWork", "industry", "coverImage"]) {
  const r = await cmsGet<{ data: any[] }>(`/projects?locale=${locale}&limit=200`);
  if (r.data) return r.data.data;
  return getAllProjects(fields, locale);
}

export async function getProjectBySlugCms(slug: string, fields: string[], locale: string) {
  const r = await cmsGet<any>(`/projects/${encodeURIComponent(slug)}?locale=${locale}`);
  if (r.data) return r.data;
  if (r.reachable && r.status === 404) notFound();
  try {
    return getProjectsBySlug(slug, fields, locale);
  } catch {
    notFound();
  }
}

// ---------------- CAREERS ----------------
export async function getCareersCms(locale: string, fields = ["title", "slug", "coverImage", "date"]) {
  const r = await cmsGet<{ data: any[] }>(`/careers?locale=${locale}`);
  if (r.data) return r.data.data;
  return byDateDesc(getAllCareer(fields, locale));
}

export async function getCareerBySlugCms(slug: string, fields: string[], locale: string) {
  const r = await cmsGet<any>(`/careers/${encodeURIComponent(slug)}?locale=${locale}`);
  if (r.data) return r.data;
  if (r.reachable && r.status === 404) notFound();
  try {
    return getCareerBySlug(slug, fields, locale);
  } catch {
    notFound();
  }
}

