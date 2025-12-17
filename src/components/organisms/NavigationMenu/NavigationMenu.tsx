'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface NavigationMenuItem {
  label: string;
  href?: string;
  subItems?: NavigationMenuItem[];
  highlightColor?: 'red' | 'default';
}

interface NavigationMenuProps {
  items: NavigationMenuItem[];
  className?: string;
}

export function NavigationMenu({ items, className }: Readonly<NavigationMenuProps>) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const handleClick = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  return (
    <nav
      ref={navRef}
      data-component="NavigationMenu"
      className={cn('hidden xl:flex items-center', className)}
    >
      <ul className="flex items-center gap-0" role="menu">
        {items.map((item) => {
          const hasDropdown = item.subItems && item.subItems.length > 0;
          const textColorClass =
            item.highlightColor === 'red'
              ? 'text-red-600 hover:text-red-700'
              : 'text-gray-900 hover:text-gray-600';

          if (hasDropdown) {
            return (
              <li key={item.label} className="nav-item relative">
                <button
                  className={cn(
                    'px-2.5 py-2 text-[0.75vw] font-medium transition-colors tracking-wide',
                    textColorClass
                  )}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={activeDropdown === item.label}
                  onClick={() => handleClick(item.label)}
                >
                  {item.label}
                </button>
                {activeDropdown === item.label && (
                  <div className="absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-lg z-50 min-w-[200px]">
                    <div className="py-4 px-6">
                      <ul className="space-y-2">
                        {item.subItems!.map((subItem) => (
                          <li key={subItem.label}>
                            <Link
                              href={subItem.href || '#'}
                              className="text-sm font-medium text-gray-900 hover:text-gray-600 leading-tight block transition-colors"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          }

          return (
            <li key={item.label} className="nav-item">
              <Link
                href={item.href || '#'}
                className={cn(
                  'px-2.5 py-2 text-[0.75vw] font-medium transition-colors tracking-wide block',
                  textColorClass
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

