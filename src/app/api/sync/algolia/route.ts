import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'contentful';
import algoliasearch from 'algoliasearch';
import type { Asset } from 'contentful';
import type { AlgoliaProduct } from '@/lib/algolia/types';
import { ALGOLIA_INDEXES, SEARCH_SETTINGS } from '@/lib/algolia/config';

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
      ? Math.round(
          ((fields.compareAtPrice - fields.price) / fields.compareAtPrice) * 100
        )
      : undefined;

  // Get all image URLs
  const images =
    fields.images?.map((img) => getImageUrl(img)).filter(Boolean) || [];

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

/**
 * Algolia Sync API
 * Syncs all products from Contentful to Algolia
 * Triggered by Contentful webhooks or manually
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify webhook secret
    const secret = request.headers.get('x-webhook-secret');
    const webhookSecret = process.env.CONTENTFUL_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { message: 'Server configuration error: Missing webhook secret' },
        { status: 500 }
      );
    }

    if (secret !== webhookSecret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // 2. Check required environment variables
    const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
    const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
    const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;

    if (!SPACE_ID || !ACCESS_TOKEN || !ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
      return NextResponse.json(
        {
          message:
            'Server configuration error: Missing Contentful or Algolia credentials',
        },
        { status: 500 }
      );
    }

    // eslint-disable-next-line no-console
    console.log('🔄 Starting Algolia sync...');

    // 3. Initialize clients
    const contentfulClient = createClient({
      space: SPACE_ID,
      accessToken: ACCESS_TOKEN,
    });

    const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

    // 4. Sync EN products
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
    await enIndex.setSettings(SEARCH_SETTINGS);
    await enIndex.saveObjects(enRecords, {
      autoGenerateObjectIDIfNotExist: false,
    });

    // 5. Sync TR products
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
    await trIndex.setSettings(SEARCH_SETTINGS);
    await trIndex.saveObjects(trRecords, {
      autoGenerateObjectIDIfNotExist: false,
    });

    const totalRecords = enRecords.length + trRecords.length;

    // eslint-disable-next-line no-console
    console.log(`✅ Synced ${totalRecords} products to Algolia`);

    return NextResponse.json({
      success: true,
      synced: {
        en: enRecords.length,
        tr: trRecords.length,
        total: totalRecords,
      },
      indexes: {
        en: ALGOLIA_INDEXES.PRODUCTS_EN,
        tr: ALGOLIA_INDEXES.PRODUCTS_TR,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Algolia sync error:', error);
    return NextResponse.json(
      {
        message: 'Error syncing to Algolia',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Manual trigger via GET for testing
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CONTENTFUL_WEBHOOK_SECRET}`;

  if (authHeader !== expectedAuth) {
    return NextResponse.json(
      {
        message:
          'Unauthorized. Use: Authorization: Bearer YOUR_WEBHOOK_SECRET',
      },
      { status: 401 }
    );
  }

  // Trigger sync
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      headers: {
        'x-webhook-secret': process.env.CONTENTFUL_WEBHOOK_SECRET || '',
      },
    })
  );
}




