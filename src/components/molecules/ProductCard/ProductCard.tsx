'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { useTranslation } from '@/contexts/TranslationContext';
import { getImageUrl } from '@/lib/contentful/queries';
import type { Product } from '@/types/product';

const productCardVariants = cva(
  'group relative overflow-hidden rounded-lg transition-all bg-white',
  {
    variants: {
      variant: {
        default: 'hover:shadow-lg',
        compact: '',
        featured: 'bg-gradient-to-b from-gray-50 to-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ProductCardProps extends VariantProps<typeof productCardVariants> {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onLike?: (productId: string) => void;
  className?: string;
}

export function ProductCard({
  product,
  variant,
  onAddToCart,
  onLike,
  className,
}: ProductCardProps) {
  const t = useTranslation();
  const mainImage = product.fields.images?.[0];
  const imageUrl = mainImage ? getImageUrl(mainImage) : '/placeholder.jpg';

  return (
    <div
      data-component="ProductCard"
      data-variant={variant}
      className={cn(productCardVariants({ variant }), className)}
    >
      <Link
        href={`/product/${product.fields.slug}`}
        data-component="ProductCard.Link"
      >
        <div
          data-component="ProductCard.ImageWrapper"
          className="relative aspect-square overflow-hidden"
        >
          <Image
            data-component="ProductCard.Image"
            src={imageUrl}
            alt={product.fields.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.fields.isNew && (
            <div
              data-component="ProductCard.Badge"
              className="absolute top-2 left-2"
            >
              <Badge variant="success">{t('product.new')}</Badge>
            </div>
          )}
          {product.fields.isSale && (
            <div
              data-component="ProductCard.SaleBadge"
              className="absolute top-2 right-2"
            >
              <Badge variant="error">{t('product.sale')}</Badge>
            </div>
          )}
        </div>
      </Link>

      <div data-component="ProductCard.Info" className="p-4">
        <h3
          data-component="ProductCard.Title"
          className="text-foreground font-medium mb-1 line-clamp-2"
        >
          {product.fields.title}
        </h3>
        <p
          data-component="ProductCard.Price"
          className="text-foreground-subtle font-semibold mb-3"
        >
          ${product.fields.price.toFixed(2)}
        </p>
        <Button
          data-component="ProductCard.AddToCart"
          variant="primary"
          size="sm"
          fullWidth
          onClick={(e) => {
            e.preventDefault();
            onAddToCart?.(product);
          }}
        >
          {t('common.addToCart')}
        </Button>
      </div>
    </div>
  );
}

