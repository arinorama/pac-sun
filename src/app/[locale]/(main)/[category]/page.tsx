import { getProducts, getCategoryBySlug } from '@/lib/contentful/queries';
import { ProductListTemplate } from '@/components/templates/ProductListTemplate';

export default async function CategoryPage({
  params,
}: {
  params: { locale: string; category: string };
}) {
  const { locale, category: categorySlug } = await params;

  const category = await getCategoryBySlug(categorySlug, locale);
  const products = await getProducts(
    locale,
    category?.sys.id,
    100
  );

  return (
    <ProductListTemplate
      products={products}
      category={category || undefined}
    />
  );
}

