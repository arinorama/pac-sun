import { Banner } from '@/components/organisms/Banner';
import { CategoryBanner } from '@/components/organisms/CategoryBanner';
import { TileSection } from '@/components/organisms/TileSection';
import { BrandSection } from '@/components/organisms/BrandSection';
import { ProductCarousel } from '@/components/organisms/ProductCarousel';
import { FooterPromoSection } from '@/components/organisms/FooterPromoSection';
import { StyledByYouSection } from '@/components/organisms/StyledByYouSection';
import type { Entry } from 'contentful';
import type { Page } from '@/types/page';

interface HomeTemplateProps {
  page: Page;
  locale?: string;
}

export function HomeTemplate({ page, locale = 'en' }: HomeTemplateProps) {
  const components = page.fields.components || [];

  // Helper to determine if component needs bottom margin
  const needsBottomMargin = (contentType: string, index: number) => {
    // Add margin between banner types and other sections
    const isBanner = ['banner', 'heroBanner', 'slimBanner', 'promoBanner'].includes(contentType);
    const isCategoryBanner = contentType === 'categoryBanner';
    
    // Don't add margin to the last component
    if (index === components.length - 1) return false;
    
    // Add margin to banners and category banners
    return isBanner || isCategoryBanner;
  };

  return (
    <div data-component="HomeTemplate">
      {components.map((component, index) => {
        // Skip if component or contentType is undefined (deleted content types)
        if (!component?.sys?.contentType?.sys?.id) {
          console.warn('Skipping component with undefined contentType:', component);
          return null;
        }

        const contentType = component.sys.contentType.sys.id;
        const marginClass = needsBottomMargin(contentType, index) ? 'mb-5' : '';

        switch (contentType) {
          case 'headerPromoCarousel':
            // HeaderPromoCarousel is now rendered in the layout, skip it here
            return null;
          case 'banner':
          case 'heroBanner':
          case 'slimBanner':
          case 'promoBanner':
            return (
              <div key={component.sys.id} className={marginClass}>
                <Banner
                  banner={component as Entry<unknown>}
                />
              </div>
            );
          case 'categoryBanner':
            return (
              <div key={component.sys.id} className={marginClass}>
                <CategoryBanner
                  banner={component as Entry<unknown>}
                />
              </div>
            );
          case 'tileSection':
            return (
              <TileSection
                key={component.sys.id}
                section={component as Entry<unknown>}
              />
            );
          case 'twoCardLayout':
            // TwoCardLayout is deprecated - use Banner with left/right CTAs instead
            // Map twoCardLayout to Banner format
            return (
              <div key={component.sys.id} className={marginClass}>
                <Banner
                  banner={component as Entry<unknown>}
                />
              </div>
            );
          case 'brandSection':
            return (
              <BrandSection
                key={component.sys.id}
                section={component as Entry<unknown>}
              />
            );
          case 'productCarousel':
            return (
              <ProductCarousel
                key={component.sys.id}
                carousel={component as Entry<unknown>}
                locale={locale}
              />
            );
          case 'footerPromoSection':
            return (
              <FooterPromoSection
                key={component.sys.id}
                section={component as Entry<unknown>}
              />
            );
          case 'styledByYouSection':
            return (
              <StyledByYouSection
                key={component.sys.id}
                section={component as Entry<unknown>}
                locale={locale}
              />
            );
          default:
            console.warn(`Unknown content type: ${contentType}`);
            return null;
        }
      })}
    </div>
  );
}

