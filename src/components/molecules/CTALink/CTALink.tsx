import { cva, type VariantProps } from 'class-variance-authority';
import { Link } from '@/components/atoms/Link';
import { cn } from '@/lib/utils';

const ctaLinkVariants = cva('', {
  variants: {
    variant: {
      underline: 'text-brand-white font-poppins font-medium uppercase underline underline-offset-2 hover:opacity-80 transition-opacity px-2 py-1',
      button: 'inline-block border-2 border-white text-white uppercase font-bold text-xs md:text-sm py-2 md:py-3 px-6 md:px-8 hover:bg-white hover:text-black transition-all duration-200',
      border: 'inline-block border-2 border-white px-6 py-2 text-sm font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200',
      banner: 'text-brand-white font-poppins font-medium uppercase underline underline-offset-2 hover:opacity-80 transition-opacity px-2 py-1',
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
});

interface CTALinkProps
  extends Omit<React.ComponentProps<typeof Link>, 'variant'>,
    VariantProps<typeof ctaLinkVariants> {
  href: string;
  children: React.ReactNode;
}

export function CTALink({
  variant,
  href,
  children,
  className,
  ...props
}: Readonly<CTALinkProps>) {
  return (
    <Link
      data-component="CTALink"
      data-variant={variant}
      href={href}
      className={cn(ctaLinkVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Link>
  );
}

