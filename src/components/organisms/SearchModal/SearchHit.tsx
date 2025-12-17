'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Highlight } from 'react-instantsearch';
import type { AlgoliaProductHit } from '@/lib/algolia/types';
import { useUIStore } from '@/store/useUIStore';

interface SearchHitProps {
  hit: AlgoliaProductHit;
  locale: string;
}

export function SearchHit({ hit, locale }: SearchHitProps) {
  const { closeSearchModal } = useUIStore();

  const discountPercentage = hit.discountPercentage || 0;
  const hasDiscount = discountPercentage > 0;

  return (
    <Link
      data-component="SearchHit"
      href={`/${locale}/product/${hit.slug}`}
      onClick={closeSearchModal}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
        {hit.imageUrl ? (
          <Image
            src={hit.imageUrl}
            alt={hit.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hit.isNew && (
            <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
      </div>

      <div data-component="SearchHit.Info">
        {/* Brand */}
        {hit.brand && (
          <p className="text-xs text-gray-600 mb-1">{hit.brand}</p>
        )}

        {/* Title with highlighting */}
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-600">
          <Highlight hit={hit} attribute="title" classNames={{ highlighted: 'bg-yellow-200' }} />
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">
            ${hit.price.toFixed(2)}
          </span>
          {hit.compareAtPrice && (
            <span className="text-xs text-gray-500 line-through">
              ${hit.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Colors */}
        {hit.colors && hit.colors.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {hit.colors.length} {hit.colors.length === 1 ? 'color' : 'colors'}
          </p>
        )}
      </div>
    </Link>
  );
}

