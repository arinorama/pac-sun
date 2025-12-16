import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300',
        success:
          'border-transparent bg-success-light text-success-dark hover:bg-success',
        error:
          'border-transparent bg-error-light text-error-dark hover:bg-error',
        warning:
          'border-transparent bg-warning-light text-warning-dark hover:bg-warning',
        info: 'border-transparent bg-info-light text-info-dark hover:bg-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export function Badge({ variant, children, className, ...props }: Readonly<BadgeProps>) {
  return (
    <div
      data-component="Badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

