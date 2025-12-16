import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { HeaderPromoCarousel } from '@/components/organisms/HeaderPromoCarousel';
import { getHeaderPromoCarousel, getSiteHeader } from '@/lib/contentful/queries';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PacSun MVP - Modern Fashion',
  description: 'Shop the latest fashion trends at PacSun MVP',
  openGraph: {
    title: 'PacSun MVP',
    description: 'Shop the latest fashion trends',
    type: 'website',
  },
};

export default async function MainLayout({ 
  children,
  params,
}: { 
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const headerPromoCarousel = await getHeaderPromoCarousel(locale);
  const siteHeader = await getSiteHeader(locale);

  return (
    <div data-component="MainLayout" className="flex flex-col min-h-screen">
      {headerPromoCarousel && <HeaderPromoCarousel carousel={headerPromoCarousel} />}
      <Header headerData={siteHeader || undefined} />
      <main data-component="MainLayout.Content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
