import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva('animate-pulse bg-gray-200 rounded', {
  variants: {
    variant: {
      default: 'bg-gray-200',
      light: 'bg-gray-100',
      dark: 'bg-gray-300',
    },
    shape: {
      rectangle: 'rounded',
      circle: 'rounded-full',
      text: 'rounded h-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    shape: 'rectangle',
  },
});

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  variant,
  shape,
  className,
  width,
  height,
  count = 1,
  style,
  ...props
}: Readonly<SkeletonProps>) {
  const skeletonStyle = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    ...style,
  };

  if (count > 1) {
    return (
      <div data-component="Skeleton.Container" className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            data-component="Skeleton"
            data-variant={variant}
            data-shape={shape}
            className={cn(skeletonVariants({ variant, shape }), className)}
            style={skeletonStyle}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      data-component="Skeleton"
      data-variant={variant}
      data-shape={shape}
      className={cn(skeletonVariants({ variant, shape }), className)}
      style={skeletonStyle}
      {...props}
    />
  );
}

