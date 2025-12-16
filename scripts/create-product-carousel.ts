// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from 'contentful-management';

const managementClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});

async function createAndPublishEntry(
  environment: any,
  contentTypeId: string,
  entryId: string,
  fields: any
) {
  try {
    let entry;
    try {
      entry = await environment.getEntry(entryId);
      console.log(`⚠️  Entry ${entryId} already exists, updating...`);
      for (const fieldId in fields) {
        entry.fields[fieldId] = fields[fieldId];
      }
      entry = await entry.update();
      console.log(`✅ Updated ${contentTypeId}: ${entryId}`);
    } catch (error: any) {
      if (error.status === 404 || error.name === 'NotFound') {
        // Entry doesn't exist, create it
        entry = await environment.createEntryWithId(
          contentTypeId,
          entryId,
          { fields }
        );
        console.log(`✅ Created ${contentTypeId}: ${entryId}`);
      } else {
        throw error;
      }
    }
    
    // Unpublish first if already published, then publish
    try {
      if (entry.isPublished()) {
        await entry.unpublish();
      }
    } catch (e) {
      // Ignore if not published
    }
    
    await entry.publish();
    return entry.sys.id;
  } catch (error: any) {
    console.error(`❌ Error creating/publishing ${contentTypeId} ${entryId}:`, error.message);
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

async function updateHomePageWithProductCarousel(productCarouselId: string) {
  try {
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment('master');

    const homePageEntry = await environment.getEntry('3hcIvarV8U6WyA193AFPfT'); // ID of the 'home' page entry

    const currentComponents = homePageEntry.fields.components?.['en-US'] || [];
    
    // Check if productCarousel already exists
    const exists = currentComponents.some(
      (comp: any) => comp.sys.id === productCarouselId
    );

    if (!exists) {
      const newComponents = [
        ...currentComponents,
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: productCarouselId,
          },
        },
      ];

      homePageEntry.fields.components = {
        'en-US': newComponents,
      };

      const updatedEntry = await homePageEntry.update();
      await updatedEntry.publish();
      console.log('✅ Updated home page with ProductCarousel');
    } else {
      console.log('⚠️  ProductCarousel already exists in home page');
    }
  } catch (error) {
    console.error('❌ Error updating/publishing home page entry:', error);
    throw error;
  }
}

async function findCategoryBySlug(environment: any, slug: string) {
  try {
    const entries = await environment.getEntries({
      content_type: 'category',
      'fields.slug': slug,
      limit: 1,
    });
    return entries.items[0] || null;
  } catch (error) {
    console.error(`Error finding category with slug ${slug}:`, error);
    return null;
  }
}

async function main() {
  const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
  const environment = await space.getEnvironment('master');

  console.log('Creating Product Carousel...');

  // Try to find John Galt category (optional)
  let johnGaltCategory = null;
  try {
    johnGaltCategory = await findCategoryBySlug(environment, 'john-galt');
    if (johnGaltCategory) {
      console.log(`✅ Found John Galt category: ${johnGaltCategory.sys.id}`);
    } else {
      console.log('⚠️  John Galt category not found, creating carousel without category');
    }
  } catch (error) {
    console.log('⚠️  Could not find category, creating carousel without category');
  }

  // Create Product Carousel entry
  const productCarouselFields: any = {
    title: {
      'en-US': 'New from John Galt',
      'tr-TR': 'John Galt\'tan Yeni',
    },
    subtitle: {
      'en-US': 'Free shipping on all John Galt clothing orders',
      'tr-TR': 'Tüm John Galt giyim siparişlerinde ücretsiz kargo',
    },
    limit: {
      'en-US': 8, // Show 8 products
    },
  };

  // Add category if found
  if (johnGaltCategory) {
    productCarouselFields.category = {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: johnGaltCategory.sys.id,
        },
      },
    };
  }

  // Products field is optional - can be left empty to show all products from category
  // Or can be populated later with specific products

  const productCarouselId = await createAndPublishEntry(
    environment,
    'productCarousel',
    'productCarouselJohnGalt',
    productCarouselFields
  );

  console.log('\nUpdating Home Page...');
  await updateHomePageWithProductCarousel(productCarouselId);

  console.log('\n✅ Product Carousel created successfully!');
  console.log(`\nEntry ID: ${productCarouselId}`);
  console.log('\n⚠️  NOTE: Products will be automatically loaded from the category.');
  console.log('   If you want to show specific products, add them to the "products" field in Contentful.');
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

