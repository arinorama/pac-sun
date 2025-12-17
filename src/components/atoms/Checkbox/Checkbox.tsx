import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 rounded border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:text-white',
        primary: 'data-[state=checked]:bg-brand-black data-[state=checked]:border-brand-black data-[state=checked]:text-white',
        success: 'data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-white',
        error: 'data-[state=checked]:bg-error data-[state=checked]:border-error data-[state=checked]:text-white',
      },
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  error?: string;
}

export function Checkbox({
  label,
  error,
  variant,
  size,
  className,
  id,
  checked,
  ...props
}: Readonly<CheckboxProps>) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 11)}`;
  const hasError = !!error;

  return (
    <div data-component="Checkbox" className="flex items-start">
      <div className="flex items-center h-5">
        <input
          data-component="Checkbox.Input"
          data-variant={variant}
          data-size={size}
          data-state={checked ? 'checked' : 'unchecked'}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          className={cn(checkboxVariants({ variant, size }), className)}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${checkboxId}-error` : undefined}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-2 text-sm">
          <label
            data-component="Checkbox.Label"
            htmlFor={checkboxId}
            className="font-medium text-gray-900 cursor-pointer"
          >
            {label}
          </label>
          {error && (
            <p
              data-component="Checkbox.Error"
              id={`${checkboxId}-error`}
              className="text-error mt-1"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

