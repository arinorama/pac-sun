import { ProductGrid } from '@/components/organisms/ProductGrid';
import type { Product, Category } from '@/types/product';

interface ProductListTemplateProps {
  products: Product[];
  category?: Category;
  className?: string;
}

export function ProductListTemplate({
  products,
  category,
  className,
}: ProductListTemplateProps) {
  return (
    <div data-component="ProductListTemplate" className={className}>
      {category && (
        <div
          data-component="ProductListTemplate.Header"
          className="mb-8"
        >
          <h1
            data-component="ProductListTemplate.Title"
            className="text-3xl font-bold text-foreground mb-2"
          >
            {category.fields.title}
          </h1>
          {category.fields.description && (
            <p
              data-component="ProductListTemplate.Description"
              className="text-foreground-subtle"
            >
              {category.fields.description}
            </p>
          )}
        </div>
      )}
      <ProductGrid products={products} />
    </div>
  );
}

