import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-gray-100 text-gray-900 focus-visible:ring-gray-300',
        ghost: 'hover:bg-gray-100',
        minimal: '',
      },
      size: {
        sm: 'h-8 w-8 p-1',
        md: 'h-10 w-10 p-2',
        lg: 'h-12 w-12 p-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  children: React.ReactNode;
  'aria-label': string;
}

export function IconButton({
  variant,
  size,
  children,
  className,
  ...props
}: Readonly<IconButtonProps>) {
  return (
    <button
      data-component="IconButton"
      data-variant={variant}
      data-size={size}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

