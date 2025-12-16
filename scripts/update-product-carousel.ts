// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from 'contentful-management';

const managementClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});

async function updateProductCarousel() {
  const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
  const environment = await space.getEnvironment('master');

  try {
    // Get the existing ProductCarousel entry
    let entry = await environment.getEntry('productCarouselJohnGalt');

    console.log('Updating ProductCarousel entry...');

    // Unpublish first if published
    try {
      if (entry.isPublished()) {
        entry = await entry.unpublish();
      }
    } catch (e) {
      // Ignore if not published
    }

    // Re-fetch to get latest version
    entry = await environment.getEntry('productCarouselJohnGalt');

    // Update fields (excluding images - those will be added to Product entries)
    entry.fields.title = {
      'en-US': 'New from John Galt',
      'tr-TR': 'John Galt\'tan Yeni',
    };

    entry.fields.subtitle = {
      'en-US': 'Free shipping on all John Galt clothing orders',
      'tr-TR': 'Tüm John Galt giyim siparişlerinde ücretsiz kargo',
    };

    entry.fields.limit = {
      'en-US': 8,
    };

    // Products and Category fields will be left empty for now
    // User can add them manually in Contentful UI
    // Products field: Will be populated with specific Product entries
    // Category field: Can be populated with a Category entry if needed

    const updatedEntry = await entry.update();
    await updatedEntry.publish();

    console.log('✅ ProductCarousel entry updated successfully!');
    console.log(`\nEntry ID: ${updatedEntry.sys.id}`);
    console.log('\nUpdated Fields:');
    console.log('- Title (EN): New from John Galt');
    console.log('- Title (TR): John Galt\'tan Yeni');
    console.log('- Subtitle (EN): Free shipping on all John Galt clothing orders');
    console.log('- Subtitle (TR): Tüm John Galt giyim siparişlerinde ücretsiz kargo');
    console.log('- Limit: 8');
    console.log('\n⚠️  Next Steps:');
    console.log('1. Create Product entries in Contentful');
    console.log('2. Add product images to each Product entry\'s "Images" field');
    console.log('3. Add Product entries to ProductCarousel\'s "Products" field (or use Category field)');
    
    return updatedEntry.sys.id;
  } catch (error: any) {
    if (error.status === 404) {
      console.error('❌ ProductCarousel entry not found. Please create it first using create-product-carousel.ts');
    } else {
      console.error('❌ Error updating ProductCarousel:', error.message);
      if (error.response?.data) {
        console.error('Error details:', JSON.stringify(error.response.data, null, 2));
      }
    }
    throw error;
  }
}

updateProductCarousel()
  .then(() => {
    console.log('\nSuccess!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

