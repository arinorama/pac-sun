'use client';

import { ProductCard } from '@/components/molecules/ProductCard';
import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.sys.id,
      title: product.fields.title,
      price: product.fields.price,
      image: product.fields.images?.[0]
        ? `https:${product.fields.images[0].fields.file.url}`
        : '',
      sku: product.fields.sku,
    });
  };

  if (products.length === 0) {
    return (
      <div
        data-component="ProductGrid.Empty"
        className="text-center py-12 text-foreground-subtle"
      >
        No products found
      </div>
    );
  }

  return (
    <div
      data-component="ProductGrid"
      className={className}
    >
      <div
        data-component="ProductGrid.Container"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <ProductCard
            key={product.sys.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

