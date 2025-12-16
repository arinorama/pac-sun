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

async function importSimpleHeader() {
  const client = createClient({
    accessToken: MANAGEMENT_TOKEN,
  });

  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);

    const filePath = path.resolve(__dirname, '../contentful/content-types/siteHeader.json');
    const contentTypeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    try {
      // Try to get existing content type
      let contentType = await environment.getContentType('siteHeader');
      console.log(`Updating existing content type: siteHeader`);
      
      contentType.name = contentTypeData.name;
      contentType.description = contentTypeData.description;
      contentType.displayField = contentTypeData.displayField;
      contentType.fields = contentTypeData.fields;
      
      contentType = await contentType.update();
      console.log(`✓ Updated content type: siteHeader`);
      
      await contentType.publish();
      console.log(`✓ Published content type: siteHeader`);
    } catch (error: any) {
      if (error.message.includes('The resource could not be found')) {
        console.log(`Creating new content type: siteHeader`);
        
        let contentType = await environment.createContentTypeWithId('siteHeader', {
          name: contentTypeData.name,
          description: contentTypeData.description,
          displayField: contentTypeData.displayField,
          fields: contentTypeData.fields,
        });
        
        console.log(`✓ Created content type: siteHeader`);
        
        await contentType.publish();
        console.log(`✓ Published content type: siteHeader`);
      } else {
        throw error;
      }
    }

    console.log('\n✅ Site Header content type imported successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Go to Contentful: https://app.contentful.com');
    console.log('2. Create a new "Site Header" entry');
    console.log('3. Add your logo image');
    console.log('4. Set the logo alt text');
    console.log('5. Save and Publish');
    
  } catch (error) {
    console.error('Error importing content type:', error);
    
    console.log('\n\n🔧 ALTERNATIF ÇÖZÜM:');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Eğer script çalışmıyorsa, manuel olarak oluşturun:');
    console.log('');
    console.log('1. https://app.contentful.com → Space\'inizde');
    console.log('2. Content model → Add content type');
    console.log('3. Name: "Site Header"');
    console.log('4. API Identifier: "siteHeader"');
    console.log('5. Şu field\'ları ekleyin:');
    console.log('   - title (Short text, Required)');
    console.log('   - logo (Media - Single file)');
    console.log('   - logoAltText (Short text, Localizable)');
    console.log('6. Save');
    
    throw error;
  }
}

importSimpleHeader();

