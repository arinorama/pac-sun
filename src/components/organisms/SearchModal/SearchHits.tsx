'use client';

import { useHits, useInstantSearch } from 'react-instantsearch';
import { SearchHit } from './SearchHit';
import type { AlgoliaProductHit } from '@/lib/algolia/types';
import { Spinner } from '@/components/atoms/Spinner';

interface SearchHitsProps {
  locale: string;
}

export function SearchHits({ locale }: SearchHitsProps) {
  const { hits } = useHits<AlgoliaProductHit>();
  const { status } = useInstantSearch();

  const isSearching = status === 'loading' || status === 'stalled';

  if (isSearching) {
    return (
      <div data-component="SearchHits.Loading" className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div data-component="SearchHits.Empty" className="text-center py-12 px-6">
        <p className="text-gray-500">
          {locale === 'tr'
            ? 'Sonuç bulunamadı. Farklı bir arama deneyin.'
            : 'No results found. Try a different search.'}
        </p>
      </div>
    );
  }

  return (
    <div
      data-component="SearchHits"
      className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4"
    >
      {hits.map((hit) => (
        <SearchHit key={hit.objectID} hit={hit} locale={locale} />
      ))}
    </div>
  );
}

