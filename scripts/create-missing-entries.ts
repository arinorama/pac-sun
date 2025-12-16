// Script to create missing entries: HeaderPromoCarousel and second TwoCardLayout
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from 'contentful-management';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;
const placeholderAssetId = '1Do1DRekQnXD6wpsaPxnZg'; // Placeholder image

async function createMissingEntries() {
  const client = createClient({
    accessToken: managementToken,
  });

  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment('master');

  const createdEntries: Record<string, string> = {};

  try {
    // 1. Create Header Promo Items
    console.log('Creating Header Promo Items...');
    const promoItems = [
      {
        desktopText: {
          'en-US': 'COUNTDOWN TO HOLIDAY! DEAL 12: $10 & UP GIFTS & STOCKING STUFFERS + FREE SHIPPING*',
          'tr-TR': 'TATİLE GERİ SAYIM! FIRSAT 12: $10 VE ÜZERİ HEDİYELER & ÇORAP DOLDURMA + ÜCRETSİZ KARGO*',
        },
        mobileText: {
          'en-US': '$10 & UP GIFTS & STOCKING STUFFERS',
          'tr-TR': '$10 VE ÜZERİ HEDİYELER & ÇORAP DOLDURMA',
        },
        ctaMen: 'SHOP MEN',
        ctaMenLink: '/en/mens/flashsale5',
        ctaWomen: 'SHOP WOMEN',
        ctaWomenLink: '/en/womens/flashsale5',
        ctaKids: 'SHOP KIDS',
        ctaKidsLink: '/en/kids/flashsale5',
      },
      {
        desktopText: {
          'en-US': 'THE SEASON OF GIFTING: EXTRA 30% OFF SITEWIDE* + FREE SHIPPING*',
          'tr-TR': 'HEDİYE SEZONU: TÜM SİTEDE EKSTRA %30 İNDİRİM* + ÜCRETSİZ KARGO*',
        },
        mobileText: {
          'en-US': 'EXTRA 30% OFF SITEWIDE* & FREE SHIP',
          'tr-TR': 'TÜM SİTEDE EKSTRA %30 İNDİRİM* & ÜCRETSİZ KARGO',
        },
        ctaMen: 'SHOP MEN',
        ctaMenLink: '/en/mens',
        ctaWomen: 'SHOP WOMEN',
        ctaWomenLink: '/en/womens',
        ctaKids: 'SHOP KIDS',
        ctaKidsLink: '/en/kids',
      },
      {
        desktopText: {
          'en-US': '3 DAYS LEFT TO GIFT BY 12/25 W/ FREE STANDARD SHIPPING*! ORDER BY 12/16 11:59 PM PT',
          'tr-TR': '12/25\'E KADAR HEDİYE VERMEK İÇİN 3 GÜN KALDI ÜCRETSİZ STANDART KARGO*! 12/16 23:59 PT\'YE KADAR SİPARİŞ VER',
        },
        mobileText: {
          'en-US': 'DAYS LEFT TO GIFT BY 12/25 W/ FREE SHIP*',
          'tr-TR': '12/25\'E KADAR HEDİYE VERMEK İÇİN GÜN KALDI ÜCRETSİZ KARGO*',
        },
        ctaMen: 'SHOP MEN',
        ctaMenLink: '/en/mens',
        ctaWomen: 'SHOP WOMEN',
        ctaWomenLink: '/en/womens',
        ctaKids: 'SHOP KIDS',
        ctaKidsLink: '/en/kids',
      },
    ];

    const promoItemIds: string[] = [];
    for (const itemData of promoItems) {
      const entry = await environment.createEntry('headerPromoItem', {
        fields: {
          desktopText: itemData.desktopText,
          mobileText: itemData.mobileText,
          ctaMen: { 'en-US': itemData.ctaMen },
          ctaMenLink: { 'en-US': itemData.ctaMenLink },
          ctaWomen: { 'en-US': itemData.ctaWomen },
          ctaWomenLink: { 'en-US': itemData.ctaWomenLink },
          ctaKids: { 'en-US': itemData.ctaKids },
          ctaKidsLink: { 'en-US': itemData.ctaKidsLink },
        },
      });
      const published = await entry.publish();
      promoItemIds.push(published.sys.id);
      console.log(`✅ Created headerPromoItem: ${published.sys.id}`);
    }
    createdEntries.headerPromoItems = promoItemIds;

    // 2. Create Header Promo Carousel
    console.log('\nCreating Header Promo Carousel...');
    const headerPromoCarousel = await environment.createEntry('headerPromoCarousel', {
      fields: {
        title: {
          'en-US': 'Header Promo Carousel',
          'tr-TR': 'Üst Promosyon Carousel',
        },
        promoItems: {
          'en-US': promoItemIds.map((id) => ({
            sys: { type: 'Link', linkType: 'Entry', id },
          })),
        },
        autoplay: { 'en-US': true },
        autoplaySpeed: { 'en-US': 5000 },
      },
    });
    const publishedHeaderPromoCarousel = await headerPromoCarousel.publish();
    createdEntries.headerPromoCarousel = publishedHeaderPromoCarousel.sys.id;
    console.log(`✅ Created headerPromoCarousel: ${publishedHeaderPromoCarousel.sys.id}`);

    // 3. Create Second Two Card Item (Lonely Ghost)
    console.log('\nCreating Second Two Card Items...');
    const twoCardItem3 = await environment.createEntry('twoCardItem', {
      fields: {
        logo: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Asset', id: placeholderAssetId },
          },
        },
        ctaText: {
          'en-US': 'SHOP COLLECTION',
          'tr-TR': 'KOLEKSİYONU İNCELE',
        },
        ctaLink: { 'en-US': '/en/lonely-ghost' },
      },
    });
    const publishedTwoCardItem3 = await twoCardItem3.publish();
    createdEntries.twoCardItem3 = publishedTwoCardItem3.sys.id;
    console.log(`✅ Created twoCardItem 3: ${publishedTwoCardItem3.sys.id}`);

    const twoCardItem4 = await environment.createEntry('twoCardItem', {
      fields: {
        logo: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Asset', id: placeholderAssetId },
          },
        },
        ctaText: {
          'en-US': 'Shop Collection',
          'tr-TR': 'Koleksiyonu İncele',
        },
        ctaLink: { 'en-US': '/en/ps-vintage' },
      },
    });
    const publishedTwoCardItem4 = await twoCardItem4.publish();
    createdEntries.twoCardItem4 = publishedTwoCardItem4.sys.id;
    console.log(`✅ Created twoCardItem 4: ${publishedTwoCardItem4.sys.id}`);

    // 4. Create Second Two Card Layout
    console.log('\nCreating Second Two Card Layout...');
    const twoCardLayout2 = await environment.createEntry('twoCardLayout', {
      fields: {
        backgroundImage: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Asset', id: placeholderAssetId },
          },
        },
        card1: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Entry', id: publishedTwoCardItem3.sys.id },
          },
        },
        card2: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Entry', id: publishedTwoCardItem4.sys.id },
          },
        },
      },
    });
    const publishedTwoCardLayout2 = await twoCardLayout2.publish();
    createdEntries.twoCardLayout2 = publishedTwoCardLayout2.sys.id;
    console.log(`✅ Created twoCardLayout 2: ${publishedTwoCardLayout2.sys.id}`);

    // 5. Update Home Page with new components
    console.log('\nUpdating Home Page...');
    const homePage = await environment.getEntry('3hcIvarV8U6WyA193AFPfT');
    const currentComponents = homePage.fields.components?.['en-US'] || [];
    
    // Add HeaderPromoCarousel at the beginning
    const newComponents = [
      { sys: { type: 'Link', linkType: 'Entry', id: publishedHeaderPromoCarousel.sys.id } },
      ...currentComponents,
      { sys: { type: 'Link', linkType: 'Entry', id: publishedTwoCardLayout2.sys.id } },
    ];

    homePage.fields.components = {
      'en-US': newComponents,
    };
    const updatedHomePage = await homePage.update();
    const publishedHomePage = await updatedHomePage.publish();
    console.log(`✅ Updated home page: ${publishedHomePage.sys.id}`);

    console.log('\n✅ All entries created successfully!');
    console.log('\nCreated Entry IDs:');
    console.log(JSON.stringify(createdEntries, null, 2));

    return createdEntries;
  } catch (error) {
    console.error('Error creating entries:', error);
    throw error;
  }
}

createMissingEntries()
  .then(() => {
    console.log('Success!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

