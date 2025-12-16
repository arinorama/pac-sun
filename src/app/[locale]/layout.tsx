import { notFound } from 'next/navigation';
import { Poppins } from 'next/font/google';
import { Providers } from '@/app/providers';
import { locales } from '@/lib/i18n/config';
import type { ReactNode } from 'react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!locales.includes(locale as never)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`font-sans ${poppins.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

