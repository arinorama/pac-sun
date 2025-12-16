// Load environment variables from .env.local FIRST
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from 'contentful-management';

const managementClient = createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});

// Helper function to create RichText content
function createRichTextDocument(text: string) {
  return {
    nodeType: 'document',
    data: {},
    content: [
      {
        nodeType: 'paragraph',
        data: {},
        content: [
          {
            nodeType: 'text',
            value: text,
            marks: [],
            data: {},
          },
        ],
      },
    ],
  };
}

async function findOrCreateCategory(environment: any, categoryName: string, categorySlug: string) {
  try {
    // Try to find existing category
    const entries = await environment.getEntries({
      content_type: 'category',
      'fields.slug': categorySlug,
      limit: 1,
    });
    
    if (entries.items.length > 0) {
      console.log(`  ✅ Found existing category: ${categoryName}`);
      return entries.items[0];
    }
    
    // Create new category if not found
    // Check category content type fields first
    const categoryContentType = await environment.getContentType('category');
    const fields = categoryContentType.fields;
    
    const categoryFields: any = {
      slug: {
        'en-US': categorySlug,
        'tr-TR': categorySlug,
      },
    };
    
    // Add title field if it exists (some content types use title instead of name)
    const hasTitleField = fields.some((f: any) => f.id === 'title');
    const hasNameField = fields.some((f: any) => f.id === 'name');
    
    if (hasTitleField) {
      categoryFields.title = {
        'en-US': categoryName,
        'tr-TR': categoryName,
      };
    } else if (hasNameField) {
      categoryFields.name = {
        'en-US': categoryName,
        'tr-TR': categoryName,
      };
    }
    
    const category = await environment.createEntry('category', {
      fields: categoryFields,
    });
    
    await category.publish();
    console.log(`  ✅ Created category: ${categoryName}`);
    return category;
  } catch (error: any) {
    console.error(`Error finding/creating category:`, error.message);
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

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
      
      // Unpublish first if published
      try {
        if (entry.isPublished()) {
          entry = await entry.unpublish();
        }
      } catch (e) {
        // Ignore if not published
      }
      
      // Re-fetch to get latest version
      entry = await environment.getEntry(entryId);
      
      // Update fields
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

async function main() {
  const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
  const environment = await space.getEnvironment('master');

  const createdProductIds: string[] = [];

  console.log('Creating John Galt Products...\n');

  // Find or create a category for John Galt products
  console.log('Finding or creating category...');
  const category = await findOrCreateCategory(environment, 'John Galt', 'john-galt');
  if (!category) {
    console.error('❌ Could not create/find category. Products require a category.');
    process.exit(1);
  }

  const placeholderAssetId = '1Do1DRekQnXD6wpsaPxnZg'; // Placeholder for required images field

  // Product 1: Navy Anastasia Baggy Sweatpants
  const product1Id = await createAndPublishEntry(
    environment,
    'product',
    'product-navy-anastasia-baggy-sweatpants',
    {
      internalName: {
        'en-US': 'Navy Anastasia Baggy Sweatpants',
      },
      title: {
        'en-US': 'Navy Anastasia Baggy Sweatpants',
        'tr-TR': 'Lacivert Anastasia Bol Eşofman',
      },
      slug: {
        'en-US': 'navy-anastasia-baggy-sweatpants',
        'tr-TR': 'lacivert-anastasia-bol-esofman',
      },
      price: {
        'en-US': 35.00,
      },
      sku: {
        'en-US': 'JG-NAVY-ANASTASIA-BAGGY',
      },
      description: {
        'en-US': createRichTextDocument('Comfortable baggy sweatpants in navy blue. Perfect for everyday wear.'),
        'tr-TR': createRichTextDocument('Lacivert renkli rahat bol eşofman. Günlük kullanım için mükemmel.'),
      },
      images: {
        'en-US': [
          {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: placeholderAssetId, // Placeholder - user will replace with actual image
            },
          },
        ],
      },
      category: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: category.sys.id,
          },
        },
      },
      stockQuantity: {
        'en-US': 100,
      },
      isNew: {
        'en-US': true,
      },
      isSale: {
        'en-US': false,
      },
    }
  );
  createdProductIds.push(product1Id);
  console.log(`  ✅ Created: Navy Anastasia Baggy Sweatpants - $35.00\n`);

  // Product 2: Brown Hilary Soft Yoga Baggy Sweatpants
  const product2Id = await createAndPublishEntry(
    environment,
    'product',
    'product-brown-hilary-soft-yoga-baggy-sweatpants',
    {
      internalName: {
        'en-US': 'Brown Hilary Soft Yoga Baggy Sweatpants',
      },
      title: {
        'en-US': 'Brown Hilary Soft Yoga Baggy Sweatpants',
        'tr-TR': 'Kahverengi Hilary Yumuşak Yoga Bol Eşofman',
      },
      slug: {
        'en-US': 'brown-hilary-soft-yoga-baggy-sweatpants',
        'tr-TR': 'kahverengi-hilary-yumusak-yoga-bol-esofman',
      },
      price: {
        'en-US': 35.00,
      },
      sku: {
        'en-US': 'JG-BROWN-HILARY-SOFT-YOGA',
      },
      description: {
        'en-US': createRichTextDocument('Soft and comfortable yoga-inspired baggy sweatpants in brown.'),
        'tr-TR': createRichTextDocument('Kahverengi renkli yumuşak ve rahat yoga ilhamlı bol eşofman.'),
      },
      images: {
        'en-US': [
          {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: placeholderAssetId,
            },
          },
        ],
      },
      category: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: category.sys.id,
          },
        },
      },
      stockQuantity: {
        'en-US': 100,
      },
      isNew: {
        'en-US': true,
      },
      isSale: {
        'en-US': false,
      },
    }
  );
  createdProductIds.push(product2Id);
  console.log(`  ✅ Created: Brown Hilary Soft Yoga Baggy Sweatpants - $35.00\n`);

  // Product 3: Electric Blue Zelly Long Sleeve Top
  const product3Id = await createAndPublishEntry(
    environment,
    'product',
    'product-electric-blue-zelly-long-sleeve-top',
    {
      internalName: {
        'en-US': 'Electric Blue Zelly Long Sleeve Top',
      },
      title: {
        'en-US': 'Electric Blue Zelly Long Sleeve Top',
        'tr-TR': 'Elektrik Mavisi Zelly Uzun Kollu Üst',
      },
      slug: {
        'en-US': 'electric-blue-zelly-long-sleeve-top',
        'tr-TR': 'elektrik-mavisi-zelly-uzun-kollu-ust',
      },
      price: {
        'en-US': 24.00,
      },
      sku: {
        'en-US': 'JG-ELECTRIC-BLUE-ZELLY-LS',
      },
      description: {
        'en-US': createRichTextDocument('Vibrant electric blue long sleeve top. Perfect for layering.'),
        'tr-TR': createRichTextDocument('Canlı elektrik mavisi uzun kollu üst. Katmanlama için mükemmel.'),
      },
      images: {
        'en-US': [
          {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: placeholderAssetId,
            },
          },
        ],
      },
      category: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: category.sys.id,
          },
        },
      },
      stockQuantity: {
        'en-US': 100,
      },
      isNew: {
        'en-US': true,
      },
      isSale: {
        'en-US': false,
      },
    }
  );
  createdProductIds.push(product3Id);
  console.log(`  ✅ Created: Electric Blue Zelly Long Sleeve Top - $24.00\n`);

  // Product 4: Electric Blue Ashlyn Short Sleeve Top
  const product4Id = await createAndPublishEntry(
    environment,
    'product',
    'product-electric-blue-ashlyn-short-sleeve-top',
    {
      internalName: {
        'en-US': 'Electric Blue Ashlyn Short Sleeve Top',
      },
      title: {
        'en-US': 'Electric Blue Ashlyn Short Sleeve Top',
        'tr-TR': 'Elektrik Mavisi Ashlyn Kısa Kollu Üst',
      },
      slug: {
        'en-US': 'electric-blue-ashlyn-short-sleeve-top',
        'tr-TR': 'elektrik-mavisi-ashlyn-kisa-kollu-ust',
      },
      price: {
        'en-US': 18.00,
      },
      sku: {
        'en-US': 'JG-ELECTRIC-BLUE-ASHLYN-SS',
      },
      description: {
        'en-US': createRichTextDocument('Stylish electric blue short sleeve top. Great for everyday wear.'),
        'tr-TR': createRichTextDocument('Şık elektrik mavisi kısa kollu üst. Günlük kullanım için harika.'),
      },
      images: {
        'en-US': [
          {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: placeholderAssetId,
            },
          },
        ],
      },
      category: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: category.sys.id,
          },
        },
      },
      stockQuantity: {
        'en-US': 100,
      },
      isNew: {
        'en-US': true,
      },
      isSale: {
        'en-US': false,
      },
    }
  );
  createdProductIds.push(product4Id);
  console.log(`  ✅ Created: Electric Blue Ashlyn Short Sleeve Top - $18.00\n`);

  console.log('✅ All products created successfully!');
  console.log('\n📋 Created Product IDs:');
  createdProductIds.forEach((id, index) => {
    console.log(`  ${index + 1}. ${id}`);
  });

  console.log('\n⚠️  IMPORTANT:');
  console.log('1. Replace placeholder images in each Product entry\'s "Images" field with actual product images');
  console.log('2. Add these Product entries to ProductCarousel\'s "Products" field');
  console.log('3. Publish ProductCarousel entry');
  console.log('\n📖 See PRODUCT_CAROUSEL_IMAGE_GUIDE.md for detailed instructions');
  console.log('\n📍 Where to add images:');
  createdProductIds.forEach((id, index) => {
    const productNames = [
      'Navy Anastasia Baggy Sweatpants',
      'Brown Hilary Soft Yoga Baggy Sweatpants',
      'Electric Blue Zelly Long Sleeve Top',
      'Electric Blue Ashlyn Short Sleeve Top',
    ];
    console.log(`  ${index + 1}. ${productNames[index]}: Content → Product → ${id} → Images field`);
  });
}

main()
  .then(() => {
    console.log('\nSuccess!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

