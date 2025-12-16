import { Banner } from '@/components/organisms/Banner';
import { CategoryBanner } from '@/components/organisms/CategoryBanner';
import { TileSection } from '@/components/organisms/TileSection';
import { BrandSection } from '@/components/organisms/BrandSection';
import { ProductCarousel } from '@/components/organisms/ProductCarousel';
import { FooterPromoSection } from '@/components/organisms/FooterPromoSection';
import { StyledByYouSection } from '@/components/organisms/StyledByYouSection';
import type { ReactElement, ComponentType } from 'react';

// Contentful component from CMS (dynamic type with sys metadata)
export interface ContentfulComponent {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields?: Record<string, unknown>;
}

// Union type of all supported content types
export type ContentTypeId =
  | 'banner'
  | 'heroBanner'
  | 'slimBanner'
  | 'promoBanner'
  | 'twoCardLayout'
  | 'categoryBanner'
  | 'tileSection'
  | 'brandSection'
  | 'productCarousel'
  | 'footerPromoSection'
  | 'styledByYouSection';

export interface ComponentConfig {
  component: ComponentType<Record<string, unknown>>;
  propName: string;
  withLocale?: boolean;
}

// Component registry: Mapped type ensures all ContentTypeIds are covered
// Using double assertion (as unknown as) for type-safe heterogeneous component collection
export const COMPONENT_REGISTRY: Record<ContentTypeId, ComponentConfig> = {
  banner: { component: Banner as unknown as ComponentType<Record<string, unknown>>, propName: 'banner' },
  heroBanner: { component: Banner as unknown as ComponentType<Record<string, unknown>>, propName: 'banner' },
  slimBanner: { component: Banner as unknown as ComponentType<Record<string, unknown>>, propName: 'banner' },
  promoBanner: { component: Banner as unknown as ComponentType<Record<string, unknown>>, propName: 'banner' },
  twoCardLayout: { component: Banner as unknown as ComponentType<Record<string, unknown>>, propName: 'banner' },
  categoryBanner: { component: CategoryBanner as unknown as ComponentType<Record<string, unknown>>, propName: 'banner' },
  tileSection: { component: TileSection as unknown as ComponentType<Record<string, unknown>>, propName: 'section' },
  brandSection: { component: BrandSection as unknown as ComponentType<Record<string, unknown>>, propName: 'section' },
  productCarousel: { component: ProductCarousel as unknown as ComponentType<Record<string, unknown>>, propName: 'carousel', withLocale: true },
  footerPromoSection: { component: FooterPromoSection as unknown as ComponentType<Record<string, unknown>>, propName: 'section' },
  styledByYouSection: { component: StyledByYouSection as unknown as ComponentType<Record<string, unknown>>, propName: 'section', withLocale: true },
};

// Type guard to check if a string is a valid ContentTypeId
export const isValidContentType = (type: string): type is ContentTypeId => {
  return type in COMPONENT_REGISTRY;
};

// Configuration for component rendering
export interface RenderConfig {
  locale?: string;
}

/**
 * Renders a Contentful component dynamically based on its content type
 * @param component - The Contentful component to render
 * @param config - Additional configuration (e.g., locale)
 * @returns React element or null
 */
export const renderContentfulComponent = (
  component: ContentfulComponent,
  config: RenderConfig = {}
): ReactElement | null => {
  // Skip if component or contentType is undefined
  if (!component?.sys?.contentType?.sys?.id) {
    console.warn('Skipping component with undefined contentType:', component);
    return null;
  }

  const contentType = component.sys.contentType.sys.id;

  // Skip headerPromoCarousel (rendered in layout)
  if (contentType === 'headerPromoCarousel') {
    return null;
  }

  // Type guard: Validate contentType and narrow type
  if (!isValidContentType(contentType)) {
    console.warn(`Unknown content type: ${contentType}`);
    return null;
  }

  const registryConfig = COMPONENT_REGISTRY[contentType];
  const { component: Component, propName, withLocale } = registryConfig;

  // Build props dynamically (excluding key - React best practice)
  const componentProps: Record<string, unknown> = {
    [propName]: component,
    ...(withLocale && config.locale && { locale: config.locale }),
  };

  return <Component key={component.sys.id} {...componentProps} />;
};

