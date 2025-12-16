// Script to create home page entries from HTML data
import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from 'contentful-management';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const spaceId = process.env.CONTENTFUL_SPACE_ID!;
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;
const placeholderAssetId = '1Do1DRekQnXD6wpsaPxnZg'; // Placeholder image

async function createHomePageEntries() {
  const client = createClient({
    accessToken: managementToken,
  });

  const space = await client.getSpace(spaceId);
  const environment = await space.getEnvironment('master');

  const createdEntries: Record<string, string> = {};

  try {
    // 1. Create Category Links
    console.log('Creating Category Links...');
    const categoryLinks = [
      { text: { 'en-US': 'NEW ARRIVALS', 'tr-TR': 'YENİ ÜRÜNLER' }, link: '/en/new-arrivals' },
      { text: { 'en-US': 'THE HOLIDAY SHOP', 'tr-TR': 'TATİL MAĞAZASI' }, link: '/en/holiday' },
      { text: { 'en-US': 'THE GIFT GUIDE', 'tr-TR': 'HEDİYE REHBERİ' }, link: '/en/giftguide/all' },
      { text: { 'en-US': 'FOOTWEAR', 'tr-TR': 'AYAKKABI' }, link: '/en/shoes' },
    ];

    const categoryLinkIds: string[] = [];
    for (const linkData of categoryLinks) {
      const entry = await environment.createEntry('categoryLink', {
        fields: {
          text: linkData.text,
          link: { 'en-US': linkData.link },
        },
      });
      const published = await entry.publish();
      categoryLinkIds.push(published.sys.id);
      console.log(`✅ Created categoryLink: ${published.sys.id}`);
    }
    createdEntries.categoryLinks = categoryLinkIds;

    // 2. Create Category Banner
    console.log('\nCreating Category Banner...');
    const categoryBanner = await environment.createEntry('categoryBanner', {
      fields: {
        categories: {
          'en-US': categoryLinkIds.map((id) => ({
            sys: { type: 'Link', linkType: 'Entry', id },
          })),
        },
      },
    });
    const publishedCategoryBanner = await categoryBanner.publish();
    createdEntries.categoryBanner = publishedCategoryBanner.sys.id;
    console.log(`✅ Created categoryBanner: ${publishedCategoryBanner.sys.id}`);

    // 3. Create Tile Cards
    console.log('\nCreating Tile Cards...');
    const tileCards = [
      {
        title: { 'en-US': 'Graphics', 'tr-TR': 'Grafikler' },
        ctaText1: { 'en-US': 'SHOP WOMEN', 'tr-TR': 'KADIN ALIŞVERİŞ' },
        ctaLink1: '/en/womens/tops/graphic-tees',
        ctaText2: { 'en-US': 'SHOP MEN', 'tr-TR': 'ERKEK ALIŞVERİŞ' },
        ctaLink2: '/en/mens/graphic-tees',
      },
      {
        title: { 'en-US': 'Tops', 'tr-TR': 'Üst Giyim' },
        ctaText1: { 'en-US': 'SHOP WOMEN', 'tr-TR': 'KADIN ALIŞVERİŞ' },
        ctaLink1: '/en/womens/tops',
        ctaText2: { 'en-US': 'SHOP MEN', 'tr-TR': 'ERKEK ALIŞVERİŞ' },
        ctaLink2: '/en/mens/tops',
      },
      {
        title: { 'en-US': 'Hoodies & Sweatshirts', 'tr-TR': 'Kapüşonlu ve Sweatshirt' },
        ctaText1: { 'en-US': 'SHOP WOMEN', 'tr-TR': 'KADIN ALIŞVERİŞ' },
        ctaLink1: '/en/womens/sweatshirts-hoodies',
        ctaText2: { 'en-US': 'SHOP MEN', 'tr-TR': 'ERKEK ALIŞVERİŞ' },
        ctaLink2: '/en/mens/hoodies',
      },
      {
        title: { 'en-US': 'Sweatpants', 'tr-TR': 'Eşofman' },
        ctaText1: { 'en-US': 'SHOP WOMEN', 'tr-TR': 'KADIN ALIŞVERİŞ' },
        ctaLink1: '/en/womens/pants',
        ctaText2: { 'en-US': 'SHOP MEN', 'tr-TR': 'ERKEK ALIŞVERİŞ' },
        ctaLink2: '/en/mens/sweatpants',
      },
    ];

    const tileCardIds: string[] = [];
    for (const cardData of tileCards) {
      const entry = await environment.createEntry('tileCard', {
        fields: {
          title: cardData.title,
          image: {
            'en-US': {
              sys: { type: 'Link', linkType: 'Asset', id: placeholderAssetId },
            },
          },
          ctaText1: cardData.ctaText1,
          ctaLink1: { 'en-US': cardData.ctaLink1 },
          ctaText2: cardData.ctaText2,
          ctaLink2: { 'en-US': cardData.ctaLink2 },
        },
      });
      const published = await entry.publish();
      tileCardIds.push(published.sys.id);
      console.log(`✅ Created tileCard: ${published.sys.id}`);
    }
    createdEntries.tileCards = tileCardIds;

    // 4. Create Tile Section
    console.log('\nCreating Tile Section...');
    const tileSection = await environment.createEntry('tileSection', {
      fields: {
        title: {
          'en-US': 'ON THEIR WISHLIST',
          'tr-TR': 'İSTEK LİSTESİNDE',
        },
        tiles: {
          'en-US': tileCardIds.map((id) => ({
            sys: { type: 'Link', linkType: 'Entry', id },
          })),
        },
      },
    });
    const publishedTileSection = await tileSection.publish();
    createdEntries.tileSection = publishedTileSection.sys.id;
    console.log(`✅ Created tileSection: ${publishedTileSection.sys.id}`);

    // 5. Create Banner with Left/Right CTAs (replaces TwoCardLayout)
    console.log('\nCreating Banner with Left/Right CTAs...');
    const bannerWithTwoCards = await environment.createEntry('heroBanner', {
      fields: {
        title: {
          'en-US': 'Two Card Layout',
          'tr-TR': 'İki Kart Düzeni',
        },
        bannerType: {
          'en-US': 'hero',
        },
        image: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Asset', id: placeholderAssetId },
          },
        },
        // Left side CTA (replaces card1)
        ctaLeftWomen: {
          'en-US': 'Shop Collection',
        },
        ctaLeftWomenLink: {
          'en-US': '/en/field-of-study',
        },
        ctaLeftVerticalAlign: {
          'en-US': 'center',
        },
        // Right side CTA (replaces card2)
        ctaRightWomen: {
          'en-US': 'SHOP THE LOOKS',
        },
        ctaRightWomenLink: {
          'en-US': '/en/womens/party',
        },
        ctaRightVerticalAlign: {
          'en-US': 'center',
        },
        textPosition: {
          'en-US': 'left', // Use left to show CTAs on both sides
        },
      },
    });
    const publishedBannerWithTwoCards = await bannerWithTwoCards.publish();
    createdEntries.bannerWithTwoCards = publishedBannerWithTwoCards.sys.id;
    console.log(`✅ Created Banner with Two Cards: ${publishedBannerWithTwoCards.sys.id}`);

    // 7. Create Brand Cards
    console.log('\nCreating Brand Cards...');
    const brandCards = [
      {
        title: { 'en-US': 'Fear of God', 'tr-TR': 'Fear of God' },
        ctaText: { 'en-US': 'SHOP COLLECTION', 'tr-TR': 'KOLEKSİYONU İNCELE' },
        ctaLink: '/en/fog/fear-of-god',
      },
      {
        title: { 'en-US': 'John Galt', 'tr-TR': 'John Galt' },
        ctaText: { 'en-US': 'SHOP COLLECTION', 'tr-TR': 'KOLEKSİYONU İNCELE' },
        ctaLink: '/en/john-galt',
      },
      {
        title: { 'en-US': 'Lonely Ghost', 'tr-TR': 'Lonely Ghost' },
        ctaText: { 'en-US': 'SHOP COLLECTION', 'tr-TR': 'KOLEKSİYONU İNCELE' },
        ctaLink: '/en/lonely-ghost',
      },
      {
        title: { 'en-US': 'PS Vintage', 'tr-TR': 'PS Vintage' },
        ctaText: { 'en-US': 'SHOP COLLECTION', 'tr-TR': 'KOLEKSİYONU İNCELE' },
        ctaLink: '/en/ps-vintage',
      },
    ];

    const brandCardIds: string[] = [];
    for (const cardData of brandCards) {
      const entry = await environment.createEntry('brandCard', {
        fields: {
          title: cardData.title,
          image: {
            'en-US': {
              sys: { type: 'Link', linkType: 'Asset', id: placeholderAssetId },
            },
          },
          logo: {
            'en-US': {
              sys: { type: 'Link', linkType: 'Asset', id: placeholderAssetId },
            },
          },
          ctaText: cardData.ctaText,
          ctaLink: { 'en-US': cardData.ctaLink },
        },
      });
      const published = await entry.publish();
      brandCardIds.push(published.sys.id);
      console.log(`✅ Created brandCard: ${published.sys.id}`);
    }
    createdEntries.brandCards = brandCardIds;

    // 8. Create Brand Section
    console.log('\nCreating Brand Section...');
    const brandSection = await environment.createEntry('brandSection', {
      fields: {
        title: {
          'en-US': 'Our Most-Coveted Brands',
          'tr-TR': 'En Çok İstenen Markalar',
        },
        brandCards: {
          'en-US': brandCardIds.map((id) => ({
            sys: { type: 'Link', linkType: 'Entry', id },
          })),
        },
      },
    });
    const publishedBrandSection = await brandSection.publish();
    createdEntries.brandSection = publishedBrandSection.sys.id;
    console.log(`✅ Created brandSection: ${publishedBrandSection.sys.id}`);

    // 9. Create Promo Banner
    console.log('\nCreating Promo Banner...');
    const promoBanner = await environment.createEntry('promoBanner', {
      fields: {
        title: {
          'en-US': 'The Season of Gifting',
          'tr-TR': 'Hediye Sezonu',
        },
        image: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Asset', id: placeholderAssetId },
          },
        },
        ctaLink: { 'en-US': '/en/mens' },
      },
    });
    const publishedPromoBanner = await promoBanner.publish();
    createdEntries.promoBanner = publishedPromoBanner.sys.id;
    console.log(`✅ Created promoBanner: ${publishedPromoBanner.sys.id}`);

    // 10. Create Slim Banner
    console.log('\nCreating Slim Banner...');
    const slimBanner = await environment.createEntry('slimBanner', {
      fields: {
        title: {
          'en-US': 'Affirm Extra 10% Off',
          'tr-TR': 'Affirm Ekstra %10 İndirim',
        },
        image: {
          'en-US': {
            sys: { type: 'Link', linkType: 'Asset', id: placeholderAssetId },
          },
        },
        ctaLink: { 'en-US': '/en/giftguide' },
      },
    });
    const publishedSlimBanner = await slimBanner.publish();
    createdEntries.slimBanner = publishedSlimBanner.sys.id;
    console.log(`✅ Created slimBanner: ${publishedSlimBanner.sys.id}`);

    // 11. Update Home Page with all components
    console.log('\nUpdating Home Page...');
    const homePage = await environment.getEntry('3hcIvarV8U6WyA193AFPfT');
    homePage.fields.components = {
      'en-US': [
        { sys: { type: 'Link', linkType: 'Entry', id: publishedPromoBanner.sys.id } },
        { sys: { type: 'Link', linkType: 'Entry', id: publishedCategoryBanner.sys.id } },
        { sys: { type: 'Link', linkType: 'Entry', id: '6Ac7aRUAZSiPoUer1bOqUh' } }, // HeroBanner
        { sys: { type: 'Link', linkType: 'Entry', id: publishedSlimBanner.sys.id } },
        { sys: { type: 'Link', linkType: 'Entry', id: publishedTileSection.sys.id } },
        { sys: { type: 'Link', linkType: 'Entry', id: publishedBannerWithTwoCards.sys.id } },
        { sys: { type: 'Link', linkType: 'Entry', id: publishedBrandSection.sys.id } },
      ],
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

createHomePageEntries()
  .then(() => {
    console.log('Success!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });

