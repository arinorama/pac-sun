import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva('', {
  variants: {
    variant: {
      body: 'text-base',
      bodySm: 'text-sm',
      caption: 'text-xs',
      subtitle: 'text-base md:text-lg lg:text-xl',
      subtitleSm: 'text-sm md:text-base',
    },
    color: {
      default: 'text-gray-900',
      muted: 'text-gray-600',
      white: 'text-white',
      black: 'text-black',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    tracking: {
      normal: 'tracking-normal',
      tight: 'tracking-tight',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'default',
    weight: 'normal',
    tracking: 'normal',
  },
});

interface TextProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
  children: React.ReactNode;
}

export function Text({
  as = 'p',
  variant,
  color,
  weight,
  tracking,
  children,
  className,
  ...props
}: Readonly<TextProps>) {
  const Component = as;
  
  return (
    <Component
      data-component="Text"
      data-variant={variant}
      className={cn(textVariants({ variant, color, weight, tracking }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

