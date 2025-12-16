'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface HeaderPromoItem {
  sys: { id: string };
  fields: {
    desktopText?: string;
    mobileText?: string;
    ctaMen?: string;
    ctaMenLink?: string;
    ctaWomen?: string;
    ctaWomenLink?: string;
    ctaKids?: string;
    ctaKidsLink?: string;
  };
}

interface HeaderPromoCarouselFields {
  title?: string;
  promoItems?: HeaderPromoItem[];
  autoplay?: boolean;
  autoplaySpeed?: number;
}

interface HeaderPromoCarouselProps {
  carousel: {
    fields: HeaderPromoCarouselFields;
  };
}

export function HeaderPromoCarousel({ carousel }: HeaderPromoCarouselProps) {
  const fields = carousel.fields;
  const promoItems = fields.promoItems || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosed, setIsClosed] = useState(false);
  const autoplay = fields.autoplay !== false; // Default true
  const autoplaySpeed = fields.autoplaySpeed || 5000; // Default 5 seconds

  useEffect(() => {
    if (!autoplay || promoItems.length <= 1 || isClosed) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoItems.length);
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, promoItems.length, isClosed]);

  if (isClosed || promoItems.length === 0) {
    return null;
  }

  return (
    <div
      data-component="HeaderPromoCarousel"
      className="relative w-full h-12 bg-white border-b border-black overflow-hidden"
    >
      <div className="relative h-full flex items-center justify-center">
        {/* Carousel Track */}
        <div
          className="flex transition-transform duration-700 ease-in-out h-full w-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {promoItems.map((item, index) => {
            const fields = item.fields;
            return (
              <div
                key={index}
                data-component="HeaderPromoCarousel.Slide"
                className="w-full h-full flex-shrink-0 flex items-center justify-center"
              >
                <div
                  data-component="HeaderPromoCarousel.Content"
                  className="w-full flex items-center justify-center"
                >
                  <p
                    data-component="HeaderPromoCarousel.Text"
                    className="text-black text-center mb-0 text-xs leading-[1.125rem] tracking-[-0.01953rem] whitespace-nowrap"
                  >
                    <span className="hidden md:inline">{fields.desktopText}</span>
                    <span className="md:hidden">
                      {fields.mobileText || fields.desktopText}
                    </span>
                    {(fields.ctaMen || fields.ctaWomen || fields.ctaKids) && (
                      <>
                        <span className="hidden md:inline">&nbsp;&nbsp;</span>
                        <br className="md:hidden" />
                        {fields.ctaMen && fields.ctaMenLink && (
                          <>
                            <Link
                              data-component="HeaderPromoCarousel.CTAMen"
                              href={fields.ctaMenLink}
                              className="text-black font-bold underline hover:text-gray-600 transition-colors"
                            >
                              {fields.ctaMen}
                            </Link>
                            &nbsp;&nbsp;
                          </>
                        )}
                        {fields.ctaWomen && fields.ctaWomenLink && (
                          <>
                            <Link
                              data-component="HeaderPromoCarousel.CTAWomen"
                              href={fields.ctaWomenLink}
                              className="text-black font-bold underline hover:text-gray-600 transition-colors"
                            >
                              {fields.ctaWomen}
                            </Link>
                            &nbsp;&nbsp;
                          </>
                        )}
                        {fields.ctaKids && fields.ctaKidsLink && (
                          <>
                            <Link
                              data-component="HeaderPromoCarousel.CTAKids"
                              href={fields.ctaKidsLink}
                              className="text-black font-bold underline hover:text-gray-600 transition-colors"
                            >
                              {fields.ctaKids}
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button (Mobile) */}
        <button
          data-component="HeaderPromoCarousel.CloseButton"
          onClick={() => setIsClosed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden p-1 hover:bg-gray-100 rounded z-10"
          aria-label="Close Promo Banner"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

