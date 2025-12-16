import type { Page, PageFields } from '@/types/page';
import { renderContentfulComponent } from '@/lib/contentful/componentRegistry';
import type { ContentfulComponent } from '@/lib/contentful/componentRegistry';

interface HomeTemplateProps {
  readonly page: Page;
  readonly locale?: string;
}

export function HomeTemplate({ page, locale = 'en' }: HomeTemplateProps) {
  const components = (page.fields as PageFields).components || [];

  return (
    <div data-component="HomeTemplate">
      {components.map((component, index) => {
        const isLast = index === components.length - 1;
        const rendered = renderContentfulComponent(component as ContentfulComponent, { locale });
        
        // Apply margin to non-last components
        return isLast ? (
          rendered
        ) : (
          <div key={(component as ContentfulComponent).sys.id} className="mb-5">
            {rendered}
          </div>
        );
      })}
    </div>
  );
}

