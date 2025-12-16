'use client';

import { getProducts } from '@/lib/contentful/queries';
import type { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { ProductCard } from '@/components/molecules/ProductCard';

interface ProductCarouselFields {
  title?: string;
  subtitle?: string;
  products?: Product[];
  category?: { sys: { id: string } };
  limit?: number;
}

interface ProductCarouselProps {
  carousel: {
    fields: ProductCarouselFields;
  };
  locale?: string;
}

export function ProductCarousel({
  carousel,
  locale = 'en',
}: ProductCarouselProps) {
  const fields = carousel.fields;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        // If specific products are provided, use them
        if (fields.products && fields.products.length > 0) {
          setProducts(fields.products as Product[]);
          return;
        }

        // Otherwise, fetch by category or get featured products
        const categoryId = fields.category?.sys.id;
        const limit = fields.limit || 8;

        const fetchedProducts = await getProducts(locale, categoryId, limit);
        setProducts(fetchedProducts as Product[]);
      } catch (error) {
        console.error('Error loading products for carousel:', error);
      }
    }

    loadProducts();
  }, [fields.products, fields.category, fields.limit, locale]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      data-component="ProductCarousel"
      className="my-5 px-md-5 px-3"
    >
      <SectionHeader
        title={fields.title}
        subtitle={fields.subtitle}
        className="mb-4"
      />
      <div
        data-component="ProductCarousel.Grid"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {products.map((product) => (
          <ProductCard
            key={product.sys.id}
            product={product}
            data-component="ProductCarousel.ProductCard"
          />
        ))}
      </div>
    </section>
  );
}

