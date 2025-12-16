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

async function updateHomePageWithFooterPromo(footerPromoSectionId: string) {
  try {
    const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment('master');

    const homePageEntry = await environment.getEntry('3hcIvarV8U6WyA193AFPfT'); // ID of the 'home' page entry

    const currentComponents = homePageEntry.fields.components?.['en-US'] || [];
    
    // Check if footerPromoSection already exists
    const exists = currentComponents.some(
      (comp: any) => comp.sys.id === footerPromoSectionId
    );

    if (!exists) {
      const newComponents = [
        ...currentComponents,
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: footerPromoSectionId,
          },
        },
      ];

      homePageEntry.fields.components = {
        'en-US': newComponents,
      };

      const updatedEntry = await homePageEntry.update();
      await updatedEntry.publish();
      console.log('✅ Updated home page with FooterPromoSection');
    } else {
      console.log('⚠️  FooterPromoSection already exists in home page');
    }
  } catch (error) {
    console.error('❌ Error updating/publishing home page entry:', error);
    throw error;
  }
}

async function main() {
  const space = await managementClient.getSpace(process.env.CONTENTFUL_SPACE_ID!);
  const environment = await space.getEnvironment('master');

  const createdEntryIds: { [key: string]: string | string[] } = {};

  console.log('Creating Footer Promo Cards...');

  // Footer Promo Card 1: PacCares (#BETHECHANGE)
  const footerPromoCard1Id = await createAndPublishEntry(
    environment,
    'footerPromoCard',
    'footerPromoCardPacCares',
    {
      title: {
        'en-US': 'PacCares',
        'tr-TR': 'PacCares',
      },
      hashtag: {
        'en-US': '#BETHECHANGE',
        'tr-TR': '#BETHECHANGE',
      },
      image: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: '1Do1DRekQnXD6wpsaPxnZg', // Placeholder asset ID - replace with actual image
          },
        },
      },
      description: {
        'en-US': 'Through partnerships with Rare Impact Fund, the LA Rams, LAFC, and more, our philanthropic initiative makes a meaningful impact in our communities.',
        'tr-TR': 'Rare Impact Fund, LA Rams, LAFC ve daha fazlasıyla ortaklıklarımız sayesinde, hayırsever girişimimiz topluluklarımızda anlamlı bir etki yaratıyor.',
      },
      ctaText: {
        'en-US': 'LEARN MORE & SHOP',
        'tr-TR': 'DAHA FAZLA BİLGİ & ALIŞVERİŞ',
      },
      ctaLink: {
        'en-US': '/en/paccares',
      },
    }
  );

  // Footer Promo Card 2: RARE DNM EDIT (#GIVEBACK)
  const footerPromoCard2Id = await createAndPublishEntry(
    environment,
    'footerPromoCard',
    'footerPromoCardRareDnm',
    {
      title: {
        'en-US': 'RARE DNM EDIT',
        'tr-TR': 'RARE DNM EDIT',
      },
      hashtag: {
        'en-US': '#GIVEBACK',
        'tr-TR': '#GIVEBACK',
      },
      image: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: '1Do1DRekQnXD6wpsaPxnZg', // Placeholder asset ID - replace with actual image
          },
        },
      },
      description: {
        'en-US': 'Every purchase supports the Rare Impact Fund in expanding access to mental health services and education for young people globally. Learn more about the Rare Impact Fund at www.rareimpactfund.org',
        'tr-TR': 'Her satın alma, Rare Impact Fund\'un gençler için küresel olarak ruh sağlığı hizmetleri ve eğitime erişimi genişletmesini destekler. Rare Impact Fund hakkında daha fazla bilgi için www.rareimpactfund.org adresini ziyaret edin.',
      },
      ctaText: {
        'en-US': 'SHOP NOW',
        'tr-TR': 'ŞİMDİ ALIŞVERİŞ YAP',
      },
      ctaLink: {
        'en-US': '/en/rare-dnm-edit',
      },
    }
  );

  // Footer Promo Card 3: New Pacsun Rewards (#NEWPACSUNREWARDS)
  const footerPromoCard3Id = await createAndPublishEntry(
    environment,
    'footerPromoCard',
    'footerPromoCardRewards',
    {
      title: {
        'en-US': 'The Perks Are Endless',
        'tr-TR': 'Ayrıcalıklar Sonsuz',
      },
      hashtag: {
        'en-US': '#NEWPACSUNREWARDS',
        'tr-TR': '#NEWPACSUNREWARDS',
      },
      image: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: '1Do1DRekQnXD6wpsaPxnZg', // Placeholder asset ID - replace with actual image
          },
        },
      },
      description: {
        'en-US': 'Earn 1 point for every $1 purchased, early access to exclusive drops, double points + a gift for your birthday, and so much more. Sign up now to receive a $5 Welcome Reward!',
        'tr-TR': 'Her 1$ satın alma için 1 puan kazanın, özel ürünlere erken erişim, çift puan + doğum gününüz için hediye ve çok daha fazlası. Şimdi kaydolun ve 5$ Hoş Geldin Ödülü alın!',
      },
      ctaText: {
        'en-US': 'LEARN MORE',
        'tr-TR': 'DAHA FAZLA BİLGİ',
      },
      ctaLink: {
        'en-US': '/en/rewards',
      },
    }
  );

  // Footer Promo Card 4: Student Discount (#STUDENTDISCOUNT)
  const footerPromoCard4Id = await createAndPublishEntry(
    environment,
    'footerPromoCard',
    'footerPromoCardStudentDiscount',
    {
      title: {
        'en-US': 'Students Get 10% Off',
        'tr-TR': 'Öğrenciler %10 İndirim Alır',
      },
      hashtag: {
        'en-US': '#STUDENTDISCOUNT',
        'tr-TR': '#STUDENTDISCOUNT',
      },
      image: {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: '1Do1DRekQnXD6wpsaPxnZg', // Placeholder asset ID - replace with actual image
          },
        },
      },
      description: {
        'en-US': 'Best Dressed, here you come. Save on your entire order every time you shop when you verify your student status with UNIDAYS.',
        'tr-TR': 'En İyi Giyinen, işte buradasın. UNIDAYS ile öğrenci durumunuzu doğruladığınızda her alışverişte tüm siparişinizde tasarruf edin.',
      },
      ctaText: {
        'en-US': 'LEARN MORE',
        'tr-TR': 'DAHA FAZLA BİLGİ',
      },
      ctaLink: {
        'en-US': '/en/student-discount',
      },
    }
  );

  createdEntryIds.footerPromoCards = [
    footerPromoCard1Id,
    footerPromoCard2Id,
    footerPromoCard3Id,
    footerPromoCard4Id,
  ];

  console.log('\nCreating Footer Promo Section...');
  const footerPromoSectionId = await createAndPublishEntry(
    environment,
    'footerPromoSection',
    'footerPromoSection',
    {
      title: {
        'en-US': 'Footer Promo Section',
        'tr-TR': 'Footer Promo Bölümü',
      },
      promoCards: {
        'en-US': createdEntryIds.footerPromoCards.map((id) => ({
          sys: { type: 'Link', linkType: 'Entry', id: id as string },
        })),
      },
    }
  );
  createdEntryIds.footerPromoSection = footerPromoSectionId;

  console.log('\nUpdating Home Page...');
  await updateHomePageWithFooterPromo(footerPromoSectionId);

  console.log('\n✅ All Footer Promo entries created successfully!');
  console.log('\nCreated Entry IDs:\n', JSON.stringify(createdEntryIds, null, 2));
  console.log('\n⚠️  IMPORTANT: Remember to replace placeholder asset IDs with actual image assets!');
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

