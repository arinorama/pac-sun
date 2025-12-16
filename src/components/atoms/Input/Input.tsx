import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
  {
    variants: {
      variant: {
        outlined: 'border border-gray-300 bg-white focus-visible:ring-gray-400',
        filled: 'border border-gray-300 bg-gray-50 focus-visible:ring-gray-400',
        ghost: 'border-0 bg-transparent focus-visible:ring-gray-300',
      },
      inputSize: {
        sm: 'h-9 px-3 py-1.5 text-sm',
        md: 'h-11 px-3 py-2 text-sm',
        lg: 'h-13 px-4 py-2.5 text-base',
      },
      error: {
        true: 'border-error focus-visible:ring-error',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'ghost',
        error: true,
        className: 'border-b border-error focus-visible:ring-error',
      },
    ],
    defaultVariants: {
      variant: 'outlined',
      inputSize: 'md',
      error: false,
    },
  }
);

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'error'> {
  label?: string;
  error?: string;
}

export function Input({ 
  label, 
  error, 
  variant, 
  inputSize, 
  className, 
  id, 
  ...props 
}: Readonly<InputProps>) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 11)}`;
  const hasError = !!error;

  return (
    <div data-component="Input" className="w-full">
      {label && (
        <label
          data-component="Input.Label"
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          {label}
        </label>
      )}
      <input
        data-component="Input.Field"
        data-variant={variant}
        data-size={inputSize}
        id={inputId}
        className={cn(inputVariants({ variant, inputSize, error: hasError }), className)}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          data-component="Input.Error"
          id={`${inputId}-error`}
          className="mt-1 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

