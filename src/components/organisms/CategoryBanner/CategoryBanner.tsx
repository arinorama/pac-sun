import { Link } from '@/components/atoms/Link';

interface CategoryItem {
  sys: { id: string };
  fields: {
    text?: string;
    link?: string;
  };
}

interface CategoryBannerFields {
  categories?: CategoryItem[];
}

interface CategoryBannerProps {
  banner: {
    fields: CategoryBannerFields;
  };
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
        {categories.map((category) => (
          <div
            key={category.sys.id}
            data-component="CategoryBanner.Item"
            className="border-2 border-[#441212]"
          >
            <Link
              href={category.fields.link || '#'}
              variant="category"
            >
              {category.fields.text || ''}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

