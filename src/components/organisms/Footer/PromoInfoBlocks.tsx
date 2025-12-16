'use client';

import Link from 'next/link';
import { Sparkles, Users, MapPin } from 'lucide-react';

interface PromoInfoBlock {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}

const promoBlocks: PromoInfoBlock[] = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'New Pacsun Rewards Is Here',
    description: '$5 Reward just for signing up!',
    link: '/rewards',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Refer a Friend',
    description: 'Give 20% off, get 20% off.',
    link: '/refer',
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: 'Store Locator',
    description: 'Find a local store.',
    link: '/stores',
  },
];

export function PromoInfoBlocks() {
  return (
    <section
      data-component="PromoInfoBlocks"
      className="w-full bg-gray-50 py-12"
    >
      <div
        data-component="PromoInfoBlocks.Container"
        className="container mx-auto px-4"
      >
        <div
          data-component="PromoInfoBlocks.Grid"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {promoBlocks.map((block, index) => {
            const content = (
              <div
                data-component={`PromoInfoBlocks.Block.${index + 1}`}
                className="text-center"
              >
                <div
                  data-component={`PromoInfoBlocks.Icon.${index + 1}`}
                  className="flex justify-center mb-4 text-gray-900"
                >
                  {block.icon}
                </div>
                <h3
                  data-component={`PromoInfoBlocks.Title.${index + 1}`}
                  className="text-lg font-semibold text-gray-900 mb-2"
                >
                  {block.title}
                </h3>
                <p
                  data-component={`PromoInfoBlocks.Description.${index + 1}`}
                  className="text-sm text-gray-600"
                >
                  {block.description}
                </p>
              </div>
            );

            if (block.link) {
              return (
                <Link
                  key={index}
                  href={block.link}
                  data-component={`PromoInfoBlocks.Link.${index + 1}`}
                  className="hover:opacity-80 transition-opacity"
                >
                  {content}
                </Link>
              );
            }

            return <div key={index}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}

