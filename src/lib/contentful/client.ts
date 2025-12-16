import { createClient } from 'contentful';
import type { ContentfulClientApi } from 'contentful';

// Lazy initialization function to ensure environment variables are loaded
function getEnvVars() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const previewAccessToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

  if (!space || !accessToken) {
    const errorMessage = 'Missing Contentful environment variables';
    
    // eslint-disable-next-line no-console
    console.error(errorMessage);
    
    if (process.env.NODE_ENV === 'development') {
      throw new Error(errorMessage);
    }
    
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

