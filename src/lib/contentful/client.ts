import { createClient } from 'contentful';
import type { ContentfulClientApi } from 'contentful';

// Lazy initialization function to ensure environment variables are loaded
function getEnvVars() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const previewAccessToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

  if (!space || !accessToken) {
    const errorMessage =
      '❌ Missing Contentful environment variables!\n\n' +
      'Current values:\n' +
      `  CONTENTFUL_SPACE_ID: ${space ? '✅ Set' : '❌ Missing'}\n` +
      `  CONTENTFUL_ACCESS_TOKEN: ${accessToken ? '✅ Set' : '❌ Missing'}\n\n` +
      'Please check your .env.local file and ensure:\n' +
      '1. File is in the project root (same folder as package.json)\n' +
      '2. Variables are defined without quotes: CONTENTFUL_ACCESS_TOKEN=your_token\n' +
      '3. No spaces around the = sign\n' +
      '4. Dev server has been restarted after adding variables\n\n' +
      'After fixing, restart your Next.js dev server:\n' +
      '  - Stop: Ctrl+C\n' +
      '  - Start: npm run dev';
    
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    
    // In development, throw error to show helpful message
    // In production, we'll use fallback values
    if (process.env.NODE_ENV === 'development') {
      throw new Error(errorMessage);
    }
    
    // In production, return null to handle gracefully
    return { space: null, accessToken: null, previewAccessToken: null };
  }

  return { space, accessToken, previewAccessToken };
}

// Lazy initialization - clients are created when first accessed
let _contentfulClient: ContentfulClientApi<undefined> | null = null;
let _previewClient: ContentfulClientApi<undefined> | null = null;

function createContentfulClient(): ContentfulClientApi<undefined> {
  if (!_contentfulClient) {
    const { space, accessToken } = getEnvVars();
    if (!space || !accessToken) {
      throw new Error('Contentful client cannot be created without environment variables');
    }
    _contentfulClient = createClient({
      space,
      accessToken,
    });
  }
  return _contentfulClient;
}

function createPreviewClient(): ContentfulClientApi<undefined> {
  if (!_previewClient) {
    const { space, accessToken, previewAccessToken } = getEnvVars();
    if (!space || !accessToken) {
      throw new Error('Contentful preview client cannot be created without environment variables');
    }
    _previewClient = createClient({
      space,
      accessToken: previewAccessToken || accessToken,
      host: 'preview.contentful.com',
    });
  }
  return _previewClient;
}

// Export getters that lazily initialize clients
// Using Proxy to ensure clients are created only when accessed
export const contentfulClient = new Proxy({} as ContentfulClientApi<undefined>, {
  get(_target, prop) {
    const client = createContentfulClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export const previewClient = new Proxy({} as ContentfulClientApi<undefined>, {
  get(_target, prop) {
    const client = createPreviewClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

