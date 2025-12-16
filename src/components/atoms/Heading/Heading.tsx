import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('', {
  variants: {
    level: {
      h1: 'text-5xl font-normal uppercase leading-none',
      h2: 'text-2xl md:text-3xl lg:text-4xl font-normal uppercase tracking-wide',
      h3: 'text-xl md:text-2xl font-bold',
      h4: 'text-xs md:text-sm uppercase font-bold tracking-wide',
    },
    size: {
      sm: 'text-2xl md:text-3xl',
      md: 'text-2xl md:text-4xl',
      lg: 'text-5xl',
      xl: 'text-5xl md:text-6xl',
    },
    font: {
      poppins: 'font-poppins',
      sans: 'font-sans',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    textColor: {
      default: 'text-gray-900',
      white: 'text-brand-white',
      black: 'text-black',
    },
    tracking: {
      normal: 'tracking-normal',
      tight: 'tracking-tight',
      wide: 'tracking-wide',
    },
  },
  defaultVariants: {
    level: 'h2',
    textColor: 'default',
    weight: 'normal',
    tracking: 'normal',
  },
});

interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

export function Heading({
  as,
  level,
  size,
  font,
  weight,
  textColor,
  tracking,
  children,
  className,
  ...props
}: Readonly<HeadingProps>) {
  const Component = as || (level?.replace('h', 'h') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') || 'h2';
  
  return (
    <Component
      data-component="Heading"
      data-level={level}
      className={cn(headingVariants({ level, size, font, weight, textColor, tracking }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

