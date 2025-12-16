'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/contentful/queries';
import type { Entry, Asset } from 'contentful';

interface FooterPromoCardFields {
  title: string;
  hashtag?: string;
  image: Asset;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface FooterPromoSectionFields {
  title?: string;
  promoCards: Entry<FooterPromoCardFields>[];
}

interface FooterPromoSectionProps {
  section: Entry<FooterPromoSectionFields>;
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
          {promoCards.map((card, index) => {
            const cardFields = card.fields;
            const imageUrl = getImageUrl(cardFields.image);
            const imageFile = cardFields.image.fields.file;

            return (
              <div
                key={card.sys.id}
                data-component="FooterPromoSection.Card"
                className="relative group overflow-hidden bg-gray-800 rounded-sm"
              >
                {cardFields.image && (
                  <div
                    data-component="FooterPromoSection.ImageWrapper"
                    className="relative w-full h-64 md:h-80"
                  >
                    <Image
                      src={imageUrl}
                      alt={cardFields.title || ''}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div
                      data-component="FooterPromoSection.Overlay"
                      className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"
                    />
                  </div>
                )}
                <div
                  data-component="FooterPromoSection.Content"
                  className="absolute inset-0 flex flex-col justify-between p-6 text-white"
                >
                  <div>
                    {cardFields.hashtag && (
                      <p
                        data-component="FooterPromoSection.Hashtag"
                        className="text-sm font-semibold mb-2"
                      >
                        {cardFields.hashtag}
                      </p>
                    )}
                    <h3
                      data-component="FooterPromoSection.Title"
                      className="text-xl md:text-2xl font-bold mb-2"
                    >
                      {cardFields.title}
                    </h3>
                    {cardFields.description && (
                      <p
                        data-component="FooterPromoSection.Description"
                        className="text-sm md:text-base opacity-90 line-clamp-3"
                      >
                        {cardFields.description}
                      </p>
                    )}
                  </div>
                  {cardFields.ctaText && cardFields.ctaLink && (
                    <Link
                      data-component="FooterPromoSection.CTA"
                      href={cardFields.ctaLink}
                      className="mt-4 inline-block border-2 border-white px-6 py-2 text-sm font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200"
                    >
                      {cardFields.ctaText}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

