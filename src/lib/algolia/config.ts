// Algolia index names
export const ALGOLIA_INDEXES = {
  PRODUCTS_EN: 'pacsun_products_en',
  PRODUCTS_TR: 'pacsun_products_tr',
  QUERY_SUGGESTIONS_EN: 'pacsun_query_suggestions_en',
  QUERY_SUGGESTIONS_TR: 'pacsun_query_suggestions_tr',
} as const;

// Get index name by locale
export function getProductsIndexName(locale: string): string {
  return locale === 'tr' ? ALGOLIA_INDEXES.PRODUCTS_TR : ALGOLIA_INDEXES.PRODUCTS_EN;
}

// Algolia search settings
export const SEARCH_SETTINGS = {
  // Searchable attributes (in order of importance)
  searchableAttributes: [
    'title',
    'brand',
    'category',
    'tags',
    'description',
    'colors',
  ],
  
  // Attributes for faceting (filtering)
  attributesForFaceting: [
    'filterOnly(locale)',
    'searchable(category)',
    'searchable(brand)',
    'colors',
    'sizes',
    'gender',
    'isNew',
    'isSale',
    'isBestseller',
  ],
  
  // Custom ranking (after text relevance)
  customRanking: [
    'desc(isBestseller)',
    'desc(isNew)',
    'desc(popularity)',
    'asc(price)',
  ],
  
  // Highlighting
  attributesToHighlight: ['title', 'brand', 'category'],
  
  // Snippeting
  attributesToSnippet: ['description:20'],
  
  // Pagination
  hitsPerPage: 20,
  maxValuesPerFacet: 100,
  
  // Typo tolerance
  typoTolerance: true,
  minWordSizefor1Typo: 4,
  minWordSizefor2Typos: 8,
  
  // Query rules
  enableRules: true,
  
  // Filtering
  removeWordsIfNoResults: 'lastWords' as const,
};

