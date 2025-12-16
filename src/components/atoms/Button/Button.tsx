import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-black text-brand-white hover:bg-gray-800 focus-visible:ring-brand-black',
        secondary:
          'bg-brand-white text-brand-black border-2 border-brand-black hover:bg-gray-50 focus-visible:ring-brand-black',
        ghost: 'hover:bg-hover text-foreground focus-visible:ring-gray-300',
        link: 'text-brand-black underline-offset-4 hover:underline focus-visible:ring-gray-300',
        banner: 'text-brand-white font-poppins text-[16.6px] px-4 py-1 font-medium h-auto uppercase underline underline-offset-2',
        destructive:
          'bg-error text-brand-white hover:bg-error-dark focus-visible:ring-error',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-8 text-base',
        lg: 'h-13 px-10 text-lg',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [
      {
        variant: 'banner',
        className: '!h-auto !px-4 !py-1 !text-[16.6px]',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({
  variant,
  size,
  fullWidth,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      data-component="Button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

