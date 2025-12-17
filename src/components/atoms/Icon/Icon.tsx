import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

const iconVariants = cva('', {
  variants: {
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
      '2xl': 'w-10 h-10',
    },
    color: {
      default: 'text-gray-900',
      primary: 'text-brand-black',
      secondary: 'text-gray-600',
      success: 'text-success',
      error: 'text-error',
      warning: 'text-warning',
      info: 'text-info',
      white: 'text-white',
      muted: 'text-gray-400',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
});

interface IconProps
  extends Omit<React.HTMLAttributes<HTMLOrSVGElement>, 'color'>,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon;
  'aria-label'?: string;
}

export function Icon({
  icon: IconComponent,
  size,
  color,
  className,
  'aria-label': ariaLabel,
  ...props
}: Readonly<IconProps>) {
  return (
    <IconComponent
      data-component="Icon"
      data-size={size}
      data-color={color}
      className={cn(iconVariants({ size, color }), className)}
      aria-label={ariaLabel}
      {...props}
    />
  );
}

