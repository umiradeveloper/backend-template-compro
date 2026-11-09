import { NextResponse } from "next/server";
import { getProjectsCms, localeFromRequest } from "@/lib/cms";

export async function GET(req: Request) {
  const locale = localeFromRequest(req);
  const projects = await getProjectsCms(locale);
  return NextResponse.json(projects);
}
