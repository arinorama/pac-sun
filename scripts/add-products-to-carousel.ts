// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from 'contentful-management';

const managementClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});

async function addProductsToCarousel() {
  const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
  const environment = await space.getEnvironment('master');

  try {
    // Get ProductCarousel entry
    let carousel = await environment.getEntry('productCarouselJohnGalt');

    // Unpublish first if published
    try {
      if (carousel.isPublished()) {
        carousel = await carousel.unpublish();
      }
    } catch (e) {
      // Ignore if not published
    }

    // Re-fetch to get latest version
    carousel = await environment.getEntry('productCarouselJohnGalt');

    // Product IDs to add
    const productIds = [
      'product-navy-anastasia-baggy-sweatpants',
      'product-brown-hilary-soft-yoga-baggy-sweatpants',
      'product-electric-blue-zelly-long-sleeve-top',
      'product-electric-blue-ashlyn-short-sleeve-top',
    ];

    // Add products to carousel
    carousel.fields.products = {
      'en-US': productIds.map((id) => ({
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: id,
        },
      })),
    };

    const updatedCarousel = await carousel.update();
    await updatedCarousel.publish();

    console.log('✅ Products added to ProductCarousel successfully!');
    console.log('\nAdded Products:');
    productIds.forEach((id, index) => {
      console.log(`  ${index + 1}. ${id}`);
    });
  } catch (error: any) {
    console.error('❌ Error adding products to carousel:', error.message);
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

addProductsToCarousel()
  .then(() => {
    console.log('\nSuccess!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

