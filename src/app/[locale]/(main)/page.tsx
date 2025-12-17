import { getPageBySlug } from '@/lib/contentful/queries';
import { HomeTemplate } from '@/components/templates/HomeTemplate';
import { locales } from '@/lib/i18n/config';

// ISR: Revalidate every 5 minutes as fallback
// Primary revalidation happens via webhooks (on-demand)
export const revalidate = 300;

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default async function HomePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const page = await getPageBySlug('home', locale);

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Homepage not found</h1>
        <p>Please create a page with slug "home" in Contentful.</p>
      </div>
    );
  }

  return <HomeTemplate page={page} locale={locale} />;
}

