import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { locales, defaultLocale } from './i18n';
import createMiddleware from 'next-intl/middleware'


const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: false,
  localePrefix: "always"
})

export async function middleware(request: NextRequest) {
   // ✅ 1. next-intl HARUS jalan pertama
  const response = intlMiddleware(request);
  if (response) return response;

  const token = await getToken({req: request});
  const {pathname} = request.nextUrl;

  const locale = locales.find(l => pathname.startsWith(`/${l}`));
  if (!locale) return NextResponse.next();

  // ✅ 2. auth redirect (locale-aware)
  if (
    token &&
    (
      pathname.startsWith(`/${locale}/signin`) ||
      pathname.startsWith(`/${locale}/signup`)
    )
  ) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
