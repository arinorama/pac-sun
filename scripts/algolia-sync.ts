// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file BEFORE any other imports
config({ path: resolve(process.cwd(), '.env.local') });

// Now import after env vars are loaded
import { createClient } from 'contentful';
import algoliasearch from 'algoliasearch';
import type { Asset } from 'contentful';
import { getIndexName } from '../src/lib/algolia/config';

// Helper function to get image URL (copied from queries.ts to avoid importing client.ts)
function getImageUrl(asset: Asset | undefined): string {
  if (!asset?.fields?.file) return '';
  return `https:${asset.fields.file.url}`;
}

// Create clients with environment variables
const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

const adminClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);

interface AlgoliaProduct {
  objectID: string;
  title: string;
  slug: string;
  sku: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  images?: string[];
  category?: string;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  gender?: string;
  tags?: string[];
  isNew: boolean;
  isBestseller: boolean;
  isSale: boolean;
  stockQuantity: number;
  locale: string;
}

async function transformProduct(product: any, locale: string): Promise<AlgoliaProduct> {
  const fields = product.fields;
  const images = fields.images || [];
  
  return {
    objectID: `${product.sys.id}_${locale}`,
    title: fields.title || '',
    slug: fields.slug || '',
    sku: fields.sku || '',
    description: fields.description ? JSON.stringify(fields.description) : undefined,
    price: fields.price || 0,
    compareAtPrice: fields.compareAtPrice,
    image: images[0] ? getImageUrl(images[0]) : undefined,
    images: images.map((img: any) => getImageUrl(img)),
    category: fields.category?.fields?.title || '',
    brand: fields.brand?.fields?.name || '',
    colors: fields.colors || [],
    sizes: fields.sizes || [],
    gender: fields.gender,
    tags: fields.tags || [],
    isNew: fields.isNew || false,
    isBestseller: fields.isBestseller || false,
    isSale: fields.isSale || false,
    stockQuantity: fields.stockQuantity || 0,
    locale,
  };
}

async function syncLocale(locale: string) {
  const contentfulLocale = locale === 'en' ? 'en-US' : 'tr-TR';
  const indexName = getIndexName(locale);
  const index = adminClient.initIndex(indexName);

  console.log(`Syncing ${locale} products to ${indexName}...`);

  // Fetch all products
  let skip = 0;
  const limit = 100;
  let allProducts: AlgoliaProduct[] = [];

  while (true) {
    const response = await contentfulClient.getEntries({
      content_type: 'product',
      locale: contentfulLocale,
      skip,
      limit,
      include: 2,
    });

    const products = await Promise.all(
      response.items.map((item) => transformProduct(item, locale))
    );
    allProducts = [...allProducts, ...products];

    if (response.items.length < limit) {
      break;
    }
    skip += limit;
  }

  console.log(`Found ${allProducts.length} products for ${locale}`);

  // Save to Algolia
  await index.saveObjects(allProducts);
  console.log(`Synced ${allProducts.length} products to ${indexName}`);

  // Configure index settings
  await index.setSettings({
    searchableAttributes: ['title', 'brand', 'description', 'tags', 'sku'],
    attributesForFaceting: [
      'filterOnly(gender)',
      'searchable(category)',
      'searchable(brand)',
      'colors',
      'sizes',
      'isNew',
      'isBestseller',
      'isSale',
    ],
  });
}

async function main() {
  try {
    console.log('Starting Algolia sync...');
    await syncLocale('en');
    await syncLocale('tr');
    console.log('Algolia sync completed!');
  } catch (error) {
    console.error('Algolia sync failed:', error);
    process.exit(1);
  }
}

main();

