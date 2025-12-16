import { getProductBySlug, getProducts } from '@/lib/contentful/queries';
import { ProductDetailTemplate } from '@/components/templates/ProductDetailTemplate';
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = await params;

  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  // Get related products from same category
  const relatedProducts = await getProducts(
    locale,
    product.fields.category?.sys.id,
    4
  );

  return (
    <ProductDetailTemplate
      product={product}
      relatedProducts={relatedProducts.filter((p) => p.sys.id !== product.sys.id).slice(0, 4)}
    />
  );
}

