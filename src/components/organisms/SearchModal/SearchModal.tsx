'use client';

import { useEffect, useState, useRef } from 'react';
import { InstantSearch, Configure, useSearchBox } from 'react-instantsearch';
import { X } from 'lucide-react';
import { searchClient } from '@/lib/algolia/client';
import { getProductsIndexName } from '@/lib/algolia/config';
import { useUIStore } from '@/store/useUIStore';
import { SearchBox } from './SearchBox';
import { SearchHits } from './SearchHits';
import { TopSuggestions } from './TopSuggestions';

interface SearchModalProps {
  locale: string;
}

// Inner component to access InstantSearch context
function SearchModalContent({ locale }: { locale: string }) {
  const { closeSearchModal } = useUIStore();
  const { query, refine } = useSearchBox();

  const handleSuggestionClick = (suggestion: string) => {
    refine(suggestion);
  };

  return (
    <>
      {/* Header */}
      <div data-component="SearchModal.Header" className="flex items-center border-b border-gray-200 bg-white">
        <div className="flex-1">
          <SearchBox locale={locale} onClear={() => refine('')} />
        </div>
        <button
          data-component="SearchModal.CloseButton"
          onClick={closeSearchModal}
          className="p-4 hover:bg-gray-100 transition-colors"
          aria-label="Close search"
        >
          <X className="w-6 h-6 text-gray-900" />
        </button>
      </div>

      {/* Content - Two Column Layout */}
      <div
        data-component="SearchModal.Content"
        className="flex overflow-hidden bg-white"
        style={{ maxHeight: 'calc(100vh - 64px)' }}
      >
        {/* Left Sidebar - Top Suggestions */}
        <div
          data-component="SearchModal.Sidebar"
          className="w-64 border-r border-gray-200 overflow-y-auto flex-shrink-0"
        >
          <TopSuggestions
            locale={locale}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>

        {/* Right Content - Search Results */}
        <div
          data-component="SearchModal.Results"
          className="flex-1 overflow-y-auto"
        >
          <SearchHits locale={locale} />
        </div>
      </div>
    </>
  );
}

export function SearchModal({ locale }: SearchModalProps) {
  const { isSearchModalOpen, closeSearchModal } = useUIStore();
  const [mounted, setMounted] = useState(false);

  const indexName = getProductsIndexName(locale);

  // Handle mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchModalOpen) {
        closeSearchModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchModalOpen, closeSearchModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isSearchModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchModalOpen]);

  if (!mounted || !isSearchModalOpen) {
    return null;
  }

  return (
    <div data-component="SearchModal">
      {/* Backdrop */}
      <div
        data-component="SearchModal.Backdrop"
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={closeSearchModal}
      />

      {/* Modal - Full Width, Attached to Header */}
      <div
        data-component="SearchModal.Container"
        className="fixed inset-x-0 top-0 z-50 bg-white shadow-2xl animate-in slide-in-from-top duration-200 overflow-hidden"
      >
        <InstantSearch
          searchClient={searchClient}
          indexName={indexName}
          future={{
            preserveSharedStateOnUnmount: false,
          }}
        >
          <Configure
            hitsPerPage={12}
            analytics={false}
            enablePersonalization={false}
            distinct
          />

          <SearchModalContent locale={locale} />
        </InstantSearch>
      </div>
    </div>
  );
}

