// Script to import all content types to Contentful
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from 'contentful-management';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;

// Content types to import (in order - dependencies first)
const contentTypesToImport = [
  'categoryLink', // No dependencies
  'tileCard', // No dependencies
  'twoCardItem', // No dependencies
  'brandCard', // No dependencies
  'headerPromoItem', // No dependencies
  'footerPromoCard', // No dependencies
  'categoryBanner', // Depends on categoryLink
  'tileSection', // Depends on tileCard
  'twoCardLayout', // Depends on twoCardItem
  'brandSection', // Depends on brandCard
  'headerPromoCarousel', // Depends on headerPromoItem
  'footerPromoSection', // Depends on footerPromoCard
  'promoBanner', // No dependencies
  'slimBanner', // No dependencies
  'productCarousel', // Depends on product, category (already exist)
  'styledByYouSection', // Depends on product, category (already exist)
];

async function importContentType(
  environment: any,
  contentTypeId: string
): Promise<void> {
  const filePath = path.join(
    process.cwd(),
    'contentful',
    'content-types',
    `${contentTypeId}.json`
  );

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  const contentTypeData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Check if content type already exists
  let contentTypeExists = false;
  try {
    await environment.getContentType(contentTypeId);
    contentTypeExists = true;
    console.log(`⚠️  Content type ${contentTypeId} already exists, skipping...`);
  } catch (error: any) {
    // Content type doesn't exist (404/NotFound is expected), continue to create
    if (error.name === 'NotFound' || error.status === 404 || error.statusCode === 404) {
      contentTypeExists = false;
    } else {
      console.error(`❌ Error checking ${contentTypeId}:`, error.message);
      throw error;
    }
  }

  if (contentTypeExists) {
    return;
  }

  try {
    // Prepare fields data
    const fields = contentTypeData.fields.map((field: any) => {
      const fieldData: any = {
        id: field.id,
        name: field.name,
        type: field.type,
        localized: field.localized,
        required: field.required,
        validations: field.validations || [],
        disabled: field.disabled || false,
        omitted: field.omitted || false,
      };

      // Add optional properties
      if (field.linkType) {
        fieldData.linkType = field.linkType;
      }
      if (field.items) {
        fieldData.items = field.items;
      }

      return fieldData;
    });

    // Create content type
    const contentType = await environment.createContentTypeWithId(
      contentTypeId,
      {
        sys: {
          id: contentTypeId,
        },
        name: contentTypeData.name,
        displayField: contentTypeData.displayField,
        description: contentTypeData.description || '',
        fields,
      }
    );

    // Publish content type
    await contentType.publish();
    console.log(`✅ Created and published: ${contentTypeId}`);
  } catch (error: any) {
    if (error.message?.includes('already exists') || error.status === 409) {
      console.log(`⚠️  Content type ${contentTypeId} already exists`);
    } else {
      console.error(`❌ Error importing ${contentTypeId}:`, error.message);
      throw error;
    }
  }
}

async function updatePageContentType(environment: any): Promise<void> {
  try {
    const pageContentType = await environment.getContentType('page');
    
    // Update components field to include all new content types
    const componentsField = pageContentType.fields.find(
      (f: any) => f.id === 'components'
    );

    if (componentsField) {
      componentsField.items.validations = [
        {
          linkContentType: [
            'headerPromoCarousel',
            'heroBanner',
            'promoBanner',
            'productCarousel',
            'categoryBanner',
            'slimBanner',
            'tileSection',
            'twoCardLayout',
            'brandSection',
            'footerPromoSection',
            'styledByYouSection',
          ],
        },
      ];

      const updated = await pageContentType.update();
      await updated.publish();
      console.log('✅ Updated Page content type with new component types');
    }
  } catch (error: any) {
    console.error('❌ Error updating Page content type:', error.message);
  }
}

async function main() {
  const client = createClient({
    accessToken: managementToken,
  });

  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment('master');

  console.log('Starting content type import...\n');

  // Import all content types
  for (const contentTypeId of contentTypesToImport) {
    await importContentType(environment, contentTypeId);
  }

  // Update Page content type
  console.log('\nUpdating Page content type...');
  await updatePageContentType(environment);

  console.log('\n✅ Content type import completed!');
}

main()
  .then(() => {
    console.log('Success!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

