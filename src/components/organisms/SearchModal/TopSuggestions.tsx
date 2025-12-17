'use client';

interface TopSuggestionsProps {
  locale: string;
  onSuggestionClick: (query: string) => void;
}

const suggestions = {
  en: [
    'ankle socks',
    'hoodies',
    'vintage wash',
    'graphic tees',
    'denim jeans',
    'accessories',
  ],
  tr: [
    'patik çorap',
    'hoodie',
    'vintage yıkama',
    'grafik tişört',
    'denim pantolon',
    'aksesuarlar',
  ],
};

export function TopSuggestions({ locale, onSuggestionClick }: TopSuggestionsProps) {
  const localeSuggestions = locale === 'tr' ? suggestions.tr : suggestions.en;
  const title = locale === 'tr' ? 'Popüler Aramalar' : 'Top Suggestions';

  return (
    <div data-component="TopSuggestions" className="p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-1">
        {localeSuggestions.map((suggestion) => (
          <li key={suggestion}>
            <button
              data-component="TopSuggestions.Button"
              onClick={() => onSuggestionClick(suggestion)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded"
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

