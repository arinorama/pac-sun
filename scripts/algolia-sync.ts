import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { createClient } from 'contentful';
import algoliasearch from 'algoliasearch';
import type { Asset } from 'contentful';
import type { AlgoliaProduct } from '../src/lib/algolia/types';
import { ALGOLIA_INDEXES, SEARCH_SETTINGS } from '../src/lib/algolia/config';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN!;
const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY!;

interface ProductFields {
  internalName?: string;
  title?: string;
  slug?: string;
  sku?: string;
  description?: {
    nodeType: string;
    content: Array<{ content: Array<{ value: string }> }>;
  };
  price?: number;
  compareAtPrice?: number;
  images?: Asset[];
  category?: { sys: { id: string } };
  brand?: { sys: { id: string } };
  colors?: string[];
  sizes?: string[];
  gender?: 'men' | 'women' | 'unisex';
  tags?: string[];
  stockQuantity?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isSale?: boolean;
}

// Helper to get image URL
function getImageUrl(asset: Asset | undefined): string {
  if (!asset?.fields?.file) return '';
  return `https:${asset.fields.file.url}`;
}

// Helper to extract plain text from rich text
function getRichTextPlainText(richText: ProductFields['description']): string {
  if (!richText?.content) return '';
  
  return richText.content
    .map((block) =>
      block.content?.map((node) => node.value || '').join(' ') || ''
    )
    .join(' ')
    .trim();
}

// Transform Contentful product to Algolia record
function transformProductToAlgoliaRecord(
  product: { sys: { id: string }; fields: ProductFields },
  locale: string
): AlgoliaProduct {
  const fields = product.fields;
  
  // Calculate discount percentage
  const discountPercentage =
    fields.compareAtPrice && fields.price
      ? Math.round(((fields.compareAtPrice - fields.price) / fields.compareAtPrice) * 100)
      : undefined;

  // Get all image URLs
  const images = fields.images?.map((img) => getImageUrl(img)).filter(Boolean) || [];

  // Calculate popularity score (for ranking)
  let popularity = 50; // Base score
  if (fields.isBestseller) popularity += 30;
  if (fields.isNew) popularity += 20;
  if (fields.isSale) popularity += 10;

  return {
    objectID: product.sys.id,
    title: fields.title || '',
    slug: fields.slug || '',
    sku: fields.sku,
    description: getRichTextPlainText(fields.description),
    price: fields.price || 0,
    compareAtPrice: fields.compareAtPrice,
    discountPercentage,
    // Note: We'll need to resolve category/brand later if needed
    colors: fields.colors || [],
    sizes: fields.sizes || [],
    gender: fields.gender,
    imageUrl: images[0] || '',
    images,
    isNew: fields.isNew || false,
    isSale: fields.isSale || false,
    isBestseller: fields.isBestseller || false,
    tags: fields.tags || [],
    stockQuantity: fields.stockQuantity,
    locale,
    popularity,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// Main sync logic with top-level await
try {
  // eslint-disable-next-line no-console
  console.log('Starting Algolia sync...\n');

  // Initialize clients
  const contentfulClient = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  });

  const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

  // Sync EN products
  // eslint-disable-next-line no-console
  console.log('Syncing EN products...');
  const enProducts = await contentfulClient.getEntries({
    content_type: 'product',
    locale: 'en-US',
    limit: 1000,
    include: 2,
  });

  const enRecords = enProducts.items.map((product) =>
    transformProductToAlgoliaRecord(
      product as { sys: { id: string }; fields: ProductFields },
      'en'
    )
  );

  const enIndex = algoliaClient.initIndex(ALGOLIA_INDEXES.PRODUCTS_EN);
  
  // Configure index settings
  await enIndex.setSettings(SEARCH_SETTINGS);
  
  // Save records
  await enIndex.saveObjects(enRecords, {
    autoGenerateObjectIDIfNotExist: false,
  });
  
  // eslint-disable-next-line no-console
  console.log(`   Synced ${enRecords.length} EN products\n`);

  // Sync TR products
  // eslint-disable-next-line no-console
  console.log('Syncing TR products...');
  const trProducts = await contentfulClient.getEntries({
    content_type: 'product',
    locale: 'tr-TR',
    limit: 1000,
    include: 2,
  });

  const trRecords = trProducts.items.map((product) =>
    transformProductToAlgoliaRecord(
      product as { sys: { id: string }; fields: ProductFields },
      'tr'
    )
  );

  const trIndex = algoliaClient.initIndex(ALGOLIA_INDEXES.PRODUCTS_TR);
  
  // Configure index settings
  await trIndex.setSettings(SEARCH_SETTINGS);
  
  // Save records
  await trIndex.saveObjects(trRecords, {
    autoGenerateObjectIDIfNotExist: false,
  });
  
  // eslint-disable-next-line no-console
  console.log(`   Synced ${trRecords.length} TR products\n`);

  // Summary
  // eslint-disable-next-line no-console
  console.log('Summary:');
  // eslint-disable-next-line no-console
  console.log(`   EN Index: ${ALGOLIA_INDEXES.PRODUCTS_EN}`);
  // eslint-disable-next-line no-console
  console.log(`   TR Index: ${ALGOLIA_INDEXES.PRODUCTS_TR}`);
  // eslint-disable-next-line no-console
  console.log(`   Total Records: ${enRecords.length + trRecords.length}\n`);
  // eslint-disable-next-line no-console
  console.log('Sync completed successfully!\n');
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Error syncing to Algolia:', error);
  process.exit(1);
}

