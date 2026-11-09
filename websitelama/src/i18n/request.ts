import { getRequestConfig } from 'next-intl/server'
import { getMessagesCms } from '@/lib/cms-core'

const DEFAULT_LOCALE = 'id'
const SUPPORTED_LOCALES = ['id', 'en'] as const

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale =
    locale && SUPPORTED_LOCALES.includes(locale as any)
      ? locale
      : DEFAULT_LOCALE

  return {
    locale: resolvedLocale, // ✅ STRING, BUKAN undefined
    // teks dari Umira CMS, file JSON lokal sebagai cadangan
    messages: await getMessagesCms(
      resolvedLocale,
      (await import(`../message/${resolvedLocale}/${resolvedLocale}.json`)).default
    )
  }
})