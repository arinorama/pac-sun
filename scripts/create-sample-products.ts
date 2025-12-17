import * as contentfulManagement from 'contentful-management';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN!;
const ENVIRONMENT_ID = process.env.CONTENTFUL_ENVIRONMENT || 'master';

interface SampleProduct {
  internalName: string;
  title: { 'en-US': string; 'tr-TR': string };
  slug: { 'en-US': string; 'tr-TR': string };
  sku: string;
  description: {
    'en-US': string;
    'tr-TR': string;
  };
  price: number;
  compareAtPrice?: number;
  brand: { 'en-US': string; 'tr-TR': string };
  colors: string[];
  sizes: string[];
  gender: 'men' | 'women' | 'unisex';
  tags: string[];
  categorySlug: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isSale?: boolean;
  stockQuantity: number;
}

const sampleProducts: SampleProduct[] = [
  // Socks Collection
  {
    internalName: 'Bow Ankle Socks - Blue/Purple',
    title: {
      'en-US': 'Bow Ankle Socks',
      'tr-TR': 'Fiyonklu Patik Çorap',
    },
    slug: {
      'en-US': 'bow-ankle-socks',
      'tr-TR': 'fiyonklu-patik-corap',
    },
    sku: 'SOCK-BOW-001',
    description: {
      'en-US': 'Cute bow-detailed ankle socks in blue and purple patterns. Perfect for everyday wear.',
      'tr-TR': 'Mavi ve mor desenli, şirin fiyonk detaylı patik çorap. Günlük kullanım için ideal.',
    },
    price: 6.0,
    brand: { 'en-US': 'John Galt', 'tr-TR': 'John Galt' },
    colors: ['Blue', 'Purple'],
    sizes: ['One Size'],
    gender: 'women',
    tags: ['ankle socks', 'bow', 'cute', 'accessories'],
    categorySlug: 'accessories',
    isBestseller: true,
    stockQuantity: 150,
  },
  {
    internalName: 'Pink Striped Ankle Socks',
    title: {
      'en-US': 'Pink Striped Ankle Socks',
      'tr-TR': 'Pembe Çizgili Patik Çorap',
    },
    slug: {
      'en-US': 'pink-striped-ankle-socks',
      'tr-TR': 'pembe-cizgili-patik-corap',
    },
    sku: 'SOCK-STRIPE-002',
    description: {
      'en-US': 'Classic pink striped ankle socks. Comfortable cotton blend.',
      'tr-TR': 'Klasik pembe çizgili patik çorap. Rahat pamuklu karışım.',
    },
    price: 6.0,
    brand: { 'en-US': 'John Galt', 'tr-TR': 'John Galt' },
    colors: ['Pink'],
    sizes: ['One Size'],
    gender: 'women',
    tags: ['ankle socks', 'striped', 'pink', 'accessories'],
    categorySlug: 'accessories',
    stockQuantity: 200,
  },
  {
    internalName: 'White & Red Heart Socks',
    title: {
      'en-US': 'White & Red Heart Socks',
      'tr-TR': 'Beyaz Kırmızı Kalp Desenli Çorap',
    },
    slug: {
      'en-US': 'white-red-heart-socks',
      'tr-TR': 'beyaz-kirmizi-kalp-desenli-corap',
    },
    sku: 'SOCK-HEART-003',
    description: {
      'en-US': 'Adorable white socks with tiny red heart pattern.',
      'tr-TR': 'Küçük kırmızı kalp desenli sevimli beyaz çoraplar.',
    },
    price: 6.0,
    brand: { 'en-US': 'John Galt', 'tr-TR': 'John Galt' },
    colors: ['White', 'Red'],
    sizes: ['One Size'],
    gender: 'women',
    tags: ['ankle socks', 'hearts', 'cute', 'accessories'],
    categorySlug: 'accessories',
    stockQuantity: 180,
  },
  {
    internalName: 'Teddy Bear Embroidered Ankle Socks',
    title: {
      'en-US': 'Teddy Bear Embroidered Ankle Socks',
      'tr-TR': 'Ayıcık İşlemeli Patik Çorap',
    },
    slug: {
      'en-US': 'teddy-bear-embroidered-ankle-socks',
      'tr-TR': 'ayicik-islemeli-patik-corap',
    },
    sku: 'SOCK-TEDDY-004',
    description: {
      'en-US': 'Premium ankle socks with embroidered teddy bear detail.',
      'tr-TR': 'İşlemeli ayıcık detaylı premium patik çorap.',
    },
    price: 8.0,
    brand: { 'en-US': 'John Galt', 'tr-TR': 'John Galt' },
    colors: ['White', 'Cream'],
    sizes: ['One Size'],
    gender: 'women',
    tags: ['ankle socks', 'teddy bear', 'embroidered', 'premium'],
    categorySlug: 'accessories',
    isNew: true,
    stockQuantity: 120,
  },
  // Hoodies Collection
  {
    internalName: 'Navy LA Applique Hoodie',
    title: {
      'en-US': 'Navy LA Applique Hoodie',
      'tr-TR': 'Lacivert LA Aplikeli Hoodie',
    },
    slug: {
      'en-US': 'navy-la-applique-hoodie',
      'tr-TR': 'lacivert-la-aplikeli-hoodie',
    },
    sku: 'HOOD-LA-001',
    description: {
      'en-US': 'Cozy navy hoodie with LA applique detail. Flash sale special!',
      'tr-TR': 'LA aplike detaylı rahat lacivert hoodie. Flaş indirim!',
    },
    price: 29.0,
    compareAtPrice: 54.95,
    brand: { 'en-US': 'Pacsun', 'tr-TR': 'Pacsun' },
    colors: ['Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    gender: 'unisex',
    tags: ['hoodie', 'LA', 'applique', 'navy', 'flash sale'],
    categorySlug: 'clothing',
    isSale: true,
    isBestseller: true,
    stockQuantity: 85,
  },
  {
    internalName: 'Green Vintage Wash Full Zip Hoodie',
    title: {
      'en-US': 'Green Vintage Wash Full Zip Hoodie',
      'tr-TR': 'Yeşil Vintage Yıkama Fermuarlı Hoodie',
    },
    slug: {
      'en-US': 'green-vintage-wash-full-zip-hoodie',
      'tr-TR': 'yesil-vintage-yikama-fermuar-hoodie',
    },
    sku: 'HOOD-VINTAGE-002',
    description: {
      'en-US': 'Full zip hoodie with vintage wash finish. Relaxed fit.',
      'tr-TR': 'Vintage yıkama efektli fermuarlı hoodie. Rahat kesim.',
    },
    price: 47.96,
    compareAtPrice: 59.95,
    brand: { 'en-US': 'Pacsun', 'tr-TR': 'Pacsun' },
    colors: ['Green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    gender: 'unisex',
    tags: ['hoodie', 'vintage wash', 'full zip', 'green'],
    categorySlug: 'clothing',
    isSale: true,
    stockQuantity: 60,
  },
  {
    internalName: 'Core Vintage Wash Pullover Hoodie',
    title: {
      'en-US': 'Core Vintage Wash Pullover Hoodie',
      'tr-TR': 'Core Vintage Yıkama Kapşonlu Sweatshirt',
    },
    slug: {
      'en-US': 'core-vintage-wash-pullover-hoodie',
      'tr-TR': 'core-vintage-yikama-kapsonlu-sweatshirt',
    },
    sku: 'HOOD-CORE-003',
    description: {
      'en-US': 'Essential pullover hoodie with vintage wash treatment.',
      'tr-TR': 'Vintage yıkama işlemli temel kapüşonlu sweatshirt.',
    },
    price: 29.0,
    compareAtPrice: 54.95,
    brand: { 'en-US': 'Pacsun', 'tr-TR': 'Pacsun' },
    colors: ['Gray', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    gender: 'unisex',
    tags: ['hoodie', 'vintage wash', 'pullover', 'core'],
    categorySlug: 'clothing',
    isSale: true,
    stockQuantity: 95,
  },
  {
    internalName: 'Vintage Washed Full Zip Hoodie',
    title: {
      'en-US': 'Vintage Washed Full Zip Hoodie',
      'tr-TR': 'Vintage Yıkamalı Fermuarlı Hoodie',
    },
    slug: {
      'en-US': 'vintage-washed-full-zip-hoodie',
      'tr-TR': 'vintage-yikamali-fermuar-hoodie',
    },
    sku: 'HOOD-WASH-004',
    description: {
      'en-US': 'Premium vintage washed full zip hoodie with distressed details.',
      'tr-TR': 'Eskitme detaylı premium vintage yıkamalı fermuarlı hoodie.',
    },
    price: 47.96,
    compareAtPrice: 59.95,
    brand: { 'en-US': 'Pacsun', 'tr-TR': 'Pacsun' },
    colors: ['Navy', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL'],
    gender: 'unisex',
    tags: ['hoodie', 'vintage', 'full zip', 'premium'],
    categorySlug: 'clothing',
    isSale: true,
    isNew: true,
    stockQuantity: 70,
  },
  // Additional Products
  {
    internalName: 'Graphic Logo Tee',
    title: {
      'en-US': 'Graphic Logo Tee',
      'tr-TR': 'Grafik Logo Tişört',
    },
    slug: {
      'en-US': 'graphic-logo-tee',
      'tr-TR': 'grafik-logo-tisort',
    },
    sku: 'TEE-LOGO-001',
    description: {
      'en-US': 'Classic graphic tee with brand logo. 100% cotton.',
      'tr-TR': 'Marka logosu ile klasik grafik tişört. %100 pamuk.',
    },
    price: 19.95,
    brand: { 'en-US': 'Pacsun', 'tr-TR': 'Pacsun' },
    colors: ['White', 'Black', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    gender: 'unisex',
    tags: ['tee', 'graphic', 'logo', 'cotton'],
    categorySlug: 'clothing',
    stockQuantity: 200,
  },
  {
    internalName: 'Slim Fit Denim Jeans',
    title: {
      'en-US': 'Slim Fit Denim Jeans',
      'tr-TR': 'Slim Fit Denim Pantolon',
    },
    slug: {
      'en-US': 'slim-fit-denim-jeans',
      'tr-TR': 'slim-fit-denim-pantolon',
    },
    sku: 'JEAN-SLIM-001',
    description: {
      'en-US': 'Classic slim fit denim jeans. Medium wash.',
      'tr-TR': 'Klasik slim fit denim pantolon. Orta yıkama.',
    },
    price: 49.95,
    brand: { 'en-US': 'Pacsun', 'tr-TR': 'Pacsun' },
    colors: ['Blue'],
    sizes: ['26', '27', '28', '29', '30', '31', '32'],
    gender: 'unisex',
    tags: ['jeans', 'denim', 'slim fit', 'pants'],
    categorySlug: 'clothing',
    isBestseller: true,
    stockQuantity: 150,
  },
];

async function createProducts() {
  try {
    console.log('🚀 Starting sample products creation...\n');

    const client = contentfulManagement.createClient({
      accessToken: MANAGEMENT_TOKEN,
    });

    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);

    // First, ensure categories exist or create them
    console.log('📁 Checking/creating categories...\n');
    const categoryMap = new Map<string, string>();

    const categoriesToCreate = [
      {
        slug: 'clothing',
        title: { 'en-US': 'Clothing', 'tr-TR': 'Giyim' },
        description: { 'en-US': 'Clothing items', 'tr-TR': 'Giyim ürünleri' },
      },
      {
        slug: 'accessories',
        title: { 'en-US': 'Accessories', 'tr-TR': 'Aksesuarlar' },
        description: { 'en-US': 'Fashion accessories', 'tr-TR': 'Moda aksesuarları' },
      },
    ];

    for (const cat of categoriesToCreate) {
      try {
        // Check if category exists
        const existingCategories = await environment.getEntries({
          content_type: 'category',
          'fields.slug[match]': cat.slug,
          limit: 1,
        });

        if (existingCategories.items.length > 0) {
          categoryMap.set(cat.slug, existingCategories.items[0].sys.id);
          console.log(`   ✓ Category exists: ${cat.slug}`);
        } else {
          // Create category
          const categoryEntry = await environment.createEntry('category', {
            fields: {
              title: cat.title,
              slug: { 'en-US': cat.slug, 'tr-TR': cat.slug },
              description: cat.description,
            },
          });
          await categoryEntry.publish();
          categoryMap.set(cat.slug, categoryEntry.sys.id);
          console.log(`   ✅ Created category: ${cat.slug}`);
        }
      } catch (error) {
        console.error(`   ❌ Failed to create category ${cat.slug}:`, error);
      }
    }

    console.log('\n📦 Creating products...\n');

    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (const product of sampleProducts) {
      try {
        console.log(`📦 Creating: ${product.internalName}...`);

        // Check if product already exists
        const existingEntries = await environment.getEntries({
          content_type: 'product',
          'fields.sku': product.sku,
          limit: 1,
        });

        if (existingEntries.items.length > 0) {
          console.log(`   ⏭️  Skipped (already exists): ${product.sku}\n`);
          skipped++;
          continue;
        }

        // Get category ID
        const categoryId = categoryMap.get(product.categorySlug);
        if (!categoryId) {
          console.log(`   ❌ Category not found: ${product.categorySlug}\n`);
          failed++;
          continue;
        }

        // Create product entry (without images for now - they're required but we'll add placeholder logic)
        const entry = await environment.createEntry('product', {
          fields: {
            internalName: { 'en-US': product.internalName },
            title: product.title,
            slug: product.slug,
            sku: { 'en-US': product.sku },
            description: {
              'en-US': {
                nodeType: 'document',
                content: [
                  {
                    nodeType: 'paragraph',
                    content: [
                      {
                        nodeType: 'text',
                        value: product.description['en-US'],
                        marks: [],
                        data: {},
                      },
                    ],
                    data: {},
                  },
                ],
                data: {},
              },
              'tr-TR': {
                nodeType: 'document',
                content: [
                  {
                    nodeType: 'paragraph',
                    content: [
                      {
                        nodeType: 'text',
                        value: product.description['tr-TR'],
                        marks: [],
                        data: {},
                      },
                    ],
                    data: {},
                  },
                ],
                data: {},
              },
            },
            price: { 'en-US': product.price },
            ...(product.compareAtPrice && {
              compareAtPrice: { 'en-US': product.compareAtPrice },
            }),
            category: {
              'en-US': {
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id: categoryId,
                },
              },
            },
            colors: { 'en-US': product.colors },
            sizes: { 'en-US': product.sizes },
            gender: { 'en-US': product.gender },
            tags: { 'en-US': product.tags },
            stockQuantity: { 'en-US': product.stockQuantity },
            // Note: images field is required but we're creating without it
            // You'll need to manually add images in Contentful UI
            images: { 'en-US': [] }, // Empty array to satisfy required field
            ...(product.isNew && { isNew: { 'en-US': product.isNew } }),
            ...(product.isBestseller && {
              isBestseller: { 'en-US': product.isBestseller },
            }),
            ...(product.isSale && { isSale: { 'en-US': product.isSale } }),
          },
        });

        // Note: Don't publish entries without images if images are required for publishing
        // Just create as draft
        console.log(`   ✅ Created (draft): ${product.sku} - Add images in Contentful UI to publish\n`);
        created++;
      } catch (error) {
        console.error(`   ❌ Failed to create ${product.sku}:`, error);
        failed++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📦 Total: ${sampleProducts.length}\n`);
    console.log('ℹ️  Note: Products created as drafts. Add images in Contentful UI to publish them.\n');
    console.log('✨ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createProducts();
