'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Button } from '@/components/atoms/Button';
import { Divider } from '@/components/atoms/Divider';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type?: 'checkbox' | 'radio';
}

interface ProductFilterProps {
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, value: string) => void;
  onClearAll?: () => void;
  className?: string;
  collapsible?: boolean;
}

function FilterGroupComponent({
  group,
  selectedValues,
  onFilterChange,
  collapsible = true,
}: {
  group: FilterGroup;
  selectedValues: string[];
  onFilterChange: (value: string) => void;
  collapsible?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div data-component="ProductFilter.Group" className="py-4">
      <button
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
        disabled={!collapsible}
      >
        <h3 className="text-sm font-semibold text-gray-900">{group.label}</h3>
        {collapsible && (
          isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {group.options.map((option) => {
            const isChecked = selectedValues.includes(option.value);

            return (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <Checkbox
                  checked={isChecked}
                  onChange={() => onFilterChange(option.value)}
                  size="sm"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                  {option.label}
                </span>
                {option.count !== undefined && (
                  <span className="text-xs text-gray-500">({option.count})</span>
                )}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ProductFilter({
  filterGroups,
  selectedFilters,
  onFilterChange,
  onClearAll,
  className,
  collapsible = true,
}: Readonly<ProductFilterProps>) {
  const totalSelectedCount = Object.values(selectedFilters).reduce(
    (sum, values) => sum + values.length,
    0
  );

  return (
    <aside
      data-component="ProductFilter"
      className={cn('bg-white border border-gray-200 rounded-lg p-4', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {totalSelectedCount > 0 && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear all ({totalSelectedCount})
          </Button>
        )}
      </div>

      <Divider spacing="none" className="mb-2" />

      {/* Filter Groups */}
      <div className="space-y-0 divide-y divide-gray-200">
        {filterGroups.map((group) => (
          <FilterGroupComponent
            key={group.id}
            group={group}
            selectedValues={selectedFilters[group.id] || []}
            onFilterChange={(value) => onFilterChange(group.id, value)}
            collapsible={collapsible}
          />
        ))}
      </div>
    </aside>
  );
}

