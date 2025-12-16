'use client';

import { useRefinementList, useRange } from 'react-instantsearch';
import { Button } from '@/components/atoms/Button';

export function FilterPanel() {
  return (
    <div
      data-component="FilterPanel"
      className="w-full md:w-64 space-y-6"
    >
      <div data-component="FilterPanel.Category">
        <h3
          data-component="FilterPanel.Title"
          className="font-semibold text-foreground mb-3"
        >
          Category
        </h3>
        <CategoryRefinementList />
      </div>

      <div data-component="FilterPanel.Brand">
        <h3
          data-component="FilterPanel.Title"
          className="font-semibold text-foreground mb-3"
        >
          Brand
        </h3>
        <BrandRefinementList />
      </div>

      <div data-component="FilterPanel.Price">
        <h3
          data-component="FilterPanel.Title"
          className="font-semibold text-foreground mb-3"
        >
          Price
        </h3>
        <PriceRange />
      </div>

      <div data-component="FilterPanel.Size">
        <h3
          data-component="FilterPanel.Title"
          className="font-semibold text-foreground mb-3"
        >
          Size
        </h3>
        <SizeRefinementList />
      </div>
    </div>
  );
}

function CategoryRefinementList() {
  const { items, refine } = useRefinementList({ attribute: 'category' });

  return (
    <div data-component="FilterPanel.CategoryList" className="space-y-2">
      {items.map((item) => (
        <label
          key={item.value}
          data-component="FilterPanel.CategoryItem"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={item.isRefined}
            onChange={() => refine(item.value)}
            className="rounded border-border"
          />
          <span className="text-sm text-foreground">
            {item.label} ({item.count})
          </span>
        </label>
      ))}
    </div>
  );
}

function BrandRefinementList() {
  const { items, refine } = useRefinementList({ attribute: 'brand' });

  return (
    <div data-component="FilterPanel.BrandList" className="space-y-2">
      {items.map((item) => (
        <label
          key={item.value}
          data-component="FilterPanel.BrandItem"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={item.isRefined}
            onChange={() => refine(item.value)}
            className="rounded border-border"
          />
          <span className="text-sm text-foreground">
            {item.label} ({item.count})
          </span>
        </label>
      ))}
    </div>
  );
}

function SizeRefinementList() {
  const { items, refine } = useRefinementList({ attribute: 'sizes' });

  return (
    <div data-component="FilterPanel.SizeList" className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.value}
          data-component="FilterPanel.SizeItem"
          onClick={() => refine(item.value)}
          className={`px-3 py-1 text-sm border rounded ${
            item.isRefined
              ? 'border-brand-black bg-brand-black text-brand-white'
              : 'border-border hover:border-brand-black'
          }`}
        >
          {item.label} ({item.count})
        </button>
      ))}
    </div>
  );
}

function PriceRange() {
  const { range, refine, start, canRefine } = useRange({
    attribute: 'price',
  });

  if (!canRefine) return null;

  return (
    <div data-component="FilterPanel.PriceRange" className="space-y-2">
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={range.min || ''}
          onChange={(e) =>
            refine([Number(e.target.value) || undefined, range.max])
          }
          className="w-full px-2 py-1 border border-border rounded text-sm"
        />
        <input
          type="number"
          placeholder="Max"
          value={range.max || ''}
          onChange={(e) =>
            refine([range.min, Number(e.target.value) || undefined])
          }
          className="w-full px-2 py-1 border border-border rounded text-sm"
        />
      </div>
    </div>
  );
}

