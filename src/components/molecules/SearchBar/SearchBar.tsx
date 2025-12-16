'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/atoms/Input';

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locale = pathname.split('/')[1] || 'en';
    router.push(`/${locale}/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      data-component="SearchBar"
      onSubmit={handleSubmit}
      className="flex-1 max-w-md"
    >
      <div
        data-component="SearchBar.Wrapper"
        className="relative"
      >
        <Input
          data-component="SearchBar.Input"
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
        <Search
          data-component="SearchBar.Icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle"
        />
      </div>
    </form>
  );
}

