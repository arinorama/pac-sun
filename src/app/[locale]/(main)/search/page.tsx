'use client';

import { InstantSearch, SearchBox, Hits, Pagination } from 'react-instantsearch';
import { searchClient } from '@/lib/algolia/client';
import { getIndexName } from '@/lib/algolia/config';
import { FilterPanel } from '@/components/organisms/FilterPanel';
import { ProductCard } from '@/components/molecules/ProductCard';
import { usePathname } from 'next/navigation';
import type { Product } from '@/types/product';

function Hit({ hit }: { hit: any }) {
  // Transform Algolia hit to Product-like object
  const product: Product = {
    sys: { id: hit.objectID, type: 'Entry', createdAt: '', updatedAt: '', revision: 0, contentType: { sys: { id: 'product', type: 'Link', linkType: 'ContentType' } } },
    fields: {
      title: hit.title,
      slug: hit.slug,
      sku: hit.sku,
      price: hit.price,
      compareAtPrice: hit.compareAtPrice,
      images: hit.images?.map((url: string) => ({
        sys: { id: '', type: 'Asset', createdAt: '', updatedAt: '', revision: 0 },
        fields: {
          file: { url: url.replace('https:', ''), contentType: 'image/jpeg', fileName: '', details: { size: 0, image: { width: 0, height: 0 } } },
          title: hit.title,
        },
      })) || [],
      isNew: hit.isNew,
      isBestseller: hit.isBestseller,
      isSale: hit.isSale,
      stockQuantity: hit.stockQuantity,
      category: hit.category ? { sys: { id: '', type: 'Entry' }, fields: { title: hit.category } } : undefined,
      brand: hit.brand ? { sys: { id: '', type: 'Entry' }, fields: { name: hit.brand } } : undefined,
      colors: hit.colors,
      sizes: hit.sizes,
      gender: hit.gender,
      tags: hit.tags,
    },
  } as Product;

  return <ProductCard product={product} />;
}

export default function SearchPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const indexName = getIndexName(locale);

  return (
    <div
      data-component="SearchPage"
      className="container mx-auto px-4 py-8"
    >
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <div
          data-component="SearchPage.Header"
          className="mb-8"
        >
          <h1
            data-component="SearchPage.Title"
            className="text-3xl font-bold mb-4"
          >
            Search Products
          </h1>
          <SearchBox
            placeholder="Search for products..."
            className="w-full"
          />
        </div>

        <div
          data-component="SearchPage.Content"
          className="flex gap-8"
        >
          <aside
            data-component="SearchPage.Filters"
            className="hidden md:block"
          >
            <FilterPanel />
          </aside>

          <main
            data-component="SearchPage.Results"
            className="flex-1"
          >
            <Hits
              hitComponent={Hit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            />
            <div
              data-component="SearchPage.Pagination"
              className="mt-8 flex justify-center"
            >
              <Pagination />
            </div>
          </main>
        </div>
      </InstantSearch>
    </div>
  );
}

