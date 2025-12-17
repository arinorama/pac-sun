import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const dividerVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'w-full h-px',
      vertical: 'h-full w-px',
    },
    variant: {
      solid: 'bg-gray-200',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    },
    spacing: {
      none: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
  compoundVariants: [
    // Horizontal spacing
    {
      orientation: 'horizontal',
      spacing: 'sm',
      className: 'my-2',
    },
    {
      orientation: 'horizontal',
      spacing: 'md',
      className: 'my-4',
    },
    {
      orientation: 'horizontal',
      spacing: 'lg',
      className: 'my-6',
    },
    {
      orientation: 'horizontal',
      spacing: 'xl',
      className: 'my-8',
    },
    // Vertical spacing
    {
      orientation: 'vertical',
      spacing: 'sm',
      className: 'mx-2',
    },
    {
      orientation: 'vertical',
      spacing: 'md',
      className: 'mx-4',
    },
    {
      orientation: 'vertical',
      spacing: 'lg',
      className: 'mx-6',
    },
    {
      orientation: 'vertical',
      spacing: 'xl',
      className: 'mx-8',
    },
    // Dashed and dotted need border
    {
      variant: 'dashed',
      orientation: 'horizontal',
      className: 'border-t border-gray-200',
    },
    {
      variant: 'dotted',
      orientation: 'horizontal',
      className: 'border-t border-gray-200',
    },
    {
      variant: 'dashed',
      orientation: 'vertical',
      className: 'border-l border-gray-200',
    },
    {
      variant: 'dotted',
      orientation: 'vertical',
      className: 'border-l border-gray-200',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
    spacing: 'md',
  },
});

interface DividerProps
  extends React.HTMLAttributes<HTMLHRElement>,
    VariantProps<typeof dividerVariants> {
  label?: string;
}

export function Divider({
  orientation,
  variant,
  spacing,
  className,
  label,
  ...props
}: Readonly<DividerProps>) {
  if (label && orientation === 'horizontal') {
    return (
      <div
        data-component="Divider.WithLabel"
        className={cn('flex items-center', spacing === 'sm' && 'my-2', spacing === 'md' && 'my-4', spacing === 'lg' && 'my-6', spacing === 'xl' && 'my-8')}
      >
        <hr
          data-component="Divider"
          data-orientation={orientation}
          data-variant={variant}
          className={cn(dividerVariants({ orientation, variant, spacing: 'none' }), 'flex-1', className)}
          {...props}
        />
        <span
          data-component="Divider.Label"
          className="px-4 text-sm text-gray-500 whitespace-nowrap"
        >
          {label}
        </span>
        <hr
          data-component="Divider"
          data-orientation={orientation}
          data-variant={variant}
          className={cn(dividerVariants({ orientation, variant, spacing: 'none' }), 'flex-1', className)}
          {...props}
        />
      </div>
    );
  }

  return (
    <hr
      data-component="Divider"
      data-orientation={orientation}
      data-variant={variant}
      className={cn(dividerVariants({ orientation, variant, spacing }), className)}
      {...props}
    />
  );
}

