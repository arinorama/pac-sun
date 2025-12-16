import { createClient } from 'contentful-management';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || 'master';

async function importContentTypes() {
  const client = createClient({
    accessToken: MANAGEMENT_TOKEN,
  });

  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);

    // Content type definitions
    const contentTypes = [
      {
        file: 'navigationMenuItem.json',
        id: 'navigationMenuItem',
      },
      {
        file: 'navigationMenu.json',
        id: 'navigationMenu',
      },
      {
        file: 'header.json',
        id: 'header',
      },
    ];

    for (const ct of contentTypes) {
      const filePath = path.resolve(__dirname, '../contentful/content-types', ct.file);
      const contentTypeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      try {
        // Try to get existing content type
        let contentType = await environment.getContentType(ct.id);
        console.log(`Updating existing content type: ${ct.id}`);
        
        // Update fields
        contentType.name = contentTypeData.name;
        contentType.description = contentTypeData.description;
        contentType.displayField = contentTypeData.displayField;
        contentType.fields = contentTypeData.fields;
        
        contentType = await contentType.update();
        console.log(`✓ Updated content type: ${ct.id}`);
        
        // Publish the content type
        await contentType.publish();
        console.log(`✓ Published content type: ${ct.id}`);
      } catch (error: any) {
        if (error.message.includes('The resource could not be found')) {
          // Create new content type
          console.log(`Creating new content type: ${ct.id}`);
          
          let contentType = await environment.createContentTypeWithId(ct.id, {
            name: contentTypeData.name,
            description: contentTypeData.description,
            displayField: contentTypeData.displayField,
            fields: contentTypeData.fields,
          });
          
          console.log(`✓ Created content type: ${ct.id}`);
          
          // Publish the content type
          await contentType.publish();
          console.log(`✓ Published content type: ${ct.id}`);
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ All header content types imported successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Go to Contentful web app');
    console.log('2. Create a new Header entry with your logo');
    console.log('3. Create Navigation Menu entries for each menu item');
    console.log('4. Create Navigation Menu Item entries for dropdown items');
    console.log('5. Update the Header component to fetch data from Contentful');
  } catch (error) {
    console.error('Error importing content types:', error);
    throw error;
  }
}

importContentTypes();

