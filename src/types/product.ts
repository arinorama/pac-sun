import type { Entry, Asset } from 'contentful';

export interface ProductFields {
  internalName: string;
  title: string;
  slug: string;
  sku: string;
  description?: {
    nodeType: string;
    content: unknown[];
  };
  price: number;
  compareAtPrice?: number;
  images: Asset[];
  category: Entry<CategoryFields>;
  brand?: Entry<BrandFields>;
  colors?: string[];
  sizes?: string[];
  colorCode?: string;
  gender?: 'men' | 'women' | 'unisex';
  tags?: string[];
  stockQuantity: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isSale?: boolean;
}

export interface CategoryFields {
  title: string;
  slug: string;
  description?: string;
  image?: Asset;
  parentCategory?: Entry<CategoryFields>;
  order?: number;
}

export interface BrandFields {
  name: string;
  slug: string;
}

export type Product = Entry<ProductFields>;
export type Category = Entry<CategoryFields>;
export type Brand = Entry<BrandFields>;

