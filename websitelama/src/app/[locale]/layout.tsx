
import { Manrope } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/layout/client-layout";
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'

const locales = ['id', 'en'];


const manrope = Manrope({ subsets: ["latin"] });
export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}


export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
 params: Promise<{ locale: string }>
}) {
   const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
    
  }
   const messages = await getMessages({locale});
   console.log("init",locale);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={manrope.className}>
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
