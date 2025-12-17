import { ProductCard } from '@/components/molecules/ProductCard';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: {
    mobile?: 2 | 3;
    tablet?: 2 | 3 | 4;
    desktop?: 3 | 4 | 5 | 6;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  emptyMessage?: string;
}

function ProductGridSkeleton({ count = 8, columns }: { count?: number; columns?: ProductGridProps['columns'] }) {
  const gridCols = {
    mobile: columns?.mobile || 2,
    tablet: columns?.tablet || 3,
    desktop: columns?.desktop || 4,
  };

  const gridClass = cn(
    'grid gap-4',
    `grid-cols-${gridCols.mobile}`,
    `md:grid-cols-${gridCols.tablet}`,
    `lg:grid-cols-${gridCols.desktop}`
  );

  return (
    <div data-component="ProductGrid.Skeleton" className={gridClass}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton height={300} shape="rectangle" />
          <Skeleton height={20} shape="text" />
          <Skeleton height={16} shape="text" width="60%" />
        </div>
      ))}
    </div>
  );
}

export function ProductGrid({
  products,
  loading = false,
  columns = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  },
  gap = 'md',
  className,
  emptyMessage = 'No products found',
}: Readonly<ProductGridProps>) {
  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }[gap];

  const gridClass = cn(
    'grid',
    gapClass,
    `grid-cols-${columns.mobile || 2}`,
    `md:grid-cols-${columns.tablet || 3}`,
    `lg:grid-cols-${columns.desktop || 4}`,
    className
  );

  if (loading) {
    return <ProductGridSkeleton columns={columns} />;
  }

  if (products.length === 0) {
    return (
      <div
        data-component="ProductGrid.Empty"
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <p className="text-lg text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div data-component="ProductGrid" className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.sys.id} product={product} />
      ))}
    </div>
  );
}

