import Image from 'next/image';
import NextLink from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { Card } from '@/components/atoms/Card';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import type { Product } from '@/types/product';
import { cn } from '@/lib/utils';

const productCardVariants = cva('group', {
  variants: {
    layout: {
      default: '',
      compact: '',
      featured: '',
    },
    imageAspectRatio: {
      portrait: 'aspect-[3/4]',
      square: 'aspect-square',
      landscape: 'aspect-video',
    },
    priceDisplay: {
      show: '',
      hide: '',
    },
  },
  defaultVariants: {
    layout: 'default',
    imageAspectRatio: 'portrait',
    priceDisplay: 'show',
  },
});

const productCardImageVariants = cva('relative w-full overflow-hidden mb-2', {
  variants: {
    layout: {
      default: '',
      compact: 'mb-1',
      featured: 'mb-3',
    },
    imageAspectRatio: {
      portrait: 'aspect-[3/4]',
      square: 'aspect-square',
      landscape: 'aspect-video',
    },
  },
  defaultVariants: {
    layout: 'default',
    imageAspectRatio: 'portrait',
  },
});

const productCardContentVariants = cva('', {
  variants: {
    layout: {
      default: '',
      compact: 'space-y-0.5',
      featured: 'space-y-2',
    },
  },
  defaultVariants: {
    layout: 'default',
  },
});

interface ProductCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof productCardVariants> {
  product: Product;
  className?: string;
  showPrice?: boolean;
}

export function ProductCard({
  product,
  className,
  showPrice = true,
  layout = 'default',
  imageAspectRatio = 'portrait',
  priceDisplay,
  ...props
}: Readonly<ProductCardProps>) {
  const productFields = product.fields as {
    images?: Array<{ fields?: { file?: { url?: string } } }>;
    name?: string;
    title?: string;
    price?: number;
    slug?: string;
  };

  const imageUrl = productFields.images?.[0]?.fields?.file?.url;
  const name = productFields.name || productFields.title || '';
  const price = productFields.price;
  const slug = productFields.slug || '#';
  
  // Determine if price should be shown
  const shouldShowPrice = priceDisplay === 'show' || (priceDisplay !== 'hide' && showPrice);

  return (
    <Card
      data-component="ProductCard"
      data-layout={layout}
      data-image-aspect-ratio={imageAspectRatio}
      variant="default"
      className={cn(productCardVariants({ layout, imageAspectRatio, priceDisplay: shouldShowPrice ? 'show' : 'hide' }), className)}
      {...props}
    >
      <NextLink href={slug} className="block">
        {imageUrl && (
          <div className={cn(productCardImageVariants({ layout, imageAspectRatio }))}>
            <Image
              data-component="ProductCard.Image"
              src={`https:${imageUrl}`}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        )}
        <div className={cn(productCardContentVariants({ layout }))}>
          <Heading
            data-component="ProductCard.Name"
            level="h3"
            className={cn(
              'font-normal mb-1 line-clamp-2',
              layout === 'compact' && 'text-xs mb-0.5',
              layout === 'featured' && 'text-base mb-2'
            )}
          >
            {name}
          </Heading>
          {shouldShowPrice && price !== undefined && (
            <Text
              data-component="ProductCard.Price"
              variant="bodySm"
              weight="bold"
              className={cn(
                layout === 'compact' && 'text-xs',
                layout === 'featured' && 'text-base'
              )}
            >
              ${price}
            </Text>
          )}
        </div>
      </NextLink>
    </Card>
  );
}

