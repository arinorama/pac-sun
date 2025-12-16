import Image from 'next/image';
import { Link } from '@/components/atoms/Link';
import { getImageUrl } from '@/lib/contentful/queries';
import type { Asset } from 'contentful';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';

interface BrandCard {
  sys: { id: string };
  fields: {
    title?: string;
    subtitle?: string;
    image?: Asset;
    logo?: Asset;
    ctaText?: string;
    ctaLink?: string;
  };
}

interface BrandSectionFields {
  title?: string;
  brandCards?: BrandCard[];
}

interface BrandSectionProps {
  readonly section: {
    fields: BrandSectionFields;
  };
}

function BrandCardComponent({ card }: { readonly card: BrandCard }) {
  const fields = card.fields;
  const imageUrl = getImageUrl(fields.image);
  const logoUrl = fields.logo ? getImageUrl(fields.logo) : null;

  return (
    <div
      data-component="BrandCard-NEW-VERSION"
      className="relative overflow-hidden"
    >
      <Link
        data-component="BrandCard.Link"
        href={fields.ctaLink || '#'}
        className="block"
      >
        {/* Image */}
        <div className="relative w-full aspect-[306/475]">
          <Image
            data-component="BrandCard.Image"
            src={imageUrl}
            alt={fields.title ?? 'Brand'}
            fill
            className="object-cover"
            sizes="(max-width: 767px) 50vw, (max-width: 1311px) 25vw, 306px"
          />
        </div>
        
        {/* Brand info below image */}
        <div className="bg-white py-4 md:py-6 text-center">
          <div className="space-y-3 md:space-y-4">
            {/* Logo or Title */}
            {logoUrl ? (
              <div className="flex justify-center">
                <Image
                  data-component="BrandCard.Logo"
                  src={logoUrl}
                  alt={fields.title ?? 'Brand Logo'}
                  width={200}
                  height={100}
                  className="max-w-[180px] md:max-w-[200px] h-auto object-contain"
                />
              </div>
            ) : (
              <>
                {fields.title && (
                  <Heading
                    level="h3"
                    className="text-xl md:text-2xl font-bold leading-tight text-black"
                  >
                    {fields.title}
                  </Heading>
                )}
                {fields.subtitle && (
                  <Text className="text-sm md:text-base font-normal text-gray-700">
                    {fields.subtitle}
                  </Text>
                )}
              </>
            )}
            
            {/* CTA Link */}
            {fields.ctaText && (
              <div>
                <span className="inline-block border-b-2 border-black text-black uppercase font-bold text-base tracking-wide hover:opacity-70 transition-opacity duration-200">
                  {fields.ctaText}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export function BrandSection({ section }: BrandSectionProps) {
  const fields = section.fields;
  const brandCards = fields.brandCards ?? [];

  if (brandCards.length === 0) {
    return null;
  }

  return (
    <section
      data-component="BrandSection"
      className="my-8 md:my-12 px-3 md:px-5"
    >
      <SectionHeader
        title={fields.title}
        className="mb-6 md:mb-8"
        titleClassName="font-normal uppercase text-2xl md:text-4xl tracking-wide"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-[1400px] mx-auto">
        {brandCards.map((card) => (
          <BrandCardComponent key={card.sys.id} card={card} />
        ))}
      </div>
    </section>
  );
}

