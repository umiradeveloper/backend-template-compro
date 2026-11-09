import { NextResponse } from "next/server";
import { getCareersCms, localeFromRequest } from "@/lib/cms";

export async function GET(req: Request) {
  const locale = localeFromRequest(req);
  const careers = await getCareersCms(locale);
  return NextResponse.json(careers);
}
