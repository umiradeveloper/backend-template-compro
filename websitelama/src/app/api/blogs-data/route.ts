import { NextResponse } from "next/server";
import { getBlogsCms, localeFromRequest } from "@/lib/cms";

export async function GET(req: Request) {
  const locale = localeFromRequest(req);
  const blogs = await getBlogsCms(locale);
  return NextResponse.json(blogs);
}
