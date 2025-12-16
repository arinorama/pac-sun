// Script to update home page with HeroBanner
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from 'contentful-management';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;
const homePageId = '3hcIvarV8U6WyA193AFPfT';
const heroBannerId = '6Ac7aRUAZSiPoUer1bOqUh';

async function updateHomePage() {
  const client = createClient({
    accessToken: managementToken,
  });

  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment('master');

  try {
    // Get the current entry
    const entry = await environment.getEntry(homePageId);
    
    // Update components field
    entry.fields.components = {
      'en-US': [
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: heroBannerId,
          },
        },
      ],
    };

    // Update the entry
    const updatedEntry = await entry.update();
    console.log('Home page updated:', updatedEntry.sys.id);
    
    // Publish the entry
    const publishedEntry = await updatedEntry.publish();
    console.log('Home page published:', publishedEntry.sys.id);
    
    return publishedEntry.sys.id;
  } catch (error) {
    console.error('Error updating home page:', error);
    throw error;
  }
}

updateHomePage()
  .then((entryId) => {
    console.log('Success! Entry ID:', entryId);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

