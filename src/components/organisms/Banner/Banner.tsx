import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/contentful/queries';
import type { Entry, EntryFieldTypes, Asset as ContentfulAsset } from 'contentful';

interface BannerFields {
  contentTypeId: 'heroBanner';
  fields: {
    title: EntryFieldTypes.Symbol;
    bannerType: EntryFieldTypes.Symbol<'hero' | 'slim' | 'promo'>;
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
    ctaLeftVerticalAlign?: EntryFieldTypes.Symbol<'top' | 'center' | 'bottom'>;
    // Right side CTAs
    ctaRightMen?: EntryFieldTypes.Symbol;
    ctaRightMenLink?: EntryFieldTypes.Symbol;
    ctaRightWomen?: EntryFieldTypes.Symbol;
    ctaRightWomenLink?: EntryFieldTypes.Symbol;
    ctaRightKids?: EntryFieldTypes.Symbol;
    ctaRightKidsLink?: EntryFieldTypes.Symbol;
    ctaRightVerticalAlign?: EntryFieldTypes.Symbol<'top' | 'center' | 'bottom'>;
    textPosition?: EntryFieldTypes.Symbol<'left' | 'center' | 'right'>;
    backgroundColor?: EntryFieldTypes.Symbol;
  };
}

interface BannerProps {
  readonly banner: Entry<BannerFields, undefined, string>;
}

