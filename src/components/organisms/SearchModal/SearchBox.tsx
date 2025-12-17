'use client';

import { useSearchBox } from 'react-instantsearch';
import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SearchBoxProps {
  locale: string;
  onClear?: () => void;
}

export function SearchBox({ locale, onClear }: SearchBoxProps) {
  const { query, refine } = useSearchBox();
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholder =
    locale === 'tr' ? 'Ürün, marka veya kategori ara...' : 'Search products, brands, categories...';

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClear = () => {
    refine('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div data-component="SearchBox" className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      <input
        ref={inputRef}
        data-component="SearchBox.Input"
        type="text"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-4 text-base border-0 border-b border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
        autoComplete="off"
        spellCheck={false}
      />

      {query && (
        <button
          data-component="SearchBox.ClearButton"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      )}
    </div>
  );
}

