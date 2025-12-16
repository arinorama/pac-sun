import { notFound } from 'next/navigation';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { Providers } from '@/app/providers';
import { getUITexts } from '@/lib/contentful/queries';
import type { ReactNode } from 'react';

const locales = ['en', 'tr'];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const uiTexts = await getUITexts(locale);

  return (
    <html lang={locale}>
      <body>
        <Providers>
          <TranslationProvider texts={uiTexts}>{children}</TranslationProvider>
        </Providers>
      </body>
    </html>
  );
}

