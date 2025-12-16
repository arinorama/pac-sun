'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { useCartStore } from '@/store/useCartStore';
import { useFormatPrice } from '@/lib/currency/converter';
import { getImageUrl } from '@/lib/contentful/queries';
import type { Product } from '@/types/product';

interface ProductDetailTemplateProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailTemplate({
  product,
  relatedProducts = [],
}: ProductDetailTemplateProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const { addItem } = useCartStore();
  const formatPrice = useFormatPrice();

  const images = product.fields.images || [];
  const currentImage = images[selectedImageIndex];
  const imageUrl = currentImage ? getImageUrl(currentImage) : '/placeholder.jpg';

  const handleAddToCart = () => {
    addItem({
      id: product.sys.id,
      title: product.fields.title,
      price: product.fields.price,
      image: imageUrl,
      sku: product.fields.sku,
      size: selectedSize,
      color: selectedColor,
    });
  };

  return (
    <div
      data-component="ProductDetailTemplate"
      className="container mx-auto px-4 py-8"
    >
      <div
        data-component="ProductDetailTemplate.Content"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Image Gallery */}
        <div data-component="ProductDetailTemplate.Gallery">
          <div
            data-component="ProductDetailTemplate.MainImage"
            className="relative aspect-square mb-4"
          >
            <Image
              src={imageUrl}
              alt={product.fields.title}
              fill
              className="object-cover rounded-lg"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {images.length > 1 && (
            <div
              data-component="ProductDetailTemplate.Thumbnails"
              className="flex gap-2"
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  data-component="ProductDetailTemplate.Thumbnail"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded border-2 ${
                    selectedImageIndex === index
                      ? 'border-brand-black'
                      : 'border-transparent'
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${product.fields.title} ${index + 1}`}
                    fill
                    className="object-cover rounded"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div data-component="ProductDetailTemplate.Info">
          <h1
            data-component="ProductDetailTemplate.Title"
            className="text-3xl font-bold text-foreground mb-4"
          >
            {product.fields.title}
          </h1>

          <div
            data-component="ProductDetailTemplate.Price"
            className="text-2xl font-bold text-foreground mb-4"
          >
            {formatPrice(product.fields.price)}
            {product.fields.compareAtPrice && (
              <span className="text-lg text-foreground-subtle line-through ml-2">
                {formatPrice(product.fields.compareAtPrice)}
              </span>
            )}
          </div>

          {product.fields.isNew && (
            <Badge variant="success" className="mb-4">
              New
            </Badge>
          )}
          {product.fields.isSale && (
            <Badge variant="error" className="mb-4">
              Sale
            </Badge>
          )}

          {product.fields.sizes && product.fields.sizes.length > 0 && (
            <div data-component="ProductDetailTemplate.Size" className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Size
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.fields.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size
                        ? 'border-brand-black bg-brand-black text-brand-white'
                        : 'border-border hover:border-brand-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.fields.colors && product.fields.colors.length > 0 && (
            <div data-component="ProductDetailTemplate.Color" className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {product.fields.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded border-2 ${
                      selectedColor === color
                        ? 'border-brand-black'
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          <Button
            data-component="ProductDetailTemplate.AddToCart"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            className="mb-4"
          >
            Add to Cart
          </Button>

          {product.fields.description && (
            <div
              data-component="ProductDetailTemplate.Description"
              className="mt-8 text-foreground-subtle"
            >
              {/* Rich text rendering would go here */}
              <p>{JSON.stringify(product.fields.description)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

