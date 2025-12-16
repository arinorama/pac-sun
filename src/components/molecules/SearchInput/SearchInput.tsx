'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { Input } from '@/components/atoms/Input';
import { IconButton } from '@/components/atoms/IconButton';
import { cn } from '@/lib/utils';

// Constants
const DEFAULT_PLACEHOLDER = 'Search' as const;

// Base classes - no variants needed for form container
const FORM_BASE_CLASSES = 'relative' as const;

const searchInputFieldVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      rounded: 'rounded-full bg-gray-100 border-0 focus:ring-0 placeholder:text-gray-500',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const searchInputIconButtonVariants = cva('absolute right-2 top-1/2 -translate-y-1/2', {
  variants: {
    variant: {
      default: '',
      rounded: 'p-1 hover:bg-gray-200 rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface SearchInputProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onChange' | 'onSubmit'> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  showIcon?: boolean;
  variant?: 'default' | 'rounded';
  size?: 'sm' | 'md' | 'lg';
}

export function SearchInput({
  placeholder = DEFAULT_PLACEHOLDER,
  value: controlledValue,
  onChange,
  onSubmit,
  className,
  inputClassName,
  showIcon = true,
  variant = 'default',
  size = 'md',
  ...props
}: Readonly<SearchInputProps>) {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue ?? internalValue;

  const handleChange = useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [controlledValue, onChange]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (value && onSubmit) {
        onSubmit(value);
      }
    },
    [value, onSubmit]
  );

  const fieldClasses = cn(
    searchInputFieldVariants({ variant, size }),
    inputClassName
  );

  const iconButtonClasses = searchInputIconButtonVariants({ variant });
  const isRounded = variant === 'rounded';

  return (
    <form
      data-component="SearchInput"
      data-variant={variant}
      data-size={size}
      onSubmit={handleSubmit}
      className={cn(FORM_BASE_CLASSES, className)}
      {...props}
    >
      {isRounded ? (
        <input
          data-component="SearchInput.Field"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={fieldClasses}
          aria-label="Search"
        />
      ) : (
        <Input
          data-component="SearchInput.Field"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={fieldClasses}
        />
      )}
      {showIcon && (
        <IconButton
          data-component="SearchInput.Submit"
          type="submit"
          variant="minimal"
          size="sm"
          className={iconButtonClasses}
          aria-label="Submit search"
        >
          <Search className="w-4 h-4 text-gray-900" />
        </IconButton>
      )}
    </form>
  );
}

