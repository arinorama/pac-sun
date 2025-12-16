import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'animate-spin rounded-full border-2',
  {
    variants: {
      variant: {
        spinner: 'border-gray-300 border-t-brand-black',
        dots: 'border-transparent border-t-brand-black',
        pulse: 'border-gray-300 border-t-brand-black animate-pulse',
      },
      size: {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
      },
      spinnerColor: {
        default: 'border-gray-300 border-t-brand-black',
        primary: 'border-gray-300 border-t-brand-black',
        white: 'border-gray-300 border-t-white',
      },
    },
    compoundVariants: [
      {
        variant: 'spinner',
        spinnerColor: 'primary',
        className: 'border-gray-300 border-t-brand-black',
      },
      {
        variant: 'spinner',
        spinnerColor: 'white',
        className: 'border-gray-300 border-t-white',
      },
      {
        variant: 'dots',
        spinnerColor: 'primary',
        className: 'border-transparent border-t-brand-black',
      },
      {
        variant: 'dots',
        spinnerColor: 'white',
        className: 'border-transparent border-t-white',
      },
    ],
    defaultVariants: {
      variant: 'spinner',
      size: 'md',
      spinnerColor: 'default',
    },
  }
);

interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ variant, size, spinnerColor, className, ...props }: Readonly<SpinnerProps>) {
  return (
    <div
      data-component="Spinner"
      data-variant={variant}
      data-size={size}
      data-color={spinnerColor}
      className={cn(spinnerVariants({ variant, size, spinnerColor }), className)}
      aria-label="Loading"
      aria-live="polite"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

