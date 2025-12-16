import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/lib/contentful/queries';
import type { Entry, Asset, EntrySkeletonType } from 'contentful';

interface TileCardFields {
  title?: string;
  subtitle?: string;
  hashtag?: string;
  description?: string;
  image: Asset;
  ctaText?: string;
  ctaLink?: string;
}

interface TileCardSkeleton extends EntrySkeletonType {
  contentTypeId: 'tileCard';
  fields: TileCardFields;
}

interface TileSectionFields {
  title?: string;
  tiles?: Entry<TileCardSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>[];
}

interface TileSectionSkeleton extends EntrySkeletonType {
  contentTypeId: 'tileSection';
  fields: TileSectionFields;
}

interface TileSectionProps {
  readonly section: Entry<TileSectionSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>;
}

function TileCard({ card }: { readonly card: Entry<TileCardSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'> }) {
  const fields = card.fields;
  const imageUrl = getImageUrl(fields.image);

  return (
    <div
      data-component="TileCard"
      className="relative overflow-hidden"
    >
      <div className="relative w-full" style={{ aspectRatio: '306/475' }}>
        <Image
          data-component="TileCard.Image"
          src={imageUrl}
          alt={fields.title ?? ''}
          fill
          className="object-cover"
          sizes="(max-width: 767px) 50vw, (max-width: 1311px) 25vw, 306px"
        />
        
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 text-white bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="space-y-2 md:space-y-3">
            {fields.hashtag && (
              <h4 className="text-xs md:text-sm uppercase font-bold tracking-wide">
                {fields.hashtag}
              </h4>
            )}
            
            <div>
              {fields.title && (
                <h3 className="text-xl md:text-3xl font-bold leading-tight">
                  {fields.title}
                </h3>
              )}
              {fields.subtitle && (
                <p className="text-sm md:text-base font-normal mt-1">
                  {fields.subtitle}
                </p>
              )}
            </div>

            {fields.description && (
              <p className="text-xs md:text-sm leading-relaxed opacity-90 line-clamp-3">
                {fields.description}
              </p>
            )}
            
            {fields.ctaText && fields.ctaLink && (
              <div className="pt-2">
                <Link
                  href={fields.ctaLink}
                  className="inline-block border-2 border-white text-white uppercase font-bold text-xs md:text-sm py-2 md:py-3 px-6 md:px-8 hover:bg-white hover:text-black transition-all duration-200"
                >
                  {fields.ctaText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
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
        <div className="text-center mb-6 md:mb-8">
          <h2
            data-component="TileSection.Title"
            className="font-normal uppercase text-2xl md:text-4xl tracking-wide"
          >
            {fields.title}
          </h2>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-[1400px] mx-auto">
        {tiles.map((tile: Entry<TileCardSkeleton, 'WITHOUT_UNRESOLVABLE_LINKS'>) => (
          <TileCard key={tile.sys.id} card={tile} />
        ))}
      </div>
    </section>
  );
}

