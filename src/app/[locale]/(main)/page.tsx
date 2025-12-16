import { getPageBySlug } from '@/lib/contentful/queries';
import { HomeTemplate } from '@/components/templates/HomeTemplate';

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
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

