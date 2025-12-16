import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        primary: "bg-brand-black text-brand-white",
        secondary: "bg-brand-white text-brand-black border-2 border-gray-300"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

interface ComponentProps extends VariantProps<typeof componentVariants> {
  children?: React.ReactNode;
  className?: string;
}

export function Component({ variant, size, children, className, ...props }: ComponentProps) {
  return (
    <div
      data-component="Component"
      data-variant={variant}
      data-size={size}
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

