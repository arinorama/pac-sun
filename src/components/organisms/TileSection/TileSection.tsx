import { getImageUrl } from '@/lib/contentful/queries';
import type { Asset } from 'contentful';
import { ImageWithOverlay } from '@/components/molecules/ImageWithOverlay';
import { CTALink } from '@/components/molecules/CTALink';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';

interface TileCard {
  sys: { id: string };
  fields: {
    title?: string;
    subtitle?: string;
    hashtag?: string;
    description?: string;
    image?: Asset;
    ctaText?: string;
    ctaLink?: string;
  };
}

interface TileSectionFields {
  title?: string;
  tiles?: TileCard[];
}

interface TileSectionProps {
  readonly section: {
    fields: TileSectionFields;
  };
}

function TileCardComponent({ card }: { readonly card: TileCard }) {
  const fields = card.fields;
  const imageUrl = getImageUrl(fields.image);

  return (
    <div
      data-component="TileCard"
      className="relative overflow-hidden"
    >
      <ImageWithOverlay
        src={imageUrl}
        alt={fields.title ?? ''}
        aspectRatio="306/475"
        overlay="gradient"
        contentClassName="flex flex-col justify-end p-4 md:p-6 text-white"
      >
        <div className="space-y-2 md:space-y-3">
          {fields.hashtag && (
            <Heading
              level="h4"
              className="text-xs md:text-sm uppercase font-bold tracking-wide"
            >
              {fields.hashtag}
            </Heading>
          )}
          
          <div>
            {fields.title && (
              <Heading
                level="h3"
                className="text-xl md:text-3xl font-bold leading-tight"
              >
                {fields.title}
              </Heading>
            )}
            {fields.subtitle && (
              <Text className="text-sm md:text-base font-normal mt-1">
                {fields.subtitle}
              </Text>
            )}
          </div>

          {fields.description && (
            <Text className="text-xs md:text-sm leading-relaxed opacity-90 line-clamp-3">
              {fields.description}
            </Text>
          )}
          
          {fields.ctaText && fields.ctaLink && (
            <div className="pt-2">
              <CTALink
                href={fields.ctaLink}
                variant="button"
              >
                {fields.ctaText}
              </CTALink>
            </div>
          )}
        </div>
      </ImageWithOverlay>
    </div>
  );
}

export function TileSection({ section }: TileSectionProps) {
  const fields = section.fields;
  const tiles = fields.tiles ?? [];

  if (tiles.length === 0) {
    return null;
  }

  return (
    <section
      data-component="TileSection"
      className="my-8 md:my-12 px-3 md:px-5"
    >
      {fields.title && (
        <SectionHeader
          title={fields.title}
          className="mb-6 md:mb-8"
          titleClassName="font-normal uppercase text-2xl md:text-4xl tracking-wide"
        />
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-[1400px] mx-auto">
        {tiles.map((tile) => (
          <TileCardComponent key={tile.sys.id} card={tile} />
        ))}
      </div>
    </section>
  );
}

