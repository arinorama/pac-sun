'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = pathname.split('/')[1] || 'en';
  const otherLocale = currentLocale === 'en' ? 'tr' : 'en';

  const switchLocale = () => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${otherLocale}`);
    router.push(newPath);
  };

  return (
    <div data-component="LanguageSwitcher">
      <Button
        data-component="LanguageSwitcher.Button"
        variant="ghost"
        size="sm"
        onClick={switchLocale}
      >
        {otherLocale.toUpperCase()}
      </Button>
    </div>
  );
}

