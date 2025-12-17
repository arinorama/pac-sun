// Algolia product record type
export interface AlgoliaProduct {
  objectID: string;
  title: string;
  slug: string;
  sku?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  discountPercentage?: number;
  category?: string;
  categorySlug?: string;
  brand?: string;
  brandSlug?: string;
  colors?: string[];
  sizes?: string[];
  gender?: 'men' | 'women' | 'unisex';
  imageUrl?: string;
  images?: string[];
  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  tags?: string[];
  stockQuantity?: number;
  locale: string;
  popularity?: number;
  createdAt?: number;
  updatedAt?: number;
}

// Search hit type (includes Algolia metadata)
export interface AlgoliaProductHit extends AlgoliaProduct {
  _highlightResult?: {
    title?: { value: string; matchLevel: string };
    brand?: { value: string; matchLevel: string };
    category?: { value: string; matchLevel: string };
  };
  _snippetResult?: {
    description?: { value: string };
  };
}

// Query suggestion type
export interface AlgoliaQuerySuggestion {
  objectID: string;
  query: string;
  popularity: number;
  locale: string;
}

