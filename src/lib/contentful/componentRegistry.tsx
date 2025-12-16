import { Banner } from '@/components/organisms/Banner';
import { CategoryBanner } from '@/components/organisms/CategoryBanner';
import { TileSection } from '@/components/organisms/TileSection';
import { BrandSection } from '@/components/organisms/BrandSection';
import { ProductCarousel } from '@/components/organisms/ProductCarousel';
import { FooterPromoSection } from '@/components/organisms/FooterPromoSection';
import { StyledByYouSection } from '@/components/organisms/StyledByYouSection';
import type { ReactElement } from 'react';

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

// Strategy Pattern: Component render context
export interface ComponentRenderContext {
  component: ContentfulComponent;
  locale?: string;
}

// Strategy Pattern: Component render strategy type
type ComponentRenderStrategy = (context: ComponentRenderContext) => ReactElement | null;

// Simple type cast helper - ContentfulComponent is the correct type at runtime
const cast = <T,>(c: ContentfulComponent): T => c as unknown as T;

// Strategy Pattern: Component render strategies for each content type
const renderBanner: ComponentRenderStrategy = ({ component }) => (
  <Banner key={component.sys.id} banner={cast(component)} />
);

const renderHeroBanner: ComponentRenderStrategy = ({ component }) => (
  <Banner key={component.sys.id} banner={cast(component)} />
);

const renderSlimBanner: ComponentRenderStrategy = ({ component }) => (
  <Banner key={component.sys.id} banner={cast(component)} />
);

const renderPromoBanner: ComponentRenderStrategy = ({ component }) => (
  <Banner key={component.sys.id} banner={cast(component)} />
);

const renderTwoCardLayout: ComponentRenderStrategy = ({ component }) => (
  <Banner key={component.sys.id} banner={cast(component)} />
);

const renderCategoryBanner: ComponentRenderStrategy = ({ component }) => (
  <CategoryBanner key={component.sys.id} banner={cast(component)} />
);

const renderTileSection: ComponentRenderStrategy = ({ component }) => (
  <TileSection key={component.sys.id} section={cast(component)} />
);

const renderBrandSection: ComponentRenderStrategy = ({ component }) => (
  <BrandSection key={component.sys.id} section={cast(component)} />
);

const renderProductCarousel: ComponentRenderStrategy = ({ component, locale }) => (
  <ProductCarousel key={component.sys.id} carousel={cast(component)} locale={locale} />
);

const renderFooterPromoSection: ComponentRenderStrategy = ({ component }) => (
  <FooterPromoSection key={component.sys.id} section={cast(component)} />
);

const renderStyledByYouSection: ComponentRenderStrategy = ({ component, locale }) => (
  <StyledByYouSection key={component.sys.id} section={cast(component)} locale={locale} />
);

// Strategy Pattern: Component type strategy map - type-safe and extensible
const componentRenderStrategies: Record<ContentTypeId, ComponentRenderStrategy> = {
  banner: renderBanner,
  heroBanner: renderHeroBanner,
  slimBanner: renderSlimBanner,
  promoBanner: renderPromoBanner,
  twoCardLayout: renderTwoCardLayout,
  categoryBanner: renderCategoryBanner,
  tileSection: renderTileSection,
  brandSection: renderBrandSection,
  productCarousel: renderProductCarousel,
  footerPromoSection: renderFooterPromoSection,
  styledByYouSection: renderStyledByYouSection,
};

// Type guard to check if a string is a valid ContentTypeId
export const isValidContentType = (type: string): type is ContentTypeId => {
  return type in componentRenderStrategies;
};

// Configuration for component rendering
export interface RenderConfig {
  locale?: string;
}

// Renders a Contentful component dynamically based on its content type using Strategy Pattern
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

  // Get the appropriate render strategy
  const renderStrategy = componentRenderStrategies[contentType];

  // Render context for strategy pattern
  const renderContext: ComponentRenderContext = {
    component,
    locale: config.locale,
  };

  // Execute the strategy
  return renderStrategy(renderContext);
};

