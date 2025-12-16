'use client';

import type { Product } from '@/types/product';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { ProductCard } from '@/components/molecules/ProductCard';

interface StyledByYouSectionFields {
  title?: string;
  subtitle?: string;
  products?: Product[];
  limit?: number;
}

interface StyledByYouSectionProps {
  section: {
    fields: StyledByYouSectionFields;
  };
  locale?: string;
}

export function StyledByYouSection({
  section,
  locale: _locale = 'en',
}: StyledByYouSectionProps) {
  const fields = section.fields;
  const products = (fields.products || []) as Product[];
  const limit = fields.limit || 4;

  if (products.length === 0) {
    return null;
  }

  const displayedProducts = products.slice(0, limit);

  return (
    <section
      data-component="StyledByYouSection"
      className="w-full bg-white py-12 md:py-16"
    >
      <div
        data-component="StyledByYouSection.Container"
        className="container mx-auto px-4"
      >
        <SectionHeader
          title={fields.title}
          subtitle={fields.subtitle}
          className="mb-8"
          titleClassName="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          subtitleClassName="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.sys.id}
              product={product}
              data-component="StyledByYouSection.ProductCard"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

