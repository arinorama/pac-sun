'use client';

import { ProductCard } from '@/components/molecules/ProductCard';
import { useCartStore } from '@/store/useCartStore';
import { getProducts } from '@/lib/contentful/queries';
import type { Entry } from 'contentful';
import type { Product } from '@/types/product';
import { useEffect, useState } from 'react';

interface ProductCarouselFields {
  title: string;
  subtitle?: string;
  products?: Entry<unknown>[];
  category?: Entry<unknown>;
  limit?: number;
}

interface ProductCarouselProps {
  carousel: Entry<ProductCarouselFields>;
  locale?: string;
}

export function ProductCarousel({
  carousel,
  locale = 'en',
}: ProductCarouselProps) {
  const fields = carousel.fields;
  const { addItem } = useCartStore();
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
        const categoryId = fields.category
          ? (fields.category as Entry<unknown>).sys.id
          : undefined;
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
      <div className="text-center mb-4">
        <h2
          data-component="ProductCarousel.Title"
          className="font-normal uppercase"
        >
          {fields.title}
        </h2>
        {fields.subtitle && (
          <p
            data-component="ProductCarousel.Subtitle"
            className="mt-2"
          >
            {fields.subtitle}
          </p>
        )}
      </div>
      <div
        data-component="ProductCarousel.Grid"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {products.map((product) => (
          <ProductCard
            key={product.sys.id}
            product={product}
            onAddToCart={addItem}
          />
        ))}
      </div>
    </section>
  );
}

