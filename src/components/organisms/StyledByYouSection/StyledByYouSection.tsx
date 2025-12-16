'use client';

import Link from 'next/link';
import { ProductGrid } from '@/components/organisms/ProductGrid';
import type { Entry } from 'contentful';
import type { Product } from '@/types/product';

interface StyledByYouSectionFields {
  title: string;
  subtitle?: string;
  products?: Entry<unknown>[];
  category?: Entry<unknown>;
  limit?: number;
}

interface StyledByYouSectionProps {
  section: Entry<StyledByYouSectionFields>;
  locale?: string;
}

export function StyledByYouSection({
  section,
  locale = 'en',
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
        <div
          data-component="StyledByYouSection.Header"
          className="text-center mb-8"
        >
          <h2
            data-component="StyledByYouSection.Title"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {fields.title}
          </h2>
          {fields.subtitle && (
            <p
              data-component="StyledByYouSection.Subtitle"
              className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
            >
              {fields.subtitle}
            </p>
          )}
        </div>
        <ProductGrid products={displayedProducts} />
        {fields.category && (
          <div
            data-component="StyledByYouSection.Footer"
            className="text-center mt-8"
          >
            <Link
              data-component="StyledByYouSection.ViewAll"
              href={`/${locale}/category/${(fields.category as any).fields?.slug?.[locale] || ''}`}
              className="inline-block border-2 border-gray-900 px-8 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              View All
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

