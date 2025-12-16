import { createClient } from 'contentful-management';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || 'master';

async function checkLimits() {
  const client = createClient({
    accessToken: MANAGEMENT_TOKEN,
  });

  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);

    // Get all content types
    const contentTypes = await environment.getContentTypes();
    
    console.log('\n📊 Contentful Space Bilgileri:');
    console.log('═══════════════════════════════════════');
    console.log(`Space ID: ${SPACE_ID}`);
    console.log(`Environment: ${ENVIRONMENT_ID}`);
    console.log(`\n📦 Mevcut Content Type Sayısı: ${contentTypes.items.length}`);
    console.log('═══════════════════════════════════════\n');
    
    console.log('Mevcut Content Types:');
    contentTypes.items.forEach((ct, index) => {
      console.log(`${index + 1}. ${ct.sys.id} - ${ct.name}`);
    });

    console.log('\n⚠️  Contentful Free Plan Limitleri:');
    console.log('═══════════════════════════════════════');
    console.log('• Content Types: 48 (maksimum)');
    console.log('• API Requests: 200K/month');
    console.log('• Asset Storage: 100MB');
    console.log('• Locales: 2');
    
    const remaining = 48 - contentTypes.items.length;
    console.log(`\n✅ Kullanılabilir Content Type Kotası: ${remaining} adet`);
    
    if (remaining > 0) {
      console.log('\n💡 Header content type\'ı oluşturulabilir!');
      console.log('   Hata başka bir sebepten kaynaklanıyor olabilir.');
    } else {
      console.log('\n❌ Content type limiti dolmuş!');
      console.log('   Yeni content type oluşturmak için bazı kullanılmayanları silmeniz gerekiyor.');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkLimits();

