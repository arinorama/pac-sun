import { contentfulClient } from './client';
import type { Entry, Asset } from 'contentful';

// Helper to map locale
function mapLocale(locale: string): string {
  return locale === 'en' ? 'en-US' : 'tr-TR';
}

// Helper to get image URL
export function getImageUrl(asset: Asset | undefined): string {
  if (!asset?.fields?.file) return '';
  return `https:${asset.fields.file.url}`;
}

// Get all products
export async function getProducts(
  locale: string = 'en',
  categoryId?: string,
  limit: number = 100
) {
  const contentfulLocale = mapLocale(locale);
  
  const query: Record<string, unknown> = {
    content_type: 'product',
    locale: contentfulLocale,
    limit,
    include: 2, // Include linked entries and assets
  };

  if (categoryId) {
    query['fields.category.sys.id'] = categoryId;
  }

  const response = await contentfulClient.getEntries(query);
  return response.items;
}

// Get product by slug
export async function getProductBySlug(slug: string, locale: string = 'en') {
  const contentfulLocale = mapLocale(locale);
  
  const response = await contentfulClient.getEntries({
    content_type: 'product',
    'fields.slug': slug,
    locale: contentfulLocale,
    include: 2,
    limit: 1,
  });

  return response.items[0] || null;
}

// Get all categories
export async function getCategories(locale: string = 'en') {
  const contentfulLocale = mapLocale(locale);
  
  const response = await contentfulClient.getEntries({
    content_type: 'category',
    locale: contentfulLocale,
    include: 1,
    order: 'fields.order',
  });

  return response.items;
}

// Get category by slug
export async function getCategoryBySlug(slug: string, locale: string = 'en') {
  const contentfulLocale = mapLocale(locale);
  
  const response = await contentfulClient.getEntries({
    content_type: 'category',
    'fields.slug': slug,
    locale: contentfulLocale,
    include: 1,
    limit: 1,
  });

  return response.items[0] || null;
}

// Get page by slug
export async function getPageBySlug(slug: string, locale: string = 'en') {
  const contentfulLocale = mapLocale(locale);
  
  const response = await contentfulClient.getEntries({
    content_type: 'page',
    'fields.slug': slug,
    locale: contentfulLocale,
    include: 10, // Deep include for nested components
    limit: 1,
  });

  return response.items[0] || null;
}

// Get mega menu
export async function getMegaMenu(locale: string = 'en') {
  const contentfulLocale = mapLocale(locale);
  
  const response = await contentfulClient.getEntries({
    content_type: 'megaMenu',
    locale: contentfulLocale,
    include: 5,
    limit: 1,
  });

  return response.items[0] || null;
}

// Get UI texts
export async function getUITexts(locale: string = 'en'): Promise<Record<string, string>> {
  const contentfulLocale = mapLocale(locale);
  
  const response = await contentfulClient.getEntries({
    content_type: 'uiTexts',
    locale: contentfulLocale,
    limit: 1000,
  });

  // Transform to flat object: { "common.addToCart": "Add to Cart" }
  return response.items.reduce((acc, item) => {
    const key = item.fields.key as string;
    const value = item.fields.value as string;
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);
}

// Get header promo carousel
export async function getHeaderPromoCarousel(locale: string = 'en') {
  const contentfulLocale = mapLocale(locale);
  
  const response = await contentfulClient.getEntries({
    content_type: 'headerPromoCarousel',
    locale: contentfulLocale,
    include: 2,
    limit: 1,
  });

  return response.items[0] || null;
}

// Get site header configuration
export async function getSiteHeader(locale: string = 'en') {
  const contentfulLocale = mapLocale(locale);
  
  const response = await contentfulClient.getEntries({
    content_type: 'siteHeader',
    locale: contentfulLocale,
    include: 3, // Include logo, navigation menus and their items
    limit: 1,
  });

  return response.items[0] || null;
}

// Create order (using Management API)
export async function createOrder(orderData: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: unknown;
  shippingAddress: unknown;
  billingAddress: unknown;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: string;
  userId?: string;
}) {
  // This will be implemented using Management API in API route
  // See src/app/api/orders/route.ts
  return orderData;
}

