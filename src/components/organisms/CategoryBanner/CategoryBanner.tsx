import Link from 'next/link';
import type { Entry } from 'contentful';

interface CategoryLinkFields {
  text: string;
  link: string;
}

interface CategoryBannerFields {
  categories: Entry<CategoryLinkFields>[];
}

interface CategoryBannerProps {
  banner: Entry<CategoryBannerFields>;
}

export function CategoryBanner({ banner }: CategoryBannerProps) {
  const categories = banner.fields.categories || [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <div
      data-component="CategoryBanner"
      className="w-full px-3 flex justify-center"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-[2vw] w-full px-8">
        {categories.map((category, index) => (
          <div
            key={category.sys.id}
            data-component="CategoryBanner.Item"
            className="border-2 border-[#441212]"
          >
            <Link
              href={category.fields.link}
              className="block bg-[#441212] text-white text-center py-4 px-1 text-[1.25vw] md:text-[1.25vw] text-base font-medium uppercase hover:underline transition-all"
              style={{ textUnderlineOffset: '1.5px', textDecorationThickness: '1px' }}
            >
              {category.fields.text}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

