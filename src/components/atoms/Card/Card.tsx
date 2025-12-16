import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('', {
  variants: {
    variant: {
      default: 'border p-2',
      bordered: 'border-2',
      elevated: 'shadow-md',
      none: '',
    },
    padding: {
      none: 'p-0',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'sm',
  },
});

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export function Card({
  variant,
  padding,
  children,
  className,
  ...props
}: Readonly<CardProps>) {
  return (
    <div
      data-component="Card"
      data-variant={variant}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

