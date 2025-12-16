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

async function importUnifiedContentTypes() {
  const client = createClient({
    accessToken: MANAGEMENT_TOKEN,
  });

  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);

    console.log('\n🎯 BİRLEŞTİRİLMİŞ CONTENT TYPE IMPORT İŞLEMİ');
    console.log('═══════════════════════════════════════════════════\n');

    // Content types to import
    const contentTypes = [
      {
        file: 'unified/banner.json',
        id: 'banner',
        replaces: ['heroBanner', 'slimBanner', 'promoBanner']
      },
      {
        file: 'unified/card.json',
        id: 'card',
        replaces: ['brandCard', 'tileCard', 'twoCardItem', 'footerPromoCard']
      },
      {
        file: 'unified/section.json',
        id: 'section',
        replaces: ['brandSection', 'tileSection', 'footerPromoSection']
      },
      {
        file: 'unified/siteSettings.json',
        id: 'siteSettings',
        replaces: []
      },
    ];

    for (const ct of contentTypes) {
      const filePath = path.resolve(__dirname, '../contentful/content-types', ct.file);
      
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${ct.file}, skipping...`);
        continue;
      }

      const contentTypeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      console.log(`\n📦 Processing: ${ct.id}`);
      console.log(`   Replaces: ${ct.replaces.length > 0 ? ct.replaces.join(', ') : 'NEW'}`);

      try {
        // Try to get existing content type
        let contentType = await environment.getContentType(ct.id);
        console.log(`   ↻ Updating existing content type...`);
        
        contentType.name = contentTypeData.name;
        contentType.description = contentTypeData.description;
        contentType.displayField = contentTypeData.displayField;
        contentType.fields = contentTypeData.fields;
        
        contentType = await contentType.update();
        console.log(`   ✓ Updated: ${ct.id}`);
        
        await contentType.publish();
        console.log(`   ✓ Published: ${ct.id}`);
      } catch (error: any) {
        if (error.message.includes('The resource could not be found')) {
          console.log(`   ⊕ Creating new content type...`);
          
          let contentType = await environment.createContentTypeWithId(ct.id, {
            name: contentTypeData.name,
            description: contentTypeData.description,
            displayField: contentTypeData.displayField,
            fields: contentTypeData.fields,
          });
          
          console.log(`   ✓ Created: ${ct.id}`);
          
          await contentType.publish();
          console.log(`   ✓ Published: ${ct.id}`);
        } else {
          console.error(`   ✗ Error with ${ct.id}:`, error.message);
        }
      }
    }

    console.log('\n\n✅ BİRLEŞTİRME İŞLEMİ TAMAMLANDI!');
    console.log('═══════════════════════════════════════════════════\n');
    console.log('📊 Özet:');
    console.log('  • banner: hero, slim, promo → Birleştirildi');
    console.log('  • card: brand, tile, two-column, footer-promo → Birleştirildi');
    console.log('  • section: brand, tile, footer-promo → Birleştirildi');
    console.log('  • siteSettings: Logo ve global ayarlar için\n');
    
    console.log('📋 SONRAKI ADIMLAR:');
    console.log('═══════════════════════════════════════════════════');
    console.log('1. Contentful web arayüzüne gidin');
    console.log('2. Eski content type\'ları UNPUBLISH edin:');
    console.log('   - heroBanner, slimBanner, promoBanner');
    console.log('   - brandCard, tileCard, twoCardItem, footerPromoCard');
    console.log('   - brandSection, tileSection, footerPromoSection');
    console.log('3. Mevcut entry\'leri yeni content type\'lara taşıyın');
    console.log('4. Component kodlarını güncelleyin');
    console.log('5. Eski content type\'ları SİLİN\n');

  } catch (error: any) {
    console.error('\n❌ HATA:', error.message);
    
    if (error.message.includes('Forbidden') || error.message.includes('AccessDenied')) {
      console.log('\n\n🔧 MANUEL ÇÖZÜM:');
      console.log('═══════════════════════════════════════════════════');
      console.log('Management Token izin sorunu. Manuel olarak oluşturun:\n');
      console.log('1. https://app.contentful.com → Content model');
      console.log('2. Eski content type\'lardan birini DÜZENLE ve YENIDEN ADLANDIR');
      console.log('   Örnek: heroBanner → banner');
      console.log('3. Field\'ları ekleyin/düzenleyin');
      console.log('4. bannerType field\'ı ekleyin (hero, slim, promo)');
      console.log('5. Save & Publish\n');
    }
    
    throw error;
  }
}

importUnifiedContentTypes();

