'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';
import { cn } from '@/lib/utils';

interface MobileMenuItem {
  label: string;
  href: string;
  subItems?: MobileMenuItem[];
}

interface MobileMenuProps {
  menuItems: MobileMenuItem[];
  className?: string;
}

export function MobileMenu({ menuItems, className }: Readonly<MobileMenuProps>) {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, closeMobileMenu]);

  if (!isMobileMenuOpen) {
    return null;
  }

  return (
    <>
      <div
        data-component="MobileMenu.Backdrop"
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={closeMobileMenu}
      />

      <div
        data-component="MobileMenu"
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-white shadow-xl overflow-y-auto animate-in slide-in-from-left duration-300',
          className
        )}
      >
        <div
          data-component="MobileMenu.Header"
          className="flex items-center justify-between p-4 border-b border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={closeMobileMenu}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        <nav data-component="MobileMenu.Nav" className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                {item.subItems && item.subItems.length > 0 ? (
                  <details className="group">
                    <summary className="flex items-center justify-between px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                      <span>{item.label}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" />
                    </summary>
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={`${subItem.label}-${subIndex}`}>
                          <Link
                            href={subItem.href}
                            onClick={closeMobileMenu}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

