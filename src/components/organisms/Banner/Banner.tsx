import Image from 'next/image';
import { cva } from 'class-variance-authority';
import { getImageUrl } from '@/lib/contentful/queries';
import type { Entry, EntryFieldTypes, Asset as ContentfulAsset } from 'contentful';
import { CTALink } from '@/components/molecules/CTALink';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/utils';

type VerticalAlign = 'top' | 'center' | 'bottom';
type BannerType = 'hero' | 'slim' | 'promo';
type TextPosition = 'left' | 'center' | 'right';

// Helper function moved outside component for better performance
function getVerticalAlignClass(align: VerticalAlign): string {
  switch (align) {
    case 'top':
      return 'justify-start pt-12 md:pt-16';
    case 'bottom':
      return 'justify-end pb-12 md:pb-16';
    case 'center':
    default:
      return 'justify-center';
  }
}

// Simple helper for Contentful type to string conversion
const str = (v: EntryFieldTypes.Symbol | EntryFieldTypes.Text | undefined): string => {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return String(v);
};

// CVA variants moved outside component - they're static and shouldn't be recreated
const bannerContainerVariants = cva('relative w-full overflow-hidden', {
  variants: {
    bannerType: {
      hero: 'h-[500px] md:h-[600px] lg:h-[700px]',
      slim: 'h-auto',
      promo: 'h-auto',
    },
  },
  defaultVariants: {
    bannerType: 'hero',
  },
});

const bannerTitleVariants = cva('text-brand-white my-2 uppercase leading-none', {
  variants: {
    bannerType: {
      hero: 'text-5xl font-poppins font-normal tracking-normal',
      slim: 'text-2xl md:text-3xl font-sans font-bold tracking-normal',
      promo: 'text-2xl md:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight',
    },
  },
  defaultVariants: {
    bannerType: 'hero',
  },
});

const bannerSubtitleVariants = cva('text-brand-white mb-6 max-w-3xl font-medium', {
  variants: {
    bannerType: {
      hero: 'text-base md:text-lg lg:text-xl tracking-normal',
      slim: 'text-base md:text-lg tracking-normal',
      promo: 'text-sm md:text-base lg:text-lg tracking-tight',
    },
  },
  defaultVariants: {
    bannerType: 'hero',
  },
});

interface BannerFields {
  contentTypeId: 'heroBanner';
  fields: {
    title: EntryFieldTypes.Symbol;
    bannerType: EntryFieldTypes.Symbol<BannerType>;
    subtitle?: EntryFieldTypes.Text;
    leftTitle?: EntryFieldTypes.Symbol;
    rightTitle?: EntryFieldTypes.Symbol;
    image: EntryFieldTypes.AssetLink;
    mobileImage?: EntryFieldTypes.AssetLink;
    // Legacy CTAs (center position, for backward compatibility)
    ctaMen?: EntryFieldTypes.Symbol;
    ctaMenLink?: EntryFieldTypes.Symbol;
    ctaWomen?: EntryFieldTypes.Symbol;
    ctaWomenLink?: EntryFieldTypes.Symbol;
    ctaKids?: EntryFieldTypes.Symbol;
    ctaKidsLink?: EntryFieldTypes.Symbol;
    // Left side CTAs
    ctaLeftMen?: EntryFieldTypes.Symbol;
    ctaLeftMenLink?: EntryFieldTypes.Symbol;
    ctaLeftWomen?: EntryFieldTypes.Symbol;
    ctaLeftWomenLink?: EntryFieldTypes.Symbol;
    ctaLeftKids?: EntryFieldTypes.Symbol;
    ctaLeftKidsLink?: EntryFieldTypes.Symbol;
    ctaLeftVerticalAlign?: EntryFieldTypes.Symbol<VerticalAlign>;
    // Right side CTAs
    ctaRightMen?: EntryFieldTypes.Symbol;
    ctaRightMenLink?: EntryFieldTypes.Symbol;
    ctaRightWomen?: EntryFieldTypes.Symbol;
    ctaRightWomenLink?: EntryFieldTypes.Symbol;
    ctaRightKids?: EntryFieldTypes.Symbol;
    ctaRightKidsLink?: EntryFieldTypes.Symbol;
    ctaRightVerticalAlign?: EntryFieldTypes.Symbol<VerticalAlign>;
    textPosition?: EntryFieldTypes.Symbol<TextPosition>;
    backgroundColor?: EntryFieldTypes.Symbol;
  };
}

