export const algoliaConfig = {
  searchableAttributes: ['title', 'brand', 'description', 'tags', 'sku'],
  attributesForFaceting: [
    'filterOnly(gender)',
    'searchable(category)',
    'searchable(brand)',
    'colors',
    'sizes',
    'priceRange',
    'isNew',
    'isBestseller',
    'isSale',
  ],
  customRanking: ['desc(popularity)', 'desc(salesCount)', 'asc(price)'],
  replicas: [
    'pacsun_products_en_price_asc',
    'pacsun_products_en_price_desc',
    'pacsun_products_tr_price_asc',
    'pacsun_products_tr_price_desc',
  ],
};

export function getIndexName(locale: string): string {
  return `pacsun_products_${locale}`;
}

