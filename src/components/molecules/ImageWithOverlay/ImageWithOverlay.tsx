import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Constants
const VALID_ASPECT_RATIO_VARIANTS = ['square', 'portrait', 'landscape', 'video'] as const;
type AspectRatioVariant = typeof VALID_ASPECT_RATIO_VARIANTS[number];

const OVERLAY_OPACITY_THRESHOLDS = {
  LIGHT: 30,
  DARK: 60,
} as const;

const DEFAULT_SIZES = '(max-width: 767px) 50vw, (max-width: 1311px) 25vw, 306px' as const;

// Helper function to convert numeric opacity to variant
const getOverlayOpacityVariant = (
  opacity: number | 'light' | 'medium' | 'dark' | undefined
): 'light' | 'medium' | 'dark' => {
  if (typeof opacity === 'number') {
    if (opacity <= OVERLAY_OPACITY_THRESHOLDS.LIGHT) return 'light';
    if (opacity >= OVERLAY_OPACITY_THRESHOLDS.DARK) return 'dark';
    return 'medium';
  }
  return opacity || 'medium';
};

// Helper function to check if aspectRatio is a custom value
const isCustomAspectRatio = (
  aspectRatio: string,
  validVariants: readonly string[]
): boolean => {
  return !validVariants.includes(aspectRatio);
};

const imageWithOverlayVariants = cva('relative overflow-hidden w-full h-full', {
  variants: {
    aspectRatio: {
      square: '',
      portrait: '',
      landscape: '',
      video: '',
    },
  },
  defaultVariants: {
    aspectRatio: 'portrait',
  },
});

const imageContainerVariants = cva('relative w-full h-full', {
  variants: {
    aspectRatio: {
      square: 'aspect-square',
      portrait: 'aspect-[306/475]',
      landscape: 'aspect-video',
      video: 'aspect-video',
    },
  },
  defaultVariants: {
    aspectRatio: 'portrait',
  },
});

const overlayVariants = cva('absolute inset-0', {
  variants: {
    overlay: {
      gradient: 'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
      solid: 'bg-black/40',
      none: '',
    },
    overlayOpacity: {
      light: 'opacity-30',
      medium: 'opacity-40',
      dark: 'opacity-60',
    },
  },
  defaultVariants: {
    overlay: 'gradient',
    overlayOpacity: 'medium',
  },
});

type AspectRatioValue = AspectRatioVariant | string;

interface ImageWithOverlayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof imageWithOverlayVariants>, 'aspectRatio'>,
    Omit<VariantProps<typeof overlayVariants>, 'overlayOpacity'> {
  src: string;
  alt: string;
  aspectRatio?: AspectRatioValue;
  overlay?: 'gradient' | 'solid' | 'none';
  overlayColor?: string;
  overlayOpacity?: number | 'light' | 'medium' | 'dark';
  children?: React.ReactNode;
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  contentClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function ImageWithOverlay({
  src,
  alt,
  aspectRatio = 'portrait',
  overlay = 'gradient',
  overlayColor,
  overlayOpacity,
  children,
  className,
  imageClassName,
  overlayClassName,
  contentClassName,
  sizes = DEFAULT_SIZES,
  priority = false,
  ...props
}: Readonly<ImageWithOverlayProps>) {
  const hasCustomAspectRatio = isCustomAspectRatio(aspectRatio, VALID_ASPECT_RATIO_VARIANTS);
  
  const aspectRatioVariant: AspectRatioVariant = hasCustomAspectRatio
    ? 'portrait'
    : (aspectRatio as AspectRatioVariant);
  
  const overlayOpacityVariant = getOverlayOpacityVariant(overlayOpacity);

  return (
    <div
      data-component="ImageWithOverlay"
      data-overlay={overlay}
      data-aspect-ratio={aspectRatioVariant}
      className={cn(imageWithOverlayVariants({ aspectRatio: aspectRatioVariant }), className)}
      {...props}
    >
      <div
        className={cn(
          imageContainerVariants({ aspectRatio: aspectRatioVariant }),
          hasCustomAspectRatio && `aspect-[${aspectRatio}]`
        )}
        style={hasCustomAspectRatio ? { aspectRatio } : undefined}
      >
        <Image
          data-component="ImageWithOverlay.Image"
          src={src}
          alt={alt}
          fill
          className={cn('object-cover', imageClassName)}
          sizes={sizes}
          priority={priority}
        />
        {overlay !== 'none' && (
          <div
            data-component="ImageWithOverlay.Overlay"
            className={cn(
              overlayVariants({ overlay, overlayOpacity: overlayOpacityVariant }),
              overlay === 'solid' && overlayColor && 'bg-transparent',
              overlayClassName
            )}
            style={
              overlay === 'solid' && overlayColor
                ? { 
                    backgroundColor: overlayColor, 
                    opacity: typeof overlayOpacity === 'number' ? overlayOpacity / 100 : undefined
                  }
                : undefined
            }
          />
        )}
        {children && (
          <div
            data-component="ImageWithOverlay.Content"
            className={cn('absolute inset-0', contentClassName)}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