export function Banner({ banner }: BannerProps) {
  const fields = banner.fields;
  const bannerType = (fields.bannerType as 'hero' | 'slim' | 'promo') || 'hero';
  const imageUrl = getImageUrl(fields.image as ContentfulAsset);
  const mobileImageUrl = fields.mobileImage
    ? getImageUrl(fields.mobileImage as ContentfulAsset)
    : imageUrl;
  const textPosition = fields.textPosition || 'center';
  const ctaLeftVerticalAlign = (fields.ctaLeftVerticalAlign as 'top' | 'center' | 'bottom') || 'center';
  const ctaRightVerticalAlign = (fields.ctaRightVerticalAlign as 'top' | 'center' | 'bottom') || 'center';

  // Helper function to get vertical alignment classes
  const getVerticalAlignClass = (align: 'top' | 'center' | 'bottom') => {
    switch (align) {
      case 'top':
        return 'justify-start pt-12 md:pt-16';
      case 'bottom':
        return 'justify-end pb-12 md:pb-16';
      case 'center':
      default:
        return 'justify-center';
    }
  };

  // Helper function to render CTAs
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
          <Link
            data-component={`Banner.CTA${side === 'center' ? '' : side.charAt(0).toUpperCase() + side.slice(1)}Men`}
            href={ctaMenLink}
            className="text-brand-white font-poppins font-medium uppercase underline underline-offset-2 hover:opacity-80 transition-opacity px-2 py-1"
          >
            {ctaMen}
          </Link>
        )}
        {ctaWomen && ctaWomenLink && (
          <Link
            data-component={`Banner.CTA${side === 'center' ? '' : side.charAt(0).toUpperCase() + side.slice(1)}Women`}
            href={ctaWomenLink}
            className="text-brand-white font-poppins font-medium uppercase underline underline-offset-2 hover:opacity-80 transition-opacity px-2 py-1"
          >
            {ctaWomen}
          </Link>
        )}
        {ctaKids && ctaKidsLink && (
          <Link
            data-component={`Banner.CTA${side === 'center' ? '' : side.charAt(0).toUpperCase() + side.slice(1)}Kids`}
            href={ctaKidsLink}
            className="text-brand-white font-poppins font-medium uppercase underline underline-offset-2 hover:opacity-80 transition-opacity px-2 py-1"
          >
            {ctaKids}
          </Link>
        )}
      </div>
    );
  };

  // Banner type'a göre farklı stil ve boyutlar
  const bannerStyles = {
    hero: {
      height: 'h-[500px] md:h-[600px] lg:h-[700px]',
      titleSize: 'text-5xl',
      titleFont: 'font-poppins',
      titleWeight: 'font-normal',
      subtitleSize: 'text-base md:text-lg lg:text-xl',
      letterSpacing: 'tracking-normal',
    },
    slim: {
      height: 'auto',
      titleSize: 'text-2xl md:text-3xl',
      titleFont: 'font-sans',
      titleWeight: 'font-bold',
      subtitleSize: 'text-base md:text-lg',
      letterSpacing: 'tracking-normal',
    },
    promo: {
      height: 'auto',
      titleSize: 'text-2xl md:text-4xl lg:text-5xl',
      titleFont: 'font-sans',
      titleWeight: 'font-extrabold',
      subtitleSize: 'text-sm md:text-base lg:text-lg',
      letterSpacing: 'tracking-tight',
    },
  };

  const styles = bannerStyles[bannerType];

  // Slim banner için basitleştirilmiş görünüm (sadece resim ve link)
  if (bannerType === 'slim') {
    return (
      <div
        data-component="Banner"
        data-banner-type="slim"
        className="relative w-full"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={imageUrl} />
          <img
            src={mobileImageUrl}
            alt={fields.title || 'Banner'}
            className="w-full h-auto"
          />
        </picture>
      </div>
    );
  }

  // Promo banner: Full-height image with centered CTAs overlay
  if (bannerType === 'promo') {
    return (
      <div
        data-component="Banner"
        data-banner-type="promo"
        className="relative w-full"
      >
        <picture>
          <source media="(min-width: 768px)" srcSet={imageUrl} />
          <img
            src={mobileImageUrl}
            alt={fields.title || 'Banner'}
            className="w-full h-auto"
          />
        </picture>
        
        {/* CTAs overlay - positioned from bottom */}
        {(fields.ctaMen || fields.ctaWomen || fields.ctaKids) && (
          <div 
            data-component="Banner.CTAOverlay"
            className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-3"
          >
            <div className="flex gap-4 md:gap-6 flex-wrap justify-center text-base">
              {fields.ctaMen && fields.ctaMenLink && (
                <Link
                  data-component="Banner.CTAMen"
                  href={fields.ctaMenLink}
                  className="text-brand-white font-poppins font-medium uppercase underline underline-offset-2 hover:opacity-80 transition-opacity px-2 py-1"
                >
                  {fields.ctaMen}
                </Link>
              )}
              {fields.ctaWomen && fields.ctaWomenLink && (
                <Link
                  data-component="Banner.CTAWomen"
                  href={fields.ctaWomenLink}
                  className="text-brand-white font-poppins font-medium uppercase underline underline-offset-2 hover:opacity-80 transition-opacity px-2 py-1"
                >
                  {fields.ctaWomen}
                </Link>
              )}
              {fields.ctaKids && fields.ctaKidsLink && (
                <Link
                  data-component="Banner.CTAKids"
                  href={fields.ctaKidsLink}
                  className="text-brand-white font-poppins font-medium uppercase underline underline-offset-2 hover:opacity-80 transition-opacity px-2 py-1"
                >
                  {fields.ctaKids}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Hero banner için tam özellikli görünüm
  return (
    <div
      data-component="Banner"
      data-banner-type={bannerType}
      className={`relative w-full ${styles.height} overflow-hidden`}
      style={fields.backgroundColor ? { backgroundColor: fields.backgroundColor } : undefined}
    >
      <div
        data-component="Banner.ImageWrapper"
        className="absolute inset-0"
      >
        <Image
          data-component="Banner.Image"
          src={imageUrl}
          alt={fields.title}
          fill
          className="object-cover hidden md:block"
          priority={bannerType === 'hero'}
          sizes="100vw"
        />
        <Image
          data-component="Banner.MobileImage"
          src={mobileImageUrl}
          alt={fields.title}
          fill
          className="object-cover md:hidden"
          priority={bannerType === 'hero'}
          sizes="100vw"
        />
      </div>
      {/* Banner.Content: CSS Grid layout with two equal halves for left/right titles/CTAs */}
      <div
        data-component="Banner.Content"
        className={`relative z-10 h-full w-full ${
          fields.leftTitle || fields.rightTitle || textPosition !== 'center'
            ? 'grid grid-cols-1 md:grid-cols-2'
            : ''
        }`}
      >
        {/* Left Half - Show leftTitle + CTAs, or show title if textPosition is left, or just CTAs */}
        <div 
          data-component="Banner.LeftHalf"
          className={`h-full flex flex-col items-center px-4 md:px-8 ${
            (fields.leftTitle || textPosition === 'left') && bannerType === 'hero' 
              ? 'justify-center' 
              : getVerticalAlignClass(ctaLeftVerticalAlign)
          }`}
        >
          {/* Show leftTitle if exists (with CTAs below) */}
          {fields.leftTitle && bannerType === 'hero' && (
            <>
              <div className="flex flex-col items-center text-center mb-6">
                <h1
                  data-component="Banner.LeftTitle"
                  className={`${styles.titleSize} ${styles.titleFont} ${styles.titleWeight} ${styles.letterSpacing} text-brand-white my-2 uppercase leading-none`}
                >
                  {fields.leftTitle}
                </h1>
              </div>
              {renderCTAs('left')}
            </>
          )}
          {/* Show title on left if textPosition is left and no leftTitle/rightTitle */}
          {!fields.leftTitle && !fields.rightTitle && textPosition === 'left' && bannerType === 'hero' && (
            <div className="flex flex-col items-center text-center">
              <h1
                data-component="Banner.Title"
                className={`${styles.titleSize} ${styles.titleFont} ${styles.titleWeight} ${styles.letterSpacing} text-brand-white my-2 uppercase leading-none`}
              >
                {fields.title}
              </h1>
              {fields.subtitle && (
                <p
                  data-component="Banner.Subtitle"
                  className={`${styles.subtitleSize} ${styles.letterSpacing} text-brand-white mb-6 max-w-3xl font-medium`}
                >
                  {fields.subtitle}
                </p>
              )}
            </div>
          )}
          {/* Center position: show title and subtitle only if no leftTitle/rightTitle */}
          {textPosition === 'center' && bannerType === 'hero' && !fields.leftTitle && !fields.rightTitle && (
            <div className="flex flex-col items-center text-center justify-center md:col-span-2">
              <h1
                data-component="Banner.Title"
                className={`${styles.titleSize} ${styles.titleFont} ${styles.titleWeight} ${styles.letterSpacing} text-brand-white my-2 uppercase leading-none`}
              >
                {fields.title}
              </h1>
              {fields.subtitle && (
                <p
                  data-component="Banner.Subtitle"
                  className={`${styles.subtitleSize} ${styles.letterSpacing} text-brand-white mb-6 max-w-3xl font-medium`}
                >
                  {fields.subtitle}
                </p>
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
            className={`h-full flex flex-col items-center px-4 md:px-8 ${
              (fields.rightTitle || textPosition === 'right') && bannerType === 'hero' 
                ? 'justify-center' 
                : getVerticalAlignClass(ctaRightVerticalAlign)
            }`}
          >
            {/* Show rightTitle if exists (with CTAs below) */}
            {fields.rightTitle && bannerType === 'hero' && (
              <>
                <div className="flex flex-col items-center text-center mb-6">
                  <h1
                    data-component="Banner.RightTitle"
                    className={`${styles.titleSize} ${styles.titleFont} ${styles.titleWeight} ${styles.letterSpacing} text-brand-white my-2 uppercase leading-none`}
                  >
                    {fields.rightTitle}
                  </h1>
                </div>
                {renderCTAs('right')}
              </>
            )}
            {/* Show title on right if textPosition is right and no leftTitle/rightTitle */}
            {!fields.leftTitle && !fields.rightTitle && textPosition === 'right' && bannerType === 'hero' && (
              <div className="flex flex-col items-center text-center">
                <h1
                  data-component="Banner.Title"
                  className={`${styles.titleSize} ${styles.titleFont} ${styles.titleWeight} ${styles.letterSpacing} text-brand-white my-2 uppercase leading-none`}
                >
                  {fields.title}
                </h1>
                {fields.subtitle && (
                  <p
                    data-component="Banner.Subtitle"
                    className={`${styles.subtitleSize} ${styles.letterSpacing} text-brand-white mb-6 max-w-3xl font-medium`}
                  >
                    {fields.subtitle}
                  </p>
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
}

// Backward compatibility exports
export const HeroBanner = Banner;
export const SlimBanner = Banner;
export const PromoBanner = Banner;

