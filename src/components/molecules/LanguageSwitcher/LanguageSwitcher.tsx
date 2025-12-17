'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Language {
  code: string;
  label: string;
  flag?: string;
}

interface LanguageSwitcherProps {
  currentLocale: string;
  languages: Language[];
  variant?: 'dropdown' | 'inline';
  className?: string;
}

export function LanguageSwitcher({
  currentLocale,
  languages,
  variant = 'dropdown',
  className,
}: Readonly<LanguageSwitcherProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (languageCode: string) => {
    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    const newPath = `/${languageCode}${pathWithoutLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div
        data-component="LanguageSwitcher"
        data-variant="inline"
        className={cn('flex items-center gap-2', className)}
      >
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded transition-colors',
              language.code === currentLocale
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
            aria-label={`Switch to ${language.label}`}
          >
            {language.flag ? language.flag : language.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      data-component="LanguageSwitcher"
      data-variant="dropdown"
      className={cn('relative', className)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span>{currentLanguage.flag || currentLanguage.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div
          data-component="LanguageSwitcher.Dropdown"
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 transition-colors',
                language.code === currentLocale && 'bg-gray-50'
              )}
            >
              <span className="flex items-center gap-2">
                {language.flag && <span>{language.flag}</span>}
                <span>{language.label}</span>
              </span>
              {language.code === currentLocale && (
                <Check className="w-4 h-4 text-gray-900" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

