import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
  separator?: React.ReactNode;
  className?: string;
}

export function BreadcrumbNav({
  items,
  showHome = true,
  homeHref = '/',
  separator,
  className,
}: Readonly<BreadcrumbNavProps>) {
  const Separator = separator || <ChevronRight className="w-4 h-4 text-gray-400" />;

  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: homeHref, icon: <Home className="w-4 h-4" /> }, ...items]
    : items;

  return (
    <nav
      data-component="BreadcrumbNav"
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm', className)}
    >
      <ol className="flex items-center space-x-2">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              data-component="BreadcrumbNav.Item"
              className="flex items-center space-x-2"
            >
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1',
                    isLast ? 'text-gray-900 font-medium' : 'text-gray-600'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              )}
              {!isLast && (
                <span data-component="BreadcrumbNav.Separator" aria-hidden="true">
                  {Separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

