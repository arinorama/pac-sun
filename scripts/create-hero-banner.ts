// Script to create HeroBanner entry in Contentful
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from 'contentful-management';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;

async function createHeroBanner() {
  const client = createClient({
    accessToken: managementToken,
  });

  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment('master');

  try {
    const entry = await environment.createEntry('heroBanner', {
      fields: {
        title: {
          'en-US': 'NEW HOLIDAY DENIM',
          'tr-TR': 'YENİ TATİL DENİM',
        },
        subtitle: {
          'en-US': 'Shop the latest holiday styles',
          'tr-TR': 'En yeni tatil stillerini keşfedin',
        },
        image: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: '1Do1DRekQnXD6wpsaPxnZg',
            },
          },
        },
        ctaText: {
          'en-US': 'Shop Now',
          'tr-TR': 'Şimdi Alışveriş Yap',
        },
        ctaLink: {
          'en-US': '/en/womens',
        },
        textPosition: {
          'en-US': 'center',
        },
      },
    });

    console.log('HeroBanner entry created:', entry.sys.id);
    
    // Publish the entry
    const publishedEntry = await entry.publish();
    console.log('HeroBanner entry published:', publishedEntry.sys.id);
    
    return publishedEntry.sys.id;
  } catch (error) {
    console.error('Error creating HeroBanner:', error);
    throw error;
  }
}

createHeroBanner()
  .then((entryId) => {
    console.log('Success! Entry ID:', entryId);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