interface BannerProps {
  readonly banner: Entry<BannerFields, undefined, string>;
}

// Strategy Pattern: Banner render context
interface BannerRenderContext {
  fields: BannerFields['fields'];
  bannerType: BannerType;
  imageUrl: string;
  mobileImageUrl: string;
  textPosition: TextPosition;
  ctaLeftVerticalAlign: VerticalAlign;
  ctaRightVerticalAlign: VerticalAlign;
  renderCTAs: (side: 'left' | 'right' | 'center') => React.ReactNode;
}

// Banner render strategy type
type BannerRenderStrategy = (context: BannerRenderContext) => React.ReactNode;

export function Banner({ banner }: BannerProps) {
  const fields = banner.fields;
  const bannerType = fields.bannerType || 'hero';
  const imageUrl = getImageUrl(fields.image as ContentfulAsset);
  const mobileImageUrl = fields.mobileImage
    ? getImageUrl(fields.mobileImage as ContentfulAsset)
    : imageUrl;
  const textPosition = fields.textPosition || 'center';
  const ctaLeftVerticalAlign = fields.ctaLeftVerticalAlign || 'center';
  const ctaRightVerticalAlign = fields.ctaRightVerticalAlign || 'center';

  // Helper function to render CTAs - kept inside because it uses component props
  const renderCTAs = (side: 'left' | 'right' | 'center') => {
    let ctaMen, ctaMenLink, ctaWomen, ctaWomenLink, ctaKids, ctaKidsLink;

    if (side === 'left') {
      ctaMen = fields.ctaLeftMen;
      ctaMenLink = fields.ctaLeftMenLink;
      ctaWomen = fields.ctaLeftWomen;
      ctaWomenLink = fields.ctaLeftWomenLink;
      ctaKids = fields.ctaLeftKids;
      ctaKidsLink = fields.ctaLeftKidsLink;
    } else if (side === 'right') {
      ctaMen = fields.ctaRightMen;
      ctaMenLink = fields.ctaRightMenLink;
      ctaWomen = fields.ctaRightWomen;
      ctaWomenLink = fields.ctaRightWomenLink;
      ctaKids = fields.ctaRightKids;
      ctaKidsLink = fields.ctaRightKidsLink;
    } else {
      // Center - use legacy fields for backward compatibility
      ctaMen = fields.ctaMen;
      ctaMenLink = fields.ctaMenLink;
      ctaWomen = fields.ctaWomen;
      ctaWomenLink = fields.ctaWomenLink;
      ctaKids = fields.ctaKids;
      ctaKidsLink = fields.ctaKidsLink;
    }

    if (!ctaMen && !ctaWomen && !ctaKids) {
      return null;
    }

    return (
      <div className="flex gap-4 md:gap-6 flex-wrap justify-center text-base">
        {ctaMen && ctaMenLink && (
          <CTALink
            data-component={`Banner.CTA${side === 'center' ? '' : side.charAt(0).toUpperCase() + side.slice(1)}Men`}
            href={ctaMenLink}
            variant="banner"
          >
            {ctaMen}
          </CTALink>
        )}
        {ctaWomen && ctaWomenLink && (
          <CTALink
            data-component={`Banner.CTA${side === 'center' ? '' : side.charAt(0).toUpperCase() + side.slice(1)}Women`}
            href={ctaWomenLink}
            variant="banner"
          >
            {ctaWomen}
          </CTALink>
        )}
        {ctaKids && ctaKidsLink && (
          <CTALink
            data-component={`Banner.CTA${side === 'center' ? '' : side.charAt(0).toUpperCase() + side.slice(1)}Kids`}
            href={ctaKidsLink}
            variant="banner"
          >
            {ctaKids}
          </CTALink>
        )}
      </div>
    );
  };

  // Strategy Pattern: Banner type render strategies
  const renderSlimBanner: BannerRenderStrategy = ({ imageUrl, mobileImageUrl, fields }) => (
    <div
      data-component="Banner"
      data-banner-type="slim"
      className="relative w-full"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={imageUrl} />
        <img
          src={mobileImageUrl}
          alt={str(fields.title) || 'Banner'}
          className="w-full h-auto"
        />
      </picture>
    </div>
  );

  const renderPromoBanner: BannerRenderStrategy = ({ imageUrl, mobileImageUrl, fields, renderCTAs }) => (
    <div
      data-component="Banner"
      data-banner-type="promo"
      className="relative w-full"
    >
      <picture>
        <source media="(min-width: 768px)" srcSet={imageUrl} />
        <img
          src={mobileImageUrl}
          alt={str(fields.title) || 'Banner'}
          className="w-full h-auto"
        />
      </picture>
      
      {/* CTAs overlay - positioned from bottom */}
      {(fields.ctaMen || fields.ctaWomen || fields.ctaKids) && (
        <div 
          data-component="Banner.CTAOverlay"
          className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-3"
        >
          {renderCTAs('center')}
        </div>
      )}
    </div>
  );

  const renderHeroBanner: BannerRenderStrategy = ({
    fields,
    imageUrl,
    mobileImageUrl,
    bannerType,
    textPosition,
    ctaLeftVerticalAlign,
    ctaRightVerticalAlign,
    renderCTAs,
  }) => (
    <div
      data-component="Banner"
      data-banner-type={bannerType}
      className={cn(bannerContainerVariants({ bannerType }))}
      style={fields.backgroundColor ? { backgroundColor: str(fields.backgroundColor) } : undefined}
    >
      <div
        data-component="Banner.ImageWrapper"
        className="absolute inset-0"
      >
        <Image
          data-component="Banner.Image"
          src={imageUrl}
          alt={str(fields.title)}
          fill
          className="object-cover hidden md:block"
          priority={bannerType === 'hero'}
          sizes="100vw"
        />
        <Image
          data-component="Banner.MobileImage"
          src={mobileImageUrl}
          alt={str(fields.title)}
          fill
          className="object-cover md:hidden"
          priority={bannerType === 'hero'}
          sizes="100vw"
        />
      </div>
      {/* Banner.Content: CSS Grid layout with two equal halves for left/right titles/CTAs */}
      <div
        data-component="Banner.Content"
        className={cn(
          'relative z-10 h-full w-full',
          (fields.leftTitle || fields.rightTitle || textPosition !== 'center') &&
            'grid grid-cols-1 md:grid-cols-2'
        )}
      >
        {/* Left Half - Show leftTitle + CTAs, or show title if textPosition is left, or just CTAs */}
        <div 
          data-component="Banner.LeftHalf"
          className={cn(
            'h-full flex flex-col items-center px-4 md:px-8',
            (fields.leftTitle || textPosition === 'left') && bannerType === 'hero'
              ? 'justify-center'
              : getVerticalAlignClass(ctaLeftVerticalAlign)
          )}
        >
          {/* Show leftTitle if exists (with CTAs below) */}
          {fields.leftTitle && bannerType === 'hero' && (
            <>
              <div className="flex flex-col items-center text-center mb-6">
                <Heading
                  as="h1"
                  data-component="Banner.LeftTitle"
                  className={cn(bannerTitleVariants({ bannerType }))}
                >
                  {str(fields.leftTitle)}
                </Heading>
              </div>
              {renderCTAs('left')}
            </>
          )}
          {/* Show title on left if textPosition is left and no leftTitle/rightTitle */}
          {!fields.leftTitle && !fields.rightTitle && textPosition === 'left' && bannerType === 'hero' && (
            <div className="flex flex-col items-center text-center">
              <Heading
                as="h1"
                data-component="Banner.Title"
                className={cn(bannerTitleVariants({ bannerType }))}
              >
                {str(fields.title)}
              </Heading>
              {fields.subtitle && (
                <Text
                  data-component="Banner.Subtitle"
                  className={cn(bannerSubtitleVariants({ bannerType }))}
                >
                  {str(fields.subtitle)}
                </Text>
              )}
            </div>
          )}
          {/* Center position: show title and subtitle only if no leftTitle/rightTitle */}
          {textPosition === 'center' && bannerType === 'hero' && !fields.leftTitle && !fields.rightTitle && (
            <div className="flex flex-col items-center text-center justify-center md:col-span-2">
              <Heading
                as="h1"
                data-component="Banner.Title"
                className={cn(bannerTitleVariants({ bannerType }))}
              >
                {str(fields.title)}
              </Heading>
              {fields.subtitle && (
                <Text
                  data-component="Banner.Subtitle"
                  className={cn(bannerSubtitleVariants({ bannerType }))}
                >
                  {str(fields.subtitle)}
                </Text>
              )}
              {renderCTAs('center')}
            </div>
          )}
          {/* Show CTAs if no title is shown on this side */}
          {!fields.leftTitle && textPosition !== 'center' && textPosition !== 'left' && renderCTAs('left')}
        </div>

        {/* Right Half - Show rightTitle + CTAs, or show title if textPosition is right, or just CTAs */}
        {(textPosition !== 'center' || fields.rightTitle || fields.leftTitle) && (
          <div 
            data-component="Banner.RightHalf"
            className={cn(
              'h-full flex flex-col items-center px-4 md:px-8',
              (fields.rightTitle || textPosition === 'right') && bannerType === 'hero'
                ? 'justify-center'
                : getVerticalAlignClass(ctaRightVerticalAlign)
            )}
          >
            {/* Show rightTitle if exists (with CTAs below) */}
            {fields.rightTitle && bannerType === 'hero' && (
              <>
                <div className="flex flex-col items-center text-center mb-6">
                  <Heading
                    as="h1"
                    data-component="Banner.RightTitle"
                    className={cn(bannerTitleVariants({ bannerType }))}
                  >
                    {str(fields.rightTitle)}
                  </Heading>
                </div>
                {renderCTAs('right')}
              </>
            )}
            {/* Show title on right if textPosition is right and no leftTitle/rightTitle */}
            {!fields.leftTitle && !fields.rightTitle && textPosition === 'right' && bannerType === 'hero' && (
              <div className="flex flex-col items-center text-center">
                <Heading
                  as="h1"
                  data-component="Banner.Title"
                  className={cn(bannerTitleVariants({ bannerType }))}
                >
                    {str(fields.title)}
                </Heading>
                {fields.subtitle && (
                  <Text
                    data-component="Banner.Subtitle"
                    className={cn(bannerSubtitleVariants({ bannerType }))}
                  >
                    {str(fields.subtitle)}
                  </Text>
                )}
              </div>
            )}
            {/* Show CTAs if no title is shown on this side */}
            {!fields.rightTitle && textPosition !== 'center' && textPosition !== 'right' && renderCTAs('right')}
          </div>
        )}
      </div>
    </div>
  );

  // Banner type strategy map - type-safe and extensible
  const bannerStrategies: Record<BannerType, BannerRenderStrategy> = {
    slim: renderSlimBanner,
    promo: renderPromoBanner,
    hero: renderHeroBanner,
  };

  // Get the appropriate render strategy
  const renderBanner = bannerStrategies[bannerType];

  // Render context for strategy pattern
  const renderContext: BannerRenderContext = {
    fields: fields as unknown as BannerFields['fields'],
    bannerType,
    imageUrl,
    mobileImageUrl,
    textPosition,
    ctaLeftVerticalAlign,
    ctaRightVerticalAlign,
    renderCTAs,
  };

  // Execute the strategy
  return renderBanner(renderContext);
}

// Backward compatibility exports
export const HeroBanner = Banner;
export const SlimBanner = Banner;
export const PromoBanner = Banner;

