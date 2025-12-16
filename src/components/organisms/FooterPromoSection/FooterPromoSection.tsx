'use client';

import { getImageUrl } from '@/lib/contentful/queries';
import type { Asset } from 'contentful';
import { ImageWithOverlay } from '@/components/molecules/ImageWithOverlay';
import { CTALink } from '@/components/molecules/CTALink';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';

interface PromoCard {
  sys: { id: string };
  fields: {
    title?: string;
    hashtag?: string;
    image?: Asset;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

interface FooterPromoSectionFields {
  title?: string;
  promoCards?: PromoCard[];
}

interface FooterPromoSectionProps {
  section: {
    fields: FooterPromoSectionFields;
  };
}

export function FooterPromoSection({ section }: FooterPromoSectionProps) {
  const fields = section.fields;
  const promoCards = fields.promoCards || [];

  if (promoCards.length === 0) {
    return null;
  }

  return (
    <section
      data-component="FooterPromoSection"
      className="w-full bg-gray-900 py-12"
    >
      <div
        data-component="FooterPromoSection.Container"
        className="container mx-auto px-4"
      >
        <div
          data-component="FooterPromoSection.Grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {promoCards.map((card) => {
            const cardFields = card.fields;
            const imageUrl = getImageUrl(cardFields.image);

            return (
              <div
                key={card.sys.id}
                data-component="FooterPromoSection.Card"
                className="relative group overflow-hidden bg-gray-800 rounded-sm"
              >
                {cardFields.image && (
                  <div className="relative w-full h-64 md:h-80">
                    <ImageWithOverlay
                      src={imageUrl}
                      alt={cardFields.title || ''}
                      overlay="solid"
                      overlayColor="black"
                      overlayOpacity={40}
                      className="h-full"
                      imageClassName="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      overlayClassName="group-hover:bg-black/20 transition-colors duration-300"
                      contentClassName="flex flex-col justify-between p-6 text-white"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    >
                    <div>
                      {cardFields.hashtag && (
                        <Text
                          data-component="FooterPromoSection.Hashtag"
                          className="text-sm font-semibold mb-2"
                        >
                          {cardFields.hashtag}
                        </Text>
                      )}
                      <Heading
                        level="h3"
                        data-component="FooterPromoSection.Title"
                        className="text-xl md:text-2xl font-bold mb-2"
                      >
                        {cardFields.title}
                      </Heading>
                      {cardFields.description && (
                        <Text
                          data-component="FooterPromoSection.Description"
                          className="text-sm md:text-base opacity-90 line-clamp-3"
                        >
                          {cardFields.description}
                        </Text>
                      )}
                    </div>
                    {cardFields.ctaText && cardFields.ctaLink && (
                      <CTALink
                        data-component="FooterPromoSection.CTA"
                        href={cardFields.ctaLink}
                        variant="border"
                        className="mt-4"
                      >
                        {cardFields.ctaText}
                      </CTALink>
                    )}
                    </ImageWithOverlay>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

