import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const selectVariants = cva(
  'flex w-full rounded-md ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors appearance-none bg-white',
  {
    variants: {
      variant: {
        outlined: 'border border-gray-300 focus-visible:ring-gray-400',
        filled: 'border border-gray-300 bg-gray-50 focus-visible:ring-gray-400',
        ghost: 'border-0 bg-transparent focus-visible:ring-gray-300',
      },
      selectSize: {
        sm: 'h-9 px-3 py-1.5 text-sm',
        md: 'h-11 px-3 py-2 text-sm',
        lg: 'h-13 px-4 py-2.5 text-base',
      },
      error: {
        true: 'border-error focus-visible:ring-error',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'outlined',
      selectSize: 'md',
      error: false,
    },
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    Omit<VariantProps<typeof selectVariants>, 'error'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  variant,
  selectSize,
  className,
  id,
  options,
  placeholder,
  ...props
}: Readonly<SelectProps>) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 11)}`;
  const hasError = !!error;

  return (
    <div data-component="Select" className="w-full">
      {label && (
        <label
          data-component="Select.Label"
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          data-component="Select.Field"
          data-variant={variant}
          data-size={selectSize}
          id={selectId}
          className={cn(selectVariants({ variant, selectSize, error: hasError }), 'pr-10', className)}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      {error && (
        <p
          data-component="Select.Error"
          id={`${selectId}-error`}
          className="mt-1 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

