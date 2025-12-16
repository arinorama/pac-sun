import NextLink from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const linkVariants = cva(
  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'text-brand-black underline-offset-4 hover:underline focus-visible:ring-gray-300',
        underline: 'text-brand-white font-poppins font-medium uppercase underline underline-offset-2 hover:opacity-80',
        category: 'block bg-[#441212] text-white text-center py-4 px-1 text-[1.25vw] md:text-[1.25vw] text-base font-medium uppercase hover:underline underline-offset-[1.5px] decoration-[1px] transition-all',
        footer: 'text-sm text-gray-600 hover:text-gray-900 transition-colors',
        social: 'flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export function Link({
  variant,
  href,
  children,
  className,
  external,
  ...props
}: Readonly<LinkProps>) {
  const baseClassName = cn(linkVariants({ variant }), className);
  
  if (external) {
    return (
      <a
        data-component="Link"
        data-variant={variant}
        href={href}
        className={baseClassName}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink
      data-component="Link"
      data-variant={variant}
      href={href}
      className={baseClassName}
      {...props}
    >
      {children}
    </NextLink>
  );
}

