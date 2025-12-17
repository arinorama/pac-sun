import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SocialLinksProps {
  links: SocialLink[];
  variant?: 'default' | 'icon-only' | 'vertical';
  iconSize?: 'sm' | 'md' | 'lg';
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
}

export function SocialLinks({
  links,
  variant = 'default',
  iconSize = 'md',
  className,
  iconClassName,
  labelClassName,
}: Readonly<SocialLinksProps>) {
  const iconSizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[iconSize];

  const containerClass = cn(
    'flex',
    variant === 'vertical' ? 'flex-col space-y-3' : 'flex-row space-x-4',
    className
  );

  return (
    <div data-component="SocialLinks" className={containerClass}>
      {links.map((link) => {
        const Icon = link.icon;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors',
              variant === 'icon-only' && 'justify-center'
            )}
            aria-label={link.label}
          >
            <Icon className={cn(iconSizeClass, iconClassName)} />
            {variant !== 'icon-only' && (
              <span className={cn('text-sm', labelClassName)}>{link.label}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

