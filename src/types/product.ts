import type { Asset } from 'contentful';

export interface ProductFields {
  internalName?: string;
  title?: string;
  slug?: string;
  sku?: string;
  description?: {
    nodeType: string;
    content: unknown[];
  };
  price?: number;
  compareAtPrice?: number;
  images?: Asset[];
  category?: { sys: { id: string } };
  brand?: { sys: { id: string } };
  colors?: string[];
  sizes?: string[];
  colorCode?: string;
  gender?: 'men' | 'women' | 'unisex';
  tags?: string[];
  stockQuantity?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isSale?: boolean;
}

export interface CategoryFields {
  title?: string;
  slug?: string;
  description?: string;
  image?: Asset;
  parentCategory?: { sys: { id: string } };
  order?: number;
}

export interface BrandFields {
  name?: string;
  slug?: string;
}

export interface Product {
  sys: { id: string };
  fields: ProductFields;
}

export interface Category {
  sys: { id: string };
  fields: CategoryFields;
}

export interface Brand {
  sys: { id: string };
  fields: BrandFields;
}

