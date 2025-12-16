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

async function updateHomePageWithStyledByYou(styledByYouSectionId: string) {
  try {
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment('master');

    const homePageEntry = await environment.getEntry('3hcIvarV8U6WyA193AFPfT'); // ID of the 'home' page entry

    const currentComponents = homePageEntry.fields.components?.['en-US'] || [];
    
    // Check if styledByYouSection already exists
    const exists = currentComponents.some(
      (comp: any) => comp.sys.id === styledByYouSectionId
    );

    if (!exists) {
      const newComponents = [
        ...currentComponents,
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: styledByYouSectionId,
          },
        },
      ];

      homePageEntry.fields.components = {
        'en-US': newComponents,
      };

      const updatedEntry = await homePageEntry.update();
      await updatedEntry.publish();
      console.log('✅ Updated home page with StyledByYouSection');
    } else {
      console.log('⚠️  StyledByYouSection already exists in home page');
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

  console.log('Creating Styled By You Section...');

  // Try to find a category (optional - can be used to filter products)
  // For now, we'll leave it empty and let it show all products or specific products
  let category = null;
  try {
    // You can specify a category slug here if needed
    // category = await findCategoryBySlug(environment, 'featured');
  } catch (error) {
    console.log('⚠️  No category specified, creating section without category');
  }

  // Create Styled By You Section entry
  const styledByYouFields: any = {
    title: {
      'en-US': 'Pacsun Styled by You',
      'tr-TR': 'Pacsun Senin Tarzın',
    },
    subtitle: {
      'en-US': 'See how our community styles their favorite pieces',
      'tr-TR': 'Topluluğumuzun favori parçalarını nasıl stillendirdiğini görün',
    },
    limit: {
      'en-US': 4, // Show 4 products
    },
  };

  // Add category if found
  if (category) {
    styledByYouFields.category = {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: category.sys.id,
        },
      },
    };
  }

  // Products field is optional - can be left empty to show all products
  // Or can be populated later with specific products that are "styled by you"

  const styledByYouSectionId = await createAndPublishEntry(
    environment,
    'styledByYouSection',
    'styledByYouSection',
    styledByYouFields
  );

  console.log('\nUpdating Home Page...');
  await updateHomePageWithStyledByYou(styledByYouSectionId);

  console.log('\n✅ Styled By You Section created successfully!');
  console.log(`\nEntry ID: ${styledByYouSectionId}`);
  console.log('\n⚠️  NOTE: Products field is optional.');
  console.log('   - If empty, you can add specific products later in Contentful');
  console.log('   - Or use the category field to filter products by category');
  console.log('   - Products will be displayed in a grid layout');
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

