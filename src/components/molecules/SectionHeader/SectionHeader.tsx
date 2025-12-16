import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeader({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: Readonly<SectionHeaderProps>) {
  if (!title && !subtitle) {
    return null;
  }

  return (
    <div
      data-component="SectionHeader"
      className={cn('text-center mb-4 md:mb-6 lg:mb-8', className)}
    >
      {title && (
        <Heading
          data-component="SectionHeader.Title"
          level="h2"
          className={cn('font-normal uppercase', titleClassName)}
        >
          {title}
        </Heading>
      )}
      {subtitle && (
        <Text
          data-component="SectionHeader.Subtitle"
          variant="body"
          color="muted"
          className={cn('mt-2', subtitleClassName)}
        >
          {subtitle}
        </Text>
      )}
    </div>
  );
}

